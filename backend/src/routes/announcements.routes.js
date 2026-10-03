const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { verifyToken, restrictTo } = require('../middlewares/auth');
const { cacheResponse } = require('../middlewares/cache');
const validateObjectId = require('../middlewares/validateObjectId');

// Public List (cached 5 mins)
router.get('/', cacheResponse(300), contentController.getAnnouncements);

// Protected Management
router.post('/', verifyToken, restrictTo('superadmin', 'admin'), contentController.createAnnouncement);
router.put('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.updateAnnouncement);
router.delete('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.deleteAnnouncement);

module.exports = router;
