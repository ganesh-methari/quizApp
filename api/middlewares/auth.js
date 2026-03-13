/**
 * Authentication Middleware
 * Protects routes that require authentication
 */

const { AppError } = require('../utils/errorHandler');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(new AppError(401, 'Not authorized to access this route'));
    }

    // Verify token (add JWT verification later)
    // For now, we'll just check if user exists
    // TODO: Add JWT verification

    next();
  } catch (error) {
    next(new AppError(401, 'Not authorized to access this route'));
  }
};

// Authorization middleware - check user role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new AppError(403, `User role '${req.user?.role}' is not authorized to access this route`)
      );
    }
    next();
  };
};

// Optional: Rate limiting middleware
exports.rateLimiter = (req, res, next) => {
  // TODO: Implement rate limiting
  // Can use express-rate-limit package
  next();
};
