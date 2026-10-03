const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/apiResponse');
const { logSecurityEvent } = require('../utils/security');

/**
 * Strict rate limiter for inquiry form submissions (15 submissions per hour per IP)
 */
const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('RATE_LIMIT_INQUIRY', { ip: req.ip, path: req.originalUrl });
    return ApiResponse.error(
      res,
      'Too many inquiry submissions from this IP address. Please wait an hour before submitting again.',
      429
    );
  },
});

/**
 * Auth rate limiter for login attempts (10 attempts per 15 minutes per IP)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('RATE_LIMIT_AUTH_LOGIN', {
      ip: req.ip,
      path: req.originalUrl,
      username: req.body?.usernameOrEmail ? String(req.body.usernameOrEmail).slice(0, 30) : undefined,
    });
    return ApiResponse.error(
      res,
      'Too many login attempts. Please wait 15 minutes before trying again.',
      429
    );
  },
});

/**
 * Rate limiter for sensitive CSV export operations (20 requests per 15 minutes)
 */
const exportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('RATE_LIMIT_EXPORT', { ip: req.ip, path: req.originalUrl });
    return ApiResponse.error(
      res,
      'Export rate limit exceeded. Please wait before generating another report.',
      429
    );
  },
});

module.exports = {
  inquiryLimiter,
  authLimiter,
  exportLimiter,
};

