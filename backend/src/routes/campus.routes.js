const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { verifyToken, restrictTo } = require('../middlewares/auth');
const { cacheResponse } = require('../middlewares/cache');
const validateObjectId = require('../middlewares/validateObjectId');

// Public List (cached 5 mins)
router.get('/', cacheResponse(300), contentController.getCampusPages);

// Protected Management
router.post('/', verifyToken, restrictTo('superadmin', 'admin'), contentController.createCampusPage);
router.put('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.updateCampusPage);
router.delete('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.deleteCampusPage);

module.exports = router;
