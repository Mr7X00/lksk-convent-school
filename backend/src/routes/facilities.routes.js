const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { verifyToken, restrictTo } = require('../middlewares/auth');
const { cacheResponse } = require('../middlewares/cache');
const validateObjectId = require('../middlewares/validateObjectId');

// Public List (cached 5 mins)
router.get('/', cacheResponse(300), contentController.getFacilities);

// Protected Management
router.post('/', verifyToken, restrictTo('superadmin', 'admin'), contentController.createFacility);
router.put('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.updateFacility);
router.delete('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.deleteFacility);

module.exports = router;
