/**
 * Administrative Audit Service
 * L.K.S.K Convent School
 * Records security-sensitive admin events and changes for institutional governance.
 */

const { AuditLog } = require('../models');
const { isDatabaseConnected } = require('../config/db');
const logger = require('../utils/logger');

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'token',
  'jwt',
  'authorization',
  'secret',
]);

function sanitizeDetails(data) {
  if (!data || typeof data !== 'object') return data;
  const clean = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      clean[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      clean[key] = sanitizeDetails(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

class AuditService {
  /**
   * Safely record an administrative governance event
   */
  static async recordEvent({
    adminId = null,
    adminUsername = 'system',
    action,
    targetModel = null,
    targetId = null,
    details = {},
    req = null,
  }) {
    if (!isDatabaseConnected()) {
      return;
    }
    try {
      const ip = req ? req.ip || req.connection?.remoteAddress : null;
      const userAgent = req ? req.get('user-agent') : null;

      const safeDetails = sanitizeDetails(details);

      await AuditLog.create({
        adminId,
        adminUsername,
        action,
        targetModel,
        targetId: targetId ? String(targetId) : null,
        details: safeDetails,
        ip,
        userAgent,
      });

      logger.info(`[Audit] ${action} by ${adminUsername}`, {
        targetModel,
        targetId,
      });
    } catch (err) {
      // Never crash a transaction or API call if audit logging fails
      logger.warn(`[Audit] Failed to record audit log: ${err.message}`);
    }
  }

  /**
   * Retrieve recent audit logs for administrative review
   */
  static async getAuditLogs({ page = 1, limit = 50, action = null } = {}) {
    const query = action ? { action } : {};
    const skip = (Math.max(1, page) - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(query),
    ]);

    return {
      logs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    };
  }
}

module.exports = AuditService;
