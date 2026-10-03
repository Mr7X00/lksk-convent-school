const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { verifyToken, restrictTo } = require('../middlewares/auth');

// GET /api/admin/stats (Protected - live DB statistics)
router.get(
  '/stats',
  verifyToken,
  restrictTo('superadmin', 'admin', 'editor'),
  contentController.getDashboardStats
);

// GET /api/admin/audit-logs (Protected - administrative governance logs)
const AuditService = require('../services/audit.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

router.get(
  '/audit-logs',
  verifyToken,
  restrictTo('superadmin', 'admin'),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 50, action } = req.query;
    const result = await AuditService.getAuditLogs({
      page: Number(page) || 1,
      limit: Math.min(100, Number(limit) || 50),
      action: action ? String(action) : null,
    });
    return ApiResponse.success(res, 'Audit logs retrieved successfully', result);
  })
);

module.exports = router;
