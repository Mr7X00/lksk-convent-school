const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { verifyToken, restrictTo } = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');

// Public List
router.get('/', contentController.getTestimonials);

// Protected Management
router.post('/', verifyToken, restrictTo('superadmin', 'admin'), contentController.createTestimonial);
router.put('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.updateTestimonial);
router.delete('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.deleteTestimonial);

module.exports = router;
