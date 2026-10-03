const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiry.controller');
const { verifyToken, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { validateContactInquiry } = require('../validations/inquiry.validation');
const { inquiryLimiter, exportLimiter } = require('../middlewares/rateLimiter');
const validateObjectId = require('../middlewares/validateObjectId');

// POST /api/contact (Public inquiry with rate limiting and validation)
router.post(
  '/',
  inquiryLimiter,
  validate(validateContactInquiry),
  inquiryController.submitContactInquiry
);

// GET /api/contact/export/csv (Protected - Export CSV with rate limiting)
router.get(
  '/export/csv',
  exportLimiter,
  verifyToken,
  restrictTo('superadmin', 'admin'),
  inquiryController.exportContactInquiriesCsv
);

// GET /api/contact (Protected - Admin list)
router.get(
  '/',
  verifyToken,
  restrictTo('superadmin', 'admin'),
  inquiryController.getContactInquiries
);

// GET /api/contact/:id (Protected - Admin details)
router.get(
  '/:id',
  verifyToken,
  restrictTo('superadmin', 'admin'),
  validateObjectId('id'),
  inquiryController.getContactInquiryById
);

// PATCH /api/contact/:id (Protected - Update status and admin notes)
router.patch(
  '/:id',
  verifyToken,
  restrictTo('superadmin', 'admin'),
  validateObjectId('id'),
  inquiryController.updateContactInquiryStatus
);

// DELETE /api/contact/:id (Protected - Delete inquiry)
router.delete(
  '/:id',
  verifyToken,
  restrictTo('superadmin', 'admin'),
  validateObjectId('id'),
  inquiryController.deleteContactInquiry
);

module.exports = router;
