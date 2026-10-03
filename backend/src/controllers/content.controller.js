const ContentService = require('../services/content.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// ==================== DASHBOARD STATS ====================
const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await ContentService.getDashboardStats();
  return ApiResponse.success(res, 'Dashboard statistics retrieved', stats);
});

// ==================== HERO SLIDES ====================
const getHeroSlides = asyncHandler(async (req, res) => {
  const slides = await ContentService.getHeroSlides(req.query.all === 'true');
  return ApiResponse.success(res, 'Hero slides retrieved', slides);
});

const createHeroSlide = asyncHandler(async (req, res) => {
  const slide = await ContentService.createHeroSlide(req.body);
  return ApiResponse.success(res, 'Hero slide created', slide, 201);
});

const updateHeroSlide = asyncHandler(async (req, res) => {
  const slide = await ContentService.updateHeroSlide(req.params.id, req.body);
  return ApiResponse.success(res, 'Hero slide updated', slide);
});

const deleteHeroSlide = asyncHandler(async (req, res) => {
  await ContentService.deleteHeroSlide(req.params.id);
  return ApiResponse.success(res, 'Hero slide deleted', null);
});

// ==================== ANNOUNCEMENTS ====================
const getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await ContentService.getAnnouncements(req.query.all === 'true');
  return ApiResponse.success(res, 'Announcements retrieved', announcements);
});

const createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await ContentService.createAnnouncement(req.body);
  return ApiResponse.success(res, 'Announcement created', announcement, 201);
});

const updateAnnouncement = asyncHandler(async (req, res) => {
  const item = await ContentService.updateAnnouncement(req.params.id, req.body);
  return ApiResponse.success(res, 'Announcement updated', item);
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
  await ContentService.deleteAnnouncement(req.params.id);
  return ApiResponse.success(res, 'Announcement deleted', null);
});

// ==================== STAFF ====================
const getStaff = asyncHandler(async (req, res) => {
  const staff = await ContentService.getStaff(req.query, req.query.all === 'true');
  return ApiResponse.success(res, 'Staff faculty members retrieved', staff);
});

const createStaff = asyncHandler(async (req, res) => {
  const staff = await ContentService.createStaff(req.body);
  return ApiResponse.success(res, 'Staff member added', staff, 201);
});

const updateStaff = asyncHandler(async (req, res) => {
  const staff = await ContentService.updateStaff(req.params.id, req.body);
  return ApiResponse.success(res, 'Staff member updated', staff);
});

const deleteStaff = asyncHandler(async (req, res) => {
  await ContentService.deleteStaff(req.params.id);
  return ApiResponse.success(res, 'Staff member deleted', null);
});

// ==================== TESTIMONIALS ====================
const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await ContentService.getTestimonials(req.query, req.query.all === 'true');
  return ApiResponse.success(res, 'Testimonials retrieved', testimonials);
});

const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await ContentService.createTestimonial(req.body);
  return ApiResponse.success(res, 'Testimonial added', testimonial, 201);
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const item = await ContentService.updateTestimonial(req.params.id, req.body);
  return ApiResponse.success(res, 'Testimonial updated', item);
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  await ContentService.deleteTestimonial(req.params.id);
  return ApiResponse.success(res, 'Testimonial deleted', null);
});

// ==================== GALLERY ====================
const getGalleryAlbums = asyncHandler(async (req, res) => {
  const albums = await ContentService.getAlbums(req.query.all === 'true');
  return ApiResponse.success(res, 'Gallery albums retrieved', albums);
});

const getGalleryAlbumById = asyncHandler(async (req, res) => {
  const data = await ContentService.getAlbumById(req.params.id, req.query.all === 'true');
  return ApiResponse.success(res, 'Gallery album and photos retrieved', data);
});

const getGalleryAlbumBySlug = asyncHandler(async (req, res) => {
  const data = await ContentService.getAlbumBySlug(req.params.slug, req.query.all === 'true');
  return ApiResponse.success(res, 'Gallery album and photos retrieved', data);
});

const createGalleryAlbum = asyncHandler(async (req, res) => {
  const album = await ContentService.createAlbum(req.body);
  return ApiResponse.success(res, 'Gallery album created', album, 201);
});

const updateGalleryAlbum = asyncHandler(async (req, res) => {
  const album = await ContentService.updateAlbum(req.params.id, req.body);
  return ApiResponse.success(res, 'Gallery album updated', album);
});

const deleteGalleryAlbum = asyncHandler(async (req, res) => {
  await ContentService.deleteAlbum(req.params.id);
  return ApiResponse.success(res, 'Gallery album deleted', null);
});

const addGalleryImage = asyncHandler(async (req, res) => {
  const image = await ContentService.addImageToAlbum(req.params.albumId, req.body);
  return ApiResponse.success(res, 'Photo added to album', image, 201);
});

const updateGalleryImage = asyncHandler(async (req, res) => {
  const image = await ContentService.updateGalleryImage(req.params.id, req.body);
  return ApiResponse.success(res, 'Photo updated', image);
});

const deleteGalleryImage = asyncHandler(async (req, res) => {
  await ContentService.deleteGalleryImage(req.params.id);
  return ApiResponse.success(res, 'Gallery image deleted', null);
});

// ==================== CAMPUS & FACILITIES ====================
const getCampusPages = asyncHandler(async (req, res) => {
  const pages = await ContentService.getCampusPages(req.query.all === 'true');
  return ApiResponse.success(res, 'Campus infrastructure pages retrieved', pages);
});

const createCampusPage = asyncHandler(async (req, res) => {
  const page = await ContentService.createCampusPage(req.body);
  return ApiResponse.success(res, 'Campus page created', page, 201);
});

const updateCampusPage = asyncHandler(async (req, res) => {
  const page = await ContentService.updateCampusPage(req.params.id, req.body);
  return ApiResponse.success(res, 'Campus page updated', page);
});

const deleteCampusPage = asyncHandler(async (req, res) => {
  await ContentService.deleteCampusPage(req.params.id);
  return ApiResponse.success(res, 'Campus page deleted', null);
});

const getFacilities = asyncHandler(async (req, res) => {
  const facilities = await ContentService.getFacilities(req.query.all === 'true');
  return ApiResponse.success(res, 'School facilities retrieved', facilities);
});

const createFacility = asyncHandler(async (req, res) => {
  const facility = await ContentService.createFacility(req.body);
  return ApiResponse.success(res, 'Facility created', facility, 201);
});

const updateFacility = asyncHandler(async (req, res) => {
  const facility = await ContentService.updateFacility(req.params.id, req.body);
  return ApiResponse.success(res, 'Facility updated', facility);
});

const deleteFacility = asyncHandler(async (req, res) => {
  await ContentService.deleteFacility(req.params.id);
  return ApiResponse.success(res, 'Facility deleted', null);
});

// ==================== ACHIEVEMENTS & TOPPERS ====================
const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await ContentService.getAchievements(req.query, req.query.all === 'true');
  return ApiResponse.success(res, 'Achievements retrieved', achievements);
});

const createAchievement = asyncHandler(async (req, res) => {
  const achievement = await ContentService.createAchievement(req.body);
  return ApiResponse.success(res, 'Achievement created', achievement, 201);
});

const updateAchievement = asyncHandler(async (req, res) => {
  const achievement = await ContentService.updateAchievement(req.params.id, req.body);
  return ApiResponse.success(res, 'Achievement updated', achievement);
});

const deleteAchievement = asyncHandler(async (req, res) => {
  await ContentService.deleteAchievement(req.params.id);
  return ApiResponse.success(res, 'Achievement deleted', null);
});

const getToppers = asyncHandler(async (req, res) => {
  const toppers = await ContentService.getToppers(req.query, req.query.all === 'true');
  return ApiResponse.success(res, 'Academic toppers retrieved', toppers);
});

const createTopper = asyncHandler(async (req, res) => {
  const topper = await ContentService.createTopper(req.body);
  return ApiResponse.success(res, 'Topper record created', topper, 201);
});

const updateTopper = asyncHandler(async (req, res) => {
  const topper = await ContentService.updateTopper(req.params.id, req.body);
  return ApiResponse.success(res, 'Topper record updated', topper);
});

const deleteTopper = asyncHandler(async (req, res) => {
  await ContentService.deleteTopper(req.params.id);
  return ApiResponse.success(res, 'Topper record deleted', null);
});

// ==================== DOCUMENTS ====================
const getDocuments = asyncHandler(async (req, res) => {
  const documents = await ContentService.getDocuments(req.query, req.query.all === 'true');
  return ApiResponse.success(res, 'School documents retrieved', documents);
});

const createDocument = asyncHandler(async (req, res) => {
  const doc = await ContentService.createDocument(req.body);
  return ApiResponse.success(res, 'Document uploaded & recorded', doc, 201);
});

const updateDocument = asyncHandler(async (req, res) => {
  const doc = await ContentService.updateDocument(req.params.id, req.body);
  return ApiResponse.success(res, 'Document updated', doc);
});

const deleteDocument = asyncHandler(async (req, res) => {
  await ContentService.deleteDocument(req.params.id);
  return ApiResponse.success(res, 'Document deleted', null);
});

// ==================== ACADEMIC CONTENT ====================
const getAcademicContent = asyncHandler(async (req, res) => {
  const content = await ContentService.getAcademicContent(req.query.all === 'true');
  return ApiResponse.success(res, 'Academic curriculum content retrieved', content);
});

const createAcademicContent = asyncHandler(async (req, res) => {
  const item = await ContentService.createAcademicContent(req.body);
  return ApiResponse.success(res, 'Academic wing content created', item, 201);
});

const updateAcademicContent = asyncHandler(async (req, res) => {
  const item = await ContentService.updateAcademicContent(req.params.id, req.body);
  return ApiResponse.success(res, 'Academic content updated', item);
});

const deleteAcademicContent = asyncHandler(async (req, res) => {
  await ContentService.deleteAcademicContent(req.params.id);
  return ApiResponse.success(res, 'Academic content deleted', null);
});

// ==================== LEGAL PAGES ====================
const getLegalPages = asyncHandler(async (req, res) => {
  const pages = await ContentService.getLegalPages(req.query.all === 'true');
  return ApiResponse.success(res, 'Legal pages retrieved', pages);
});

const getLegalPage = asyncHandler(async (req, res) => {
  const page = await ContentService.getLegalPageBySlug(req.params.slug);
  return ApiResponse.success(res, 'Legal document retrieved', page);
});

const createLegalPage = asyncHandler(async (req, res) => {
  const page = await ContentService.createLegalPage(req.body);
  return ApiResponse.success(res, 'Legal page created', page, 201);
});

const updateLegalPage = asyncHandler(async (req, res) => {
  const page = await ContentService.updateLegalPage(req.params.id, req.body);
  return ApiResponse.success(res, 'Legal page updated', page);
});

const deleteLegalPage = asyncHandler(async (req, res) => {
  await ContentService.deleteLegalPage(req.params.id);
  return ApiResponse.success(res, 'Legal page deleted', null);
});

module.exports = {
  getDashboardStats,
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getGalleryAlbums,
  getGalleryAlbumById,
  getGalleryAlbumBySlug,
  createGalleryAlbum,
  updateGalleryAlbum,
  deleteGalleryAlbum,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getCampusPages,
  createCampusPage,
  updateCampusPage,
  deleteCampusPage,
  getFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getToppers,
  createTopper,
  updateTopper,
  deleteTopper,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  getAcademicContent,
  createAcademicContent,
  updateAcademicContent,
  deleteAcademicContent,
  getLegalPages,
  getLegalPage,
  createLegalPage,
  updateLegalPage,
  deleteLegalPage,
};
