import { Vendor } from "../models/vendor.model.js";
import { User } from "../models/user.model.js";

// @desc    Create Vendor Profile
// @route   POST /api/vendors
// @access  Private (Vendor only)
const createVendor = async (req, res) => {
  try {
    const { businessName, serviceType, experience, location, phone, description } = req.body;

    // Get ID safely from req.user (attached by protect middleware)
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check role
    if (!req.user.roles.includes("vendor")) {
      return res.status(403).json({ success: false, message: "Only vendors can create profile" });
    }

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ user: userId });

    if (existingVendor) {
      return res.status(400).json({ success: false, message: "Vendor profile already exists" });
    }

    // Create vendor
    const newVendor = await Vendor.create({
      user: userId,
      businessName,
      serviceType,
      experience,
      location,
      phone,
      description
    });

    res.status(201).json({
      success: true,
      message: "Vendor profile created",
      vendor: newVendor
    });

  } catch (error) {
    // Log the specific validation error if Mongoose fails
    if (error.name === 'ValidationError') {
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
    const vendors = await Vendor.find()
      .populate("user", "name email");

    res.json({
      success: true,
      count: vendors.length,
      vendors
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
    const vendor = await Vendor.findById(req.params.id)
      .populate("user", "name email");

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.json({
      success: true,
      vendor
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
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    // Only owner or admin can update
    if (vendor.user.toString() !== req.user.id && req.activeRole !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Vendor updated",
      vendor
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
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    await vendor.deleteOne();

    res.json({
      success: true,
      message: "Vendor deleted"
    });

  } catch (error) {
    console.error("❌ Delete Vendor Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor
};