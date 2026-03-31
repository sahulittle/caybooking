import { User } from '../models/user.model.js';
import { Vendor } from '../models/vendor.model.js';
import generateToken from '../utils/generateToken.js';

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
    const { email, password, role } = req.body;

    // ✅ VALIDATION
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password and role are required'
      });
    }

    if (!['user', 'vendor', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    // =========================
    // 👑 ADMIN LOGIN
    // =========================
    if (role === "admin") {
      if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
      ) {
        const token = generateToken("adminId", email, "admin");

        return res.json({
          success: true,
          message: "Admin login successful",
          token: `Bearer ${token}`,
          user: {
            id: "adminId",
            name: "Admin",
            email,
            activeRole: "admin"
          }
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Invalid admin credentials"
        });
      }
    }

    // =========================
    // 👤 USER / VENDOR LOGIN
    // =========================
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 🔒 ROLE CHECK - User must have the requested role
    if (!user.roles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `This role is not assigned to your account. Your roles: ${user.roles.join(', ')}`
      });
    }

    // 🔑 PASSWORD CHECK
    if (await user.matchPassword(password)) {
      const token = generateToken(user._id, user.email, role);

      return res.json({
        success: true,
        message: 'Login successful',
        token: `Bearer ${token}`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          activeRole: role
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

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

export { signupUser, loginUser, getAllUsers };