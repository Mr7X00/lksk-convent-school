const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const ApiError = require('../utils/apiError');
const { logSecurityEvent } = require('../utils/security');
const { isDatabaseConnected } = require('../config/db');
const AuditService = require('./audit.service');

class AuthService {
  /**
   * Authenticate admin by username or email with brute-force protection & generic error messaging
   */
  static async login(usernameOrEmail, password) {
    if (!usernameOrEmail || !password) {
      throw ApiError.badRequest('Username/email and password are required');
    }

    const cleanIdentifier = String(usernameOrEmail).toLowerCase().trim().slice(0, 80);
    const query = cleanIdentifier.includes('@')
      ? { email: cleanIdentifier }
      : { username: cleanIdentifier };

    // Offline / Dev fallback when MongoDB is disconnected
    if (!isDatabaseConnected()) {
      const devUsername = (process.env.ADMIN_INITIAL_USERNAME || 'lavpandey').toLowerCase().trim();
      const devEmail = (process.env.ADMIN_INITIAL_EMAIL || 'lkskconventschool@gmail.com').toLowerCase().trim();
      const devPassword = process.env.ADMIN_INITIAL_PASSWORD || 'LKSK@Admin2026!';

      if ((cleanIdentifier === devUsername || cleanIdentifier === devEmail) && password === devPassword) {
        const devAdminId = '660000000000000000000001';
        const token = jwt.sign(
          {
            id: devAdminId,
            username: devUsername,
            role: 'superadmin',
            tokenVersion: 0,
          },
          process.env.JWT_SECRET || 'dev_jwt_secret_lksk_school_2026_secure',
          { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return {
          token,
          admin: {
            id: devAdminId,
            name: process.env.ADMIN_INITIAL_NAME || 'Lav Pandey',
            username: devUsername,
            email: devEmail,
            role: 'superadmin',
            lastLogin: new Date(),
          },
        };
      }
      throw ApiError.unauthorized('Invalid credentials');
    }

    // Explicitly select passwordHash, lockUntil, failedLoginAttempts, and tokenVersion
    const admin = await Admin.findOne(query).select('+passwordHash');

    // Generic error message to prevent account enumeration
    const GENERIC_AUTH_ERROR = 'Invalid credentials';

    if (!admin) {
      logSecurityEvent('AUTH_LOGIN_FAILED_UNKNOWN_USER', { identifier: cleanIdentifier });
      throw ApiError.unauthorized(GENERIC_AUTH_ERROR);
    }

    if (admin.isLocked()) {
      logSecurityEvent('AUTH_LOGIN_LOCKED_ACCOUNT', { username: admin.username });
      throw ApiError.forbidden('Account is temporarily locked due to excessive failed attempts. Please try again after 15 minutes.');
    }

    if (!admin.isActive) {
      logSecurityEvent('AUTH_LOGIN_INACTIVE_ACCOUNT', { username: admin.username });
      throw ApiError.unauthorized(GENERIC_AUTH_ERROR);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      await admin.incrementLoginAttempts();
      logSecurityEvent('AUTH_LOGIN_BAD_PASSWORD', {
        username: admin.username,
        failedAttempts: (admin.failedLoginAttempts || 0) + 1,
      });
      throw ApiError.unauthorized(GENERIC_AUTH_ERROR);
    }

    // Reset failed counter and update lastLogin
    await admin.resetLoginAttempts();
    logSecurityEvent('AUTH_LOGIN_SUCCESS', { username: admin.username, role: admin.role });
    AuditService.recordEvent({
      adminId: admin._id,
      adminUsername: admin.username,
      action: 'LOGIN',
      details: { role: admin.role },
    });

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        tokenVersion: admin.tokenVersion || 0,
      },
      process.env.JWT_SECRET || 'dev_jwt_secret_lksk_school_2026_secure',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: new Date(),
      },
    };
  }

  /**
   * Invalidate active admin sessions upon logout
   */
  static async logout(adminId) {
    const admin = await Admin.findById(adminId);
    if (admin) {
      admin.tokenVersion = (admin.tokenVersion || 0) + 1;
      await admin.save();
      logSecurityEvent('AUTH_LOGOUT', { adminId: admin._id, username: admin.username });
      AuditService.recordEvent({
        adminId: admin._id,
        adminUsername: admin.username,
        action: 'LOGOUT',
      });
    }
    return true;
  }

  /**
   * Seed initial superadmin (only allowed when database is completely empty of admins)
   */
  static async seedInitialAdmin(name = 'Lav Pandey', username, email, password) {
    if (!password || typeof password !== 'string' || password.length < 8) {
      throw ApiError.badRequest('Password must be at least 8 characters long');
    }

    const count = await Admin.countDocuments();
    if (count > 0) {
      throw ApiError.conflict('Admin accounts already exist in database');
    }

    const passwordHash = await Admin.hashPassword(password);
    const admin = await Admin.create({
      name: name || 'Lav Pandey',
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'superadmin',
      isActive: true,
      tokenVersion: 0,
    });

    logSecurityEvent('AUTH_ADMIN_PROVISIONED', {
      username: admin.username,
      email: admin.email,
    });

    return {
      id: admin._id,
      name: admin.name,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    };
  }
}

module.exports = AuthService;

