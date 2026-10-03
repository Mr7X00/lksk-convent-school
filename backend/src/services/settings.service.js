const WebsiteSettings = require('../models/WebsiteSettings');
const { isDatabaseConnected } = require('../config/db');
const ApiError = require('../utils/apiError');

class SettingsService {
  /**
   * Get website settings (falls back to institutional defaults if DB is temporarily disconnected)
   */
  static async getSettings() {
    if (!isDatabaseConnected()) {
      return new WebsiteSettings();
    }

    try {
      let settings = await WebsiteSettings.findOne();
      if (!settings) {
        settings = await WebsiteSettings.create({});
      }
      return settings;
    } catch (error) {
      console.warn('[SettingsService] Query fallback:', error.message);
      return new WebsiteSettings();
    }
  }

  /**
   * Update website settings
   */
  static async updateSettings(updateData) {
    if (!isDatabaseConnected()) {
      throw new ApiError(503, 'Database service is currently unavailable. Please ensure MongoDB is running.');
    }

    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create(updateData);
    } else {
      Object.assign(settings, updateData);
      await settings.save();
    }
    return settings;
  }
}

module.exports = SettingsService;
