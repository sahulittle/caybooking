import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

// Middleware to verify JWT and attach user to request
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to request
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      // Verify that the active role in token matches user's roles
      if (!user.roles.includes(decoded.activeRole)) {
        return res.status(403).json({ success: false, message: 'Invalid role in token' });
      }

      req.user = user;
      req.activeRole = decoded.activeRole;

      return next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  res.status(401).json({ success: false, message: 'Not authorized, no token' });
};

// Middleware to grant access to specific roles
const authorize = (...roles) => (req, res, next) => {
  if (!req.activeRole || !roles.includes(req.activeRole)) {
    return res.status(403).json({ 
      success: false, 
      message: `Active role '${req.activeRole}' is not authorized to access this route` 
    });
  }
  next();
};

export { protect, authorize };