/**
 * Administrative Audit Log Model
 * L.K.S.K Convent School
 * Tracks administrative governance events, logins, and content changes.
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: false,
    },
    adminUsername: {
      type: String,
      trim: true,
      default: 'system',
    },
    action: {
      type: String,
      required: [true, 'Audit action is required'],
      enum: [
        'LOGIN',
        'LOGOUT',
        'CONTENT_CREATED',
        'CONTENT_UPDATED',
        'CONTENT_DELETED',
        'CONTENT_PUBLISHED',
        'CONTENT_UNPUBLISHED',
        'MEDIA_UPLOADED',
        'MEDIA_DELETED',
        'DOCUMENT_UPLOADED',
        'NOTICE_CREATED',
        'INQUIRY_STATUS_CHANGED',
        'SETTINGS_UPDATED',
        'SECURITY_ALERT',
      ],
      index: true,
    },
    targetModel: {
      type: String,
      trim: true,
      default: null,
    },
    targetId: {
      type: String,
      trim: true,
      default: null,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip: {
      type: String,
      trim: true,
      default: null,
    },
    userAgent: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for chronological auditing queries
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
