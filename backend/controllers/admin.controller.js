import { User } from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import { Vendor } from "../models/vendor.model.js";
import { ServiceCategory } from "../models/ServiceCategory.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

import adminService from "../models/adminService.model.js";
import Withdrawal from "../models/withdrawal.model.js";
import Notification from "../models/notification.model.js";



// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsersAdmin = async (req, res) => {
  try {
    const { role } = req.query   // ✅ ADD THIS LINE

    let filter = {}

    if (role) {
      filter.roles = { $in: [role] }  // ✅ IMPORTANT (you are using roles array, not role)
    }

    const users = await User.find(filter).select("-password");

    // Standardize response to include `data` for frontend
    res.json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// @desc    Get all vendors
// @route   GET /api/admin/vendors
// @access  Admin
const getAllVendorsAdmin = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("user", "name email");

    res.json({
      success: true,
      count: vendors.length,
      data: vendors
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// @desc    Verify vendor
// @route   PUT /api/admin/vendors/:id/verify
// @access  Admin
const verifyVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    vendor.isVerified = true;
    await vendor.save();

    res.json({
      success: true,
      message: "Vendor verified",
      vendor
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// @desc    Delete vendor
// @route   DELETE /api/admin/vendors/:id
// @access  Admin
const deleteVendorAdmin = async (req, res) => {
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign role to user
// @route   PUT /api/admin/users/:id/assign-role
// @access  Admin
const assignRoleToUser = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'vendor'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent removing admin role
    if (user.roles.includes('admin')) {
      return res.status(403).json({ success: false, message: "Cannot modify admin roles" });
    }

    // Add role if not already present
    if (!user.roles.includes(role)) {
      user.roles.push(role);
      await user.save();
      return res.json({
        success: true,
        message: `Role '${role}' assigned to user`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          activeRole: user.activeRole
        }
      });
    } else {
      return res.status(400).json({ success: false, message: `User already has '${role}' role` });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove role from user
// @route   PUT /api/admin/users/:id/remove-role
// @access  Admin
const removeRoleFromUser = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'vendor'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent removing admin role
    if (user.roles.includes('admin')) {
      return res.status(403).json({ success: false, message: "Cannot modify admin roles" });
    }

    // Prevent removing all roles
    if (user.roles.length === 1 && user.roles.includes(role)) {
      return res.status(400).json({ success: false, message: "User must have at least one role" });
    }

    // Remove role if present
    if (user.roles.includes(role)) {
      user.roles = user.roles.filter(r => r !== role);

      // If active role is removed, set it to another available role
      if (user.activeRole === role) {
        user.activeRole = user.roles[0];
      }

      await user.save();
      return res.json({
        success: true,
        message: `Role '${role}' removed from user`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          activeRole: user.activeRole
        }
      });
    } else {
      return res.status(400).json({ success: false, message: `User does not have '${role}' role` });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user roles
// @route   GET /api/admin/users/:id/roles
// @access  Admin
const getUserRoles = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email roles activeRole');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        activeRole: user.activeRole
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// @desc    Get user by id
// @route   GET /api/admin/users/:id
// @access  Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
// @access  Admin
const updateUser = async (req, res) => {
  try {
    const allowedFields = ['name', 'email', 'phone', 'address', 'status', 'activeRole'];
    const updates = {};
    allowedFields.forEach(f => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Prevent accidental admin role changes via this endpoint
    if (user.roles.includes('admin') && updates.activeRole && updates.activeRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot change active role of an admin via this endpoint' });
    }

    Object.assign(user, updates);
    await user.save();

    res.json({ success: true, message: 'User updated', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
/**
 * =========================
 * CREATE CATEGORY
 * =========================
 */


const createCategory = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { addCategory, status } = req.body;

    // ✅ safer check
    if (!req.files?.image?.[0]) {
      return res.status(400).json({
        success: false,
        message: "Category image is required",
      });
    }

    const imageUpload = await uploadToCloudinary(
      req.files.image[0],
      "categories/image"
    );

    const category = await ServiceCategory.create({
      addCategory: addCategory || "general",
      status: status === "true" || status === true,
      image: imageUpload.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating category",
    });
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



// SERVICE MANAGEMENT

/**
 * =========================
 * CREATE SERVICE
 * =========================
 */

const createService = async (req, res) => {
  try {
    let { category, plans, requirements, status } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // 🔥 AUTO FIX (IMPORTANT)
    if (category.length === 24) {
      const cat = await ServiceCategory.findById(category);
      if (cat) {
        category = cat.addCategory; // convert ID → NAME
      }
    }

    const service = await adminService.create({
      category,
      plans,
      requirements,
      status,
    });

    return res.status(201).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("CREATE SERVICE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await adminService
      .find()
      .populate("category", "addCategory") // ✅ FIX: populate category name
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await adminService.findById(req.params.id).populate(
      "category",
      "addCategory"
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const { title, category, plans, status } = req.body;

    const categoryDoc = await ServiceCategory.findById(category);

    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const service = await adminService.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category: categoryDoc._id,
        plans,
        status,
      },
      { new: true }
    );

    res.json({
      success: true,
      service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await adminService.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      message: "Service deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all reviews across bookings
const getAllReviewsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = { 'review.rating': { $exists: true, $ne: null } };

    const total = await Booking.countDocuments(filter);
    const items = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('vendor', 'businessName')
      .select('service review bookingDate createdAt')
      .sort({ 'review.reviewedAt': -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const reviews = items.map((b) => ({
      id: b._id,
      user: b.user?.name || b.user?.email || 'User',
      vendor: b.vendor?.businessName || b.vendor?.name || 'Vendor',
      service: b.service?.title || b.service || '',
      rating: b.review?.rating || 0,
      comment: b.review?.comment || '',
      date: b.review?.reviewedAt || b.createdAt,
    }));

    return res.json({ success: true, page: Number(page), limit: Number(limit), total, reviews });
  } catch (err) {
    console.error('Get All Reviews Admin Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: delete review (clear review object on booking)
const deleteReview = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.review = {};
    await booking.save();

    return res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    console.error('Delete Review Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get all transactions across platform
const getAllTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = { 'payment.paid': true };
    const total = await Booking.countDocuments(filter);

    const items = await Booking.find(filter)
      .populate('vendor', 'businessName')
      .populate('user', 'name email')
      .sort({ 'payment.createdAt': -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('payment vendor user createdAt')
      .lean();

    const transactions = items.map((b) => ({
      id: b._id,
      vendor: b.vendor?.businessName || b.vendor?.name || 'Vendor',
      user: b.user?.name || b.user?.email || 'User',
      amount: b.payment?.amount || 0,
      transactionId: b.payment?.transactionId || null,
      method: b.payment?.method || 'stripe',
      date: b.payment?.createdAt || b.createdAt,
    }));

    return res.json({ success: true, page, limit, total, transactions });
  } catch (err) {
    console.error('Get All Transactions Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: list all withdrawal requests
const getAllWithdrawals = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const total = await Withdrawal.countDocuments(filter);
    const items = await Withdrawal.find(filter)
      .populate('vendor', 'businessName user')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const withdrawals = items.map((w) => ({
      id: w._id,
      vendor: w.vendor?.businessName || w.vendor?.name || 'Vendor',
      amount: w.amount,
      method: w.method,
      status: w.status,
      date: w.createdAt,
    }));

    return res.json({ success: true, page, limit, total, withdrawals });
  } catch (err) {
    console.error('Get All Withdrawals Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: approve/reject withdrawal
const updateWithdrawalStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body; // expected: 'Approved' or 'Rejected' or 'pending'

    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) return res.status(404).json({ success: false, message: 'Withdrawal not found' });

    withdrawal.status = status;
    await withdrawal.save();

    return res.json({ success: true, message: 'Withdrawal updated', withdrawal });
  } catch (err) {
    console.error('Update Withdrawal Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Create notification
const createNotification = async (req, res) => {
  try {
    const { recipientType = 'all', specificId, title, message } = req.body;
    if (!title || !message) return res.status(400).json({ success: false, message: 'Title and message required' });

    const notification = await Notification.create({ recipientType, specificId, title, message, type: recipientType === 'all' ? 'Broadcast' : 'Targeted', recipientLabel: recipientType === 'specific' ? `ID: ${specificId}` : recipientType });

    return res.status(201).json({ success: true, notification });
  } catch (err) {
    console.error('Create Notification Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: list notifications
const getAllNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const total = await Notification.countDocuments({});
    const items = await Notification.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

    return res.json({ success: true, page, limit, total, notifications: items });
  } catch (err) {
    console.error('Get Notifications Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: delete notification
const deleteNotification = async (req, res) => {
  try {
    const id = req.params.id;
    const n = await Notification.findByIdAndDelete(id);
    if (!n) return res.status(404).json({ success: false, message: 'Notification not found' });
    return res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    console.error('Delete Notification Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export {
  getAllUsersAdmin,
  deleteUser,
  getAllVendorsAdmin,
  verifyVendor,
  deleteVendorAdmin,
  assignRoleToUser,
  removeRoleFromUser,
  getUserRoles,
  getUserById,
  updateUser,
  createCategory,
  getCategories,
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  // admin reviews
  getAllReviewsAdmin,
  deleteReview,
  // payments/withdrawals
  getAllTransactions,
  getAllWithdrawals,
  updateWithdrawalStatus,
  // notifications
  createNotification,
  getAllNotifications,
  deleteNotification,
};

