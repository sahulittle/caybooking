import { User } from '../models/user.model.js';
import { Vendor } from '../models/vendor.model.js';
import generateToken from '../utils/generateToken.js';
import { ServiceCategory } from '../models/ServiceCategory.model.js';
import Service from '../models/service.model.js'; // ✅ ADD

// @desc    Register or login a user
// @route   POST /api/signup
// @access  Public
const signupUser = async (req, res) => {
  try {
    const { name, email, password, role, googleId } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and Email are required' });
    }
    if (!role) {
      return res.status(400).json({ success: false, message: 'Please select a role (user or vendor)' });
    }
    if (role === 'admin') {
      return res.status(400).json({ success: false, message: 'Admin registration not allowed' });
    }
    if (!['user', 'vendor'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    if (!password && !googleId) {
      return res.status(400).json({ success: false, message: 'Password or Google login required' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If it's a Google sign-in and the user exists, treat it as a login.
      if (googleId && existingUser.googleId === googleId) {
        const token = generateToken(existingUser._id, existingUser.email, role);
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          token: `Bearer ${token}`,
          user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            roles: existingUser.roles,
            activeRole: role
          },
        });
      }
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password, // Will be hashed by pre-save hook if it exists
      roles: [role],
      activeRole: role,
      googleId,
    });

    // If role is vendor, also create a record in the Vendor collection
    if (role === 'vendor') {
      await Vendor.create({
        user: newUser._id,
        businessName: name,
        serviceType: 'plumbing',
        status: 'Pending Approval'
      });
    }

    const token = generateToken(newUser._id, newUser.email, role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token: `Bearer ${token}`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        roles: newUser.roles,
        activeRole: role,
      },
    });

  } catch (error) {
    console.error("❌ Signup Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A user with that email or Google ID already exists.' });
    }
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password, role, googleId } = req.body;

    // ✅ VALIDATION - require email and role, allow either password or googleId
    if (!email || !role) {
      return res.status(400).json({ success: false, message: 'Email and role are required' });
    }

    if (!password && !googleId) {
      return res.status(400).json({ success: false, message: 'Password or Google ID required for login' });
    }

    if (!['user', 'vendor', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    // =========================
    // 👑 ADMIN LOGIN
    // =========================
    if (role === "admin") {
      // First try to find an admin user in the DB
      const adminUser = await User.findOne({ email });

      if (adminUser && adminUser.roles.includes('admin')) {
        // If admin exists in DB, verify password
        if (await adminUser.matchPassword(password)) {
          const token = generateToken(adminUser._id, adminUser.email, 'admin');
          return res.json({
            success: true,
            message: 'Admin login successful',
            token: `Bearer ${token}`,
            user: {
              id: adminUser._id,
              name: adminUser.name || 'Admin',
              email: adminUser.email,
              roles: adminUser.roles,
              activeRole: 'admin'
            }
          });
        }
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }

      // Fallback: allow built-in admin via env variables (legacy / quick access)
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = generateToken('adminId', email, 'admin');

        return res.json({
          success: true,
          message: 'Admin login successful',
          token: `Bearer ${token}`,
          user: {
            id: 'adminId',
            name: 'Admin',
            email,
            activeRole: 'admin'
          }
        });
      }

      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    // =========================
    // 👤 USER / VENDOR LOGIN (supports password OR Google ID)
    // =========================
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 🔒 ROLE CHECK - User must have the requested role
    if (!user.roles.includes(role)) {
      return res.status(403).json({ success: false, message: `This role is not assigned to your account. Your roles: ${user.roles.join(', ')}` });
    }

    // If googleId provided, allow login via Google
    if (googleId) {
      if (user.googleId && user.googleId === googleId) {
        const token = generateToken(user._id, user.email, role);
        return res.json({ success: true, message: 'Login successful', token: `Bearer ${token}`, user: { id: user._id, name: user.name, email: user.email, roles: user.roles, activeRole: role } });
      }
      return res.status(401).json({ success: false, message: 'Invalid Google credentials' });
    }

    // 🔑 PASSWORD CHECK
    if (!user.password) {
      // No password set (e.g., account created via Google) — prompt to use Google login
      return res.status(400).json({ success: false, message: 'Account does not have a password. Please log in using Google.' });
    }

    if (await user.matchPassword(password)) {
      const token = generateToken(user._id, user.email, role);
      return res.json({ success: true, message: 'Login successful', token: `Bearer ${token}`, user: { id: user._id, name: user.name, email: user.email, roles: user.roles, activeRole: role } });
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password' });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
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



const getServicesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const services = await Service.find({
      category: categoryId, // ✅ correct
    }).populate("category");

    return res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("GET SERVICES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export { signupUser, loginUser, getAllUsers, getCategories, getServicesByCategory };