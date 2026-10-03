const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { validateLogin } = require('../validations/auth.validation');
const { authLimiter } = require('../middlewares/rateLimiter');

// POST /api/auth/login (Rate limited, input validated, generic error responses)
router.post('/login', authLimiter, validate(validateLogin), authController.login);

// POST /api/auth/logout (Protected session revocation)
router.post('/logout', verifyToken, authController.logout);

// GET /api/auth/me (Protected profile verification)
router.get('/me', verifyToken, authController.getMe);

// POST /api/auth/seed-admin (Bootstrap endpoint - disabled in production)
router.post('/seed-admin', (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Seed endpoint is disabled in production. Use administrative CLI tooling.',
    });
  }
  return authController.seedInitialAdmin(req, res, next);
});

module.exports = router;

