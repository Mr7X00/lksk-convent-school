const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/notice.controller');
const { verifyToken, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { validateNotice } = require('../validations/notice.validation');
const { cacheResponse } = require('../middlewares/cache');
const validateObjectId = require('../middlewares/validateObjectId');

// GET /api/notices (Public - Active notices cached 3 mins)
router.get('/', cacheResponse(180), noticeController.getNotices);

// GET /api/notices/all (Protected - Admin all notices)
router.get('/all', verifyToken, restrictTo('superadmin', 'admin', 'editor'), noticeController.getAllNoticesAdmin);

// GET /api/notices/:id (Public - View single notice)
router.get('/:id', validateObjectId('id'), cacheResponse(300), noticeController.getNoticeById);

// POST /api/notices (Protected - Create notice)
router.post(
  '/',
  verifyToken,
  restrictTo('superadmin', 'admin', 'editor'),
  validate(validateNotice),
  noticeController.createNotice
);

// PUT /api/notices/:id (Protected - Update notice)
router.put(
  '/:id',
  verifyToken,
  restrictTo('superadmin', 'admin', 'editor'),
  validateObjectId('id'),
  validate(validateNotice),
  noticeController.updateNotice
);

// DELETE /api/notices/:id (Protected - Delete notice)
router.delete(
  '/:id',
  verifyToken,
  restrictTo('superadmin', 'admin', 'editor'),
  validateObjectId('id'),
  noticeController.deleteNotice
);

module.exports = router;
