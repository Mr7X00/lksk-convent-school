const ApiResponse = require('../utils/apiResponse');
const { logSecurityEvent } = require('../utils/security');

/**
 * Centralized error handling middleware
 * Hides internal stack traces and database paths in production.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier format';
    errors = [{ field: err.path, message: 'Resource not found with specified identifier' }];
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate field value: ${field}. Must be unique.`;
    errors = [{ field, message: `${field} already exists` }];
  }

  // Handle JSON Web Token Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
  }

  // In production, mask unexpected 500 errors to prevent information disclosure
  if (statusCode === 500) {
    logSecurityEvent('SERVER_ERROR_500', {
      path: req.originalUrl,
      method: req.method,
      ip: req.ip,
      errorName: err.name,
      errorMessage: err.message,
    });

    if (process.env.NODE_ENV === 'production') {
      message = 'An unexpected server error occurred. Please contact system support.';
      errors = [];
    }
  }

  return ApiResponse.error(res, message, statusCode, errors);
};

module.exports = errorHandler;
