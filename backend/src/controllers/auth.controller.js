const AuthService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Admin Login
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const result = await AuthService.login(usernameOrEmail, password);
  return ApiResponse.success(res, 'Authentication successful', result);
});

/**
 * Admin Logout
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  if (req.admin && req.admin.id) {
    await AuthService.logout(req.admin.id);
  }
  return ApiResponse.success(res, 'Logged out successfully', null);
});

/**
 * Get current authenticated admin
 * GET /api/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, 'Current admin profile retrieved', {
    admin: {
      id: req.admin._id || req.admin.id,
      name: req.admin.name,
      username: req.admin.username,
      email: req.admin.email,
      role: req.admin.role,
      lastLogin: req.admin.lastLogin,
    },
  });
});

/**
 * Seed initial superadmin (only allowed when database is completely empty of admins)
 * POST /api/auth/seed-admin
 */
const seedInitialAdmin = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;
  const admin = await AuthService.seedInitialAdmin(name || 'Lav Pandey', username, email, password);
  return ApiResponse.success(res, 'Initial superadmin account provisioned successfully', { admin }, 201);
});

module.exports = {
  login,
  logout,
  getMe,
  seedInitialAdmin,
};
