const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { verifyToken, restrictTo } = require('../middlewares/auth');
const { cacheResponse } = require('../middlewares/cache');
const validateObjectId = require('../middlewares/validateObjectId');

// Public List (cached 5 mins)
router.get('/', cacheResponse(300), contentController.getAchievements);
router.get('/toppers', cacheResponse(300), contentController.getToppers);

// Protected Achievements CRUD
router.post('/', verifyToken, restrictTo('superadmin', 'admin'), contentController.createAchievement);
router.put('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.updateAchievement);
router.delete('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.deleteAchievement);

// Protected Toppers CRUD
router.post('/toppers', verifyToken, restrictTo('superadmin', 'admin'), contentController.createTopper);
router.put('/toppers/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.updateTopper);
router.delete('/toppers/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.deleteTopper);

module.exports = router;
