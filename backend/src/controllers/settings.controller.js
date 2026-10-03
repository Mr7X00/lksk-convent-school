const SettingsService = require('../services/settings.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { clearCache } = require('../middlewares/cache');

/**
 * Get website settings
 * GET /api/settings
 */
const getSettings = asyncHandler(async (req, res) => {
  const settings = await SettingsService.getSettings();
  return ApiResponse.success(res, 'Website settings retrieved', settings);
});

/**
 * Update website settings (Protected)
 * PUT /api/settings
 */
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await SettingsService.updateSettings(req.body);
  clearCache('/api/settings');
  return ApiResponse.success(res, 'Website settings updated successfully', settings);
});

module.exports = {
  getSettings,
  updateSettings,
};
