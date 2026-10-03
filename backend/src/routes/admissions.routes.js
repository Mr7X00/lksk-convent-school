const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiry.controller');
const { verifyToken, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { validateAdmissionInquiry } = require('../validations/inquiry.validation');
const { inquiryLimiter, exportLimiter } = require('../middlewares/rateLimiter');
const validateObjectId = require('../middlewares/validateObjectId');

// POST /api/admissions (Public submission with rate limiting and validation)
router.post(
  '/',
  inquiryLimiter,
  validate(validateAdmissionInquiry),
  inquiryController.submitAdmissionInquiry
);

// GET /api/admissions/export/csv (Protected - Export CSV with rate limiting)
router.get(
  '/export/csv',
  exportLimiter,
  verifyToken,
  restrictTo('superadmin', 'admin'),
  inquiryController.exportAdmissionInquiriesCsv
);

// GET /api/admissions (Protected - Admin list)
router.get(
  '/',
  verifyToken,
  restrictTo('superadmin', 'admin'),
  inquiryController.getAdmissionInquiries
);

// GET /api/admissions/:id (Protected - Admin details)
router.get(
  '/:id',
  verifyToken,
  restrictTo('superadmin', 'admin'),
  validateObjectId('id'),
  inquiryController.getAdmissionInquiryById
);

// PATCH /api/admissions/:id (Protected - Update status and admin notes)
router.patch(
  '/:id',
  verifyToken,
  restrictTo('superadmin', 'admin'),
  validateObjectId('id'),
  inquiryController.updateAdmissionInquiryStatus
);

// DELETE /api/admissions/:id (Protected - Delete inquiry)
router.delete(
  '/:id',
  verifyToken,
  restrictTo('superadmin', 'admin'),
  validateObjectId('id'),
  inquiryController.deleteAdmissionInquiry
);

module.exports = router;
