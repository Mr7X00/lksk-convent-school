const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { verifyToken, restrictTo } = require('../middlewares/auth');
const { cacheResponse } = require('../middlewares/cache');

// GET /api/settings (Public - cached 5 minutes)
router.get('/', cacheResponse(300), settingsController.getSettings);

// PUT /api/settings (Protected - Admin only)
router.put('/', verifyToken, restrictTo('superadmin', 'admin'), settingsController.updateSettings);

module.exports = router;
