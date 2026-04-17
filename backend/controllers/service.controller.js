import Service from "../models/service.model.js";
import { ServiceCategory } from "../models/ServiceCategory.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

// Public - list services
const getAllServices = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      minRating,
      availableNow,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Price filter using plans array
    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);
      query.plans = { $elemMatch: { price: priceQuery } };
    }

    const skip = (Number(page) - 1) * Number(limit);

    let services = await Service.find(query)
      .populate("vendor", "name email businessName")
      .populate("category", "name")
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Availability filter (post-query)
    if (availableNow === "true" || availableNow === true) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      services = services.filter((s) => {
        if (!s.startTime || !s.endTime) return false;
        // Expecting format HH:MM or HH:MM AM/PM - try to parse HH:MM 24h first
        const parseTime = (t) => {
          if (!t) return null;
          // remove AM/PM
          const ampmMatch = t.match(/(AM|PM)$/i);
          if (ampmMatch) {
            // parse 12-hour
            const parts = t.split(" ");
            const timePart = parts[0];
            const modifier = parts[1];
            let [hh, mm] = timePart.split(":").map(Number);
            if (/PM/i.test(modifier) && hh !== 12) hh += 12;
            if (/AM/i.test(modifier) && hh === 12) hh = 0;
            return hh * 60 + (mm || 0);
          }
          const [hh, mm] = t.split(":").map(Number);
          return (hh || 0) * 60 + (mm || 0);
        };

        const start = parseTime(s.startTime);
        const end = parseTime(s.endTime);
        if (start == null || end == null) return false;
        if (start <= end) {
          return currentMinutes >= start && currentMinutes <= end;
        }
        // overnight shift e.g., start 22:00 end 06:00
        return currentMinutes >= start || currentMinutes <= end;
      });
    }

    const total = await Service.countDocuments(query);

    return res.json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      total,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get Services Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public - get service by id
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "vendor",
      "businessName",
    );
    if (!service)
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    res.json({ success: true, service });
  } catch (error) {
    console.error("Get Service Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Private - vendor creates service
const createService = async (req, res) => {
  try {
    if (!req.user || !req.user.roles.includes("vendor")) {
      return res.status(403).json({
        success: false,
        message: "Only vendors can create services",
      });
    }

    let { title, description, category, plans, startTime, endTime } = req.body;

    // ✅ Parse plans safely
    if (plans && typeof plans === "string") {
      try {
        plans = JSON.parse(plans);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid plans format",
        });
      }
    }

    // 🚨 IMPORTANT FIX: force cloudinary only
    let imageUrl = null;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    // Log the full req.file object for debugging
    console.log("createService - req.file:", req.file);

    // Upload to Cloudinary and use the secure URL
    const result = await uploadToCloudinary(req.file, "services");
    console.log("Cloudinary upload result:", result && result.secure_url);
    imageUrl = result?.secure_url || null;

    const newService = await Service.create({
      title,
      description,
      image: imageUrl,
      category,
      plans,
      startTime: startTime || null,
      endTime: endTime || null,
      vendor: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Service created",
      service: newService,
    });
  } catch (error) {
    console.error("🔥 Create Service Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Private - vendor/admin update
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // authorization
    if (
      req.user._id.toString() !== service.vendor?.toString() &&
      req.activeRole !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // ✅ ONLY ONE CLOUDINARY UPLOAD
    if (req.file) {
      console.log("📁 Updating image...");

      const result = await uploadToCloudinary(req.file, "services");

      req.body.image = result.secure_url;
    }

    // parse plans
    if (req.body.plans && typeof req.body.plans === "string") {
      try {
        req.body.plans = JSON.parse(req.body.plans);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid plans format",
        });
      }
    }

    Object.assign(service, req.body);
    await service.save();

    res.json({
      success: true,
      message: "Service updated",
      service,
    });
  } catch (error) {
    console.error("Update Service Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin - delete
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    await service.deleteOne();
    res.json({ success: true, message: "Service deleted" });
  } catch (error) {
    console.error("Delete Service Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public - get services by category id
const getServicesByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const services = await Service.find({ category: categoryId })
      .populate("vendor", "businessName")
      .populate("category", "addCategory name")
      .lean();

    return res.json({ success: true, count: services.length, services });
  } catch (error) {
    console.error("Get Services By Category Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * =========================
 * GET CATEGORY LIST
 * =========================
 */
const getCategories = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { slug: { $regex: search, $options: "i" } },
            { addCategory: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const categories = await ServiceCategory.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await ServiceCategory.countDocuments(query);

    return res.json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      total,
      data: categories,
    });
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getCategories,
  getServicesByCategory,
};
