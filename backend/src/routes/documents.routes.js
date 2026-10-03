const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { verifyToken, restrictTo } = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');

// Public List
router.get('/', contentController.getDocuments);

// Protected Management
router.post('/', verifyToken, restrictTo('superadmin', 'admin'), contentController.createDocument);
router.put('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.updateDocument);
router.delete('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.deleteDocument);

module.exports = router;
