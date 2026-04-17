import { Vendor } from "../models/vendor.model.js";
import { User } from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import Withdrawal from "../models/withdrawal.model.js";
import Service from "../models/adminService.model.js";
import { ServiceCategory } from "../models/ServiceCategory.model.js";

// @desc    Create Vendor Profile
// @route   POST /api/vendors
// @access  Private (Vendor only)
const createVendor = async (req, res) => {
  try {
    const {
      businessName,
      serviceType,
      experience,
      location,
      phone,
      description,
    } = req.body;

    // Get ID safely from req.user (attached by protect middleware)
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check role
    if (!req.user.roles.includes("vendor")) {
      return res
        .status(403)
        .json({ success: false, message: "Only vendors can create profile" });
    }

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ user: userId });

    if (existingVendor) {
      return res
        .status(400)
        .json({ success: false, message: "Vendor profile already exists" });
    }

    // Create vendor
    const newVendor = await Vendor.create({
      user: userId,
      businessName,
      serviceType,
      experience,
      location,
      phone,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Vendor profile created",
      vendor: newVendor,
    });
  } catch (error) {
    // Log the specific validation error if Mongoose fails
    if (error.name === "ValidationError") {
      console.error("❌ Schema Validation Error:", error.message);
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Vendors
// @route   GET /api/vendors
// @access  Public
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("user", "name email");

    res.json({
      success: true,
      count: vendors.length,
      vendors,
    });
  } catch (error) {
    console.error("❌ Get Vendors Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Vendor
// @route   GET /api/vendors/:id
// @access  Public
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    res.json({
      success: true,
      vendor,
    });
  } catch (error) {
    console.error("❌ Get Vendor Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Vendor
// @route   PUT /api/vendors/:id
// @access  Private (Vendor / Admin)
const updateVendor = async (req, res) => {
  try {
    let vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    // Only owner or admin can update
    if (vendor.user.toString() !== req.user.id && req.activeRole !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      success: true,
      message: "Vendor updated",
      vendor,
    });
  } catch (error) {
    console.error("❌ Update Vendor Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Vendor
// @route   DELETE /api/vendors/:id
// @access  Private/Admin
const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    await vendor.deleteOne();

    res.json({
      success: true,
      message: "Vendor deleted",
    });
  } catch (error) {
    console.error("❌ Delete Vendor Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Vendor - earnings summary
const getEarnings = async (req, res) => {
  try {
    // vendor must be authenticated
    const vendorId = req.user._id || req.user.id;

    // aggregate confirmed bookings with payments
    const pipeline = [
      { $match: { vendor: vendorId, "payment.paid": true } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$payment.amount" },
          bookings: {
            $push: {
              id: "$_id",
              amount: "$payment.amount",
              date: "$createdAt",
              transactionId: "$payment.transactionId",
            },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ];

    const agg = await Booking.aggregate(pipeline);

    // total earnings
    const total = agg.reduce((acc, cur) => acc + (cur.total || 0), 0);

    // recent payments list (limit 20)
    const recent = await Booking.find({
      vendor: vendorId,
      "payment.paid": true,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select(
        "payment.createdAt payment.amount payment.transactionId payment.method",
      )
      .lean();

    res.json({ success: true, total, breakdown: agg, recent });
  } catch (err) {
    console.error("Get Earnings Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/vendors/payments?page=1&limit=20
const getPayments = async (req, res) => {
  try {
    const vendorId = req.user._id || req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = { vendor: vendorId, "payment.paid": true };

    const total = await Booking.countDocuments(filter);
    const items = await Booking.find(filter)
      .sort({ "payment.createdAt": -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "payment.createdAt payment.amount payment.transactionId payment.method",
      )
      .lean();

    // normalize
    const payments = items.map((r) => ({
      id: r.payment?.transactionId || r._id,
      date: r.payment?.createdAt || r.createdAt,
      amount: r.payment?.amount || 0,
      method: r.payment?.method || "stripe",
    }));

    res.json({ success: true, total, page, limit, payments });
  } catch (err) {
    console.error("Get Payments Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create a withdrawal request (vendor)
const createWithdrawal = async (req, res) => {
  try {
    const vendorId = req.user._id || req.user.id;
    const { amount, method } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const withdrawal = await Withdrawal.create({
      vendor: vendorId,
      amount: Number(amount),
      method: method || "bank",
      status: "pending",
    });

    // TODO: notify admin or create payout workflow

    res.status(201).json({ success: true, withdrawal });
  } catch (err) {
    console.error("Create Withdrawal Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
// Get withdrawals for authenticated vendor
const getVendorWithdrawals = async (req, res) => {
  try {
    const vendorId = req.user._id || req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const filter = { vendor: vendorId };
    const total = await Withdrawal.countDocuments(filter);
    const items = await Withdrawal.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const withdrawals = items.map((w) => ({
      id: w._id,
      amount: w.amount,
      method: w.method,
      status: w.status,
      createdAt: w.createdAt,
      vendor: w.vendor,
    }));

    return res.json({ success: true, page, limit, total, withdrawals });
  } catch (err) {
    console.error("Get Vendor Withdrawals Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
const getCategories = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { addCategory: { $regex: search, $options: "i" } },
      ],
    };

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

const getPlansByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const services = await Service.find({
      category: { $regex: category, $options: "i" },
      status: "Active",
    }).select("plans");

    if (!services.length) {
      return res.status(404).json({
        success: false,
        message: "No plans found for this category",
      });
    }

    return res.json({
      success: true,
      data: services.flatMap((s) => s.plans),
    });
  } catch (error) {
    console.error("GET PLANS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET vendor reviews (bookings with reviews for the authenticated vendor)
const getReviews = async (req, res) => {
  try {
    const vendorId = req.user._id || req.user.id;

    const reviews = await Booking.find({
      vendor: vendorId,
      'review.rating': { $exists: true, $ne: null },
    })
      .populate('user', 'name email')
      .select('service review bookingDate createdAt')
      .sort({ 'review.reviewedAt': -1, createdAt: -1 })
      .lean();

    const formatted = reviews.map((b) => ({
      id: b._id,
      customer: b.user?.name || b.user?.email,
      date: b.review?.reviewedAt || b.createdAt,
      rating: b.review?.rating || 0,
      comment: b.review?.comment || '',
      service: b.service?.title || '',
      reply: b.review?.vendorReply || null,
    }));

    return res.json({ success: true, count: formatted.length, reviews: formatted });
  } catch (err) {
    console.error('Get Vendor Reviews Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
export {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  getPayments,
  createWithdrawal,
  getVendorWithdrawals,
  getEarnings,
  getCategories,
  getPlansByCategory,
  getReviews,
};
