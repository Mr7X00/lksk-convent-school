const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { verifyToken, restrictTo } = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');

// Public List & Single
router.get('/', contentController.getLegalPages);
router.get('/:slug', contentController.getLegalPage);

// Protected Management
router.post('/', verifyToken, restrictTo('superadmin', 'admin'), contentController.createLegalPage);
router.put('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.updateLegalPage);
router.delete('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.deleteLegalPage);

module.exports = router;
