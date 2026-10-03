const ApiResponse = require('../utils/apiResponse');

/**
 * 404 Not Found Middleware for API routes
 */
const notFound = (req, res, next) => {
  return ApiResponse.error(res, `Resource not found: ${req.originalUrl}`, 404, [
    {
      path: req.originalUrl,
      method: req.method,
      message: 'The requested API route does not exist',
    },
  ]);
};

module.exports = notFound;
