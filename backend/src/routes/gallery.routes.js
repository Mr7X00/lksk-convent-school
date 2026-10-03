const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { verifyToken, restrictTo } = require('../middlewares/auth');
const { cacheResponse } = require('../middlewares/cache');
const validateObjectId = require('../middlewares/validateObjectId');

// Public List & Single (cached 5 mins)
router.get('/', cacheResponse(300), contentController.getGalleryAlbums);
router.get('/id/:id', validateObjectId('id'), cacheResponse(300), contentController.getGalleryAlbumById);
router.get('/:slug', cacheResponse(300), contentController.getGalleryAlbumBySlug);

// Protected Album Management
router.post('/', verifyToken, restrictTo('superadmin', 'admin'), contentController.createGalleryAlbum);
router.put('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.updateGalleryAlbum);
router.delete('/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.deleteGalleryAlbum);

// Protected Images Management
router.post('/:albumId/images', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('albumId'), contentController.addGalleryImage);
router.put('/images/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.updateGalleryImage);
router.delete('/images/:id', verifyToken, restrictTo('superadmin', 'admin'), validateObjectId('id'), contentController.deleteGalleryImage);

module.exports = router;
