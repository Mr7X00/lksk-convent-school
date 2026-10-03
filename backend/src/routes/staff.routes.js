const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { verifyToken, restrictTo } = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');

// Public List
router.get('/', contentController.getStaff);

// Protected Management
router.post('/', verifyToken, restrictTo('superadmin', 'admin'), contentController.createStaff);
router.put('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.updateStaff);
router.delete('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.deleteStaff);

module.exports = router;
