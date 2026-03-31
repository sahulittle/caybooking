import { User } from "../models/user.model.js";
import { Vendor } from "../models/vendor.model.js";


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

    res.json({
      success: true,
      count: users.length,
      users
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
      vendors
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

export {
  getAllUsersAdmin,
  deleteUser,
  getAllVendorsAdmin,
  verifyVendor,
  deleteVendorAdmin,
  assignRoleToUser,
  removeRoleFromUser,
  getUserRoles
};