const express = require('express');
const router = express.Router();

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const settingsRoutes = require('./settings.routes');
const heroRoutes = require('./hero.routes');
const announcementsRoutes = require('./announcements.routes');
const admissionsRoutes = require('./admissions.routes');
const contactRoutes = require('./contact.routes');
const staffRoutes = require('./staff.routes');
const galleryRoutes = require('./gallery.routes');
const campusRoutes = require('./campus.routes');
const facilitiesRoutes = require('./facilities.routes');
const achievementsRoutes = require('./achievements.routes');
const testimonialsRoutes = require('./testimonials.routes');
const documentsRoutes = require('./documents.routes');
const noticesRoutes = require('./notices.routes');
const academicRoutes = require('./academic.routes');
const legalRoutes = require('./legal.routes');

// Mount all REST API endpoints
router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/settings', settingsRoutes);
router.use('/hero', heroRoutes);
router.use('/announcements', announcementsRoutes);
router.use('/admissions', admissionsRoutes);
router.use('/contact', contactRoutes);
router.use('/staff', staffRoutes);
router.use('/gallery', galleryRoutes);
router.use('/campus', campusRoutes);
router.use('/facilities', facilitiesRoutes);
router.use('/achievements', achievementsRoutes);
router.use('/testimonials', testimonialsRoutes);
router.use('/documents', documentsRoutes);
router.use('/notices', noticesRoutes);
router.use('/academic', academicRoutes);
router.use('/legal', legalRoutes);

module.exports = router;
