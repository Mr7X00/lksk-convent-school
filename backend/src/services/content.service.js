const mongoose = require('mongoose');
const {
  HeroSlide,
  Announcement,
  AdmissionInquiry,
  ContactInquiry,
  Staff,
  Testimonial,
  GalleryAlbum,
  GalleryImage,
  CampusPage,
  Facility,
  Achievement,
  Topper,
  Notice,
  Document,
  AcademicContent,
  LegalPage,
} = require('../models');
const { isDatabaseConnected } = require('../config/db');
const { memoryStore } = require('./devMemoryStore');
const ApiError = require('../utils/apiError');
const { escapeRegex } = require('../utils/security');

function assertValidObjectId(id, resourceName = 'Resource') {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest(`Invalid ${resourceName} identifier format`);
  }
}

class ContentService {
  // ==================== DASHBOARD STATS ====================
  static async getDashboardStats() {
    if (!isDatabaseConnected()) {
      return memoryStore.getStats();
    }

    const [
      admissionCount,
      pendingAdmissionCount,
      contactCount,
      unreadContactCount,
      staffCount,
      galleryImageCount,
      testimonialCount,
      achievementCount,
      noticeCount,
      documentCount,
      recentAdmissions,
      recentContacts,
      recentNotices,
    ] = await Promise.all([
      AdmissionInquiry.countDocuments(),
      AdmissionInquiry.countDocuments({ status: { $in: ['pending', 'New'] } }),
      ContactInquiry.countDocuments(),
      ContactInquiry.countDocuments({ status: { $in: ['unread', 'New'] } }),
      Staff.countDocuments({ isActive: true }),
      GalleryImage.countDocuments({ isActive: true }),
      Testimonial.countDocuments({ isActive: true }),
      Achievement.countDocuments({ isActive: true }),
      Notice.countDocuments({ isActive: true }),
      Document.countDocuments({ isActive: true }),
      AdmissionInquiry.find().sort({ createdAt: -1 }).limit(5),
      ContactInquiry.find().sort({ createdAt: -1 }).limit(5),
      Notice.find().sort({ publishDate: -1 }).limit(5),
    ]);

    return {
      counts: {
        admissionInquiries: admissionCount,
        pendingAdmissions: pendingAdmissionCount,
        contactInquiries: contactCount,
        unreadContacts: unreadContactCount,
        staff: staffCount,
        galleryImages: galleryImageCount,
        testimonials: testimonialCount,
        achievements: achievementCount,
        notices: noticeCount,
        documents: documentCount,
      },
      recentAdmissions,
      recentContacts,
      recentNotices,
      databaseStatus: 'connected',
    };
  }

  // ==================== HERO SLIDES ====================
  static async getHeroSlides(isAdmin = false) {
    if (!isDatabaseConnected()) {
      return memoryStore.find('heroSlides', isAdmin ? {} : { isActive: true });
    }
    const filter = isAdmin ? {} : { isActive: true };
    return await HeroSlide.find(filter).sort({ displayOrder: 1 }).limit(20);
  }

  static async createHeroSlide(data) {
    if (!isDatabaseConnected()) {
      return memoryStore.create('heroSlides', data);
    }
    return await HeroSlide.create(data);
  }

  static async updateHeroSlide(id, data) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndUpdate('heroSlides', id, data);
    }
    assertValidObjectId(id, 'hero slide');
    const slide = await HeroSlide.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!slide) throw ApiError.notFound('Hero slide not found');
    return slide;
  }

  static async deleteHeroSlide(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndDelete('heroSlides', id);
    }
    assertValidObjectId(id, 'hero slide');
    const slide = await HeroSlide.findByIdAndDelete(id);
    if (!slide) throw ApiError.notFound('Hero slide not found');
    return slide;
  }

  // ==================== ANNOUNCEMENTS ====================
  static async getAnnouncements(isAdmin = false) {
    if (!isDatabaseConnected()) {
      return memoryStore.find('announcements', isAdmin ? {} : { isActive: true });
    }
    const filter = isAdmin ? {} : {
      isActive: true,
      $or: [{ endDate: null }, { endDate: { $gte: new Date() } }],
    };
    return await Announcement.find(filter).sort({ displayOrder: 1, startDate: -1 }).limit(50);
  }

  static async createAnnouncement(data) {
    if (!isDatabaseConnected()) {
      return memoryStore.create('announcements', data);
    }
    return await Announcement.create(data);
  }

  static async updateAnnouncement(id, data) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndUpdate('announcements', id, data);
    }
    assertValidObjectId(id, 'announcement');
    const item = await Announcement.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!item) throw ApiError.notFound('Announcement not found');
    return item;
  }

  static async deleteAnnouncement(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndDelete('announcements', id);
    }
    assertValidObjectId(id, 'announcement');
    const item = await Announcement.findByIdAndDelete(id);
    if (!item) throw ApiError.notFound('Announcement not found');
    return item;
  }

  // ==================== STAFF ====================
  static async getStaff(query = {}, isAdmin = false) {
    const filter = isAdmin ? {} : { isActive: true };
    if (query.department && typeof query.department === 'string') {
      filter.department = query.department.trim().slice(0, 50);
    }
    if (query.category && typeof query.category === 'string') {
      filter.category = query.category.trim().slice(0, 50);
    }
    if (!isDatabaseConnected()) {
      return memoryStore.find('staff', filter);
    }
    return await Staff.find(filter).sort({ displayOrder: 1, name: 1 }).limit(100);
  }

  static async createStaff(data) {
    if (!isDatabaseConnected()) {
      return memoryStore.create('staff', data);
    }
    return await Staff.create(data);
  }

  static async updateStaff(id, data) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndUpdate('staff', id, data);
    }
    assertValidObjectId(id, 'staff member');
    const staff = await Staff.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!staff) throw ApiError.notFound('Staff member not found');
    return staff;
  }

  static async deleteStaff(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndDelete('staff', id);
    }
    assertValidObjectId(id, 'staff member');
    const staff = await Staff.findByIdAndDelete(id);
    if (!staff) throw ApiError.notFound('Staff member not found');
    return staff;
  }

  // ==================== TESTIMONIALS ====================
  static async getTestimonials(query = {}, isAdmin = false) {
    const filter = isAdmin ? {} : { isActive: true };
    if (query.isFeatured) filter.isFeatured = query.isFeatured === 'true';
    if (!isDatabaseConnected()) {
      return memoryStore.find('testimonials', filter);
    }
    return await Testimonial.find(filter).sort({ isFeatured: -1, displayOrder: 1, createdAt: -1 }).limit(100);
  }

  static async createTestimonial(data) {
    if (!isDatabaseConnected()) {
      return memoryStore.create('testimonials', data);
    }
    return await Testimonial.create(data);
  }

  static async updateTestimonial(id, data) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndUpdate('testimonials', id, data);
    }
    assertValidObjectId(id, 'testimonial');
    const item = await Testimonial.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!item) throw ApiError.notFound('Testimonial not found');
    return item;
  }

  static async deleteTestimonial(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndDelete('testimonials', id);
    }
    assertValidObjectId(id, 'testimonial');
    const item = await Testimonial.findByIdAndDelete(id);
    if (!item) throw ApiError.notFound('Testimonial not found');
    return item;
  }

  // ==================== GALLERY ====================
  static async getAlbums(isAdmin = false) {
    if (!isDatabaseConnected()) {
      return memoryStore.find('albums', isAdmin ? {} : { isActive: true });
    }
    const filter = isAdmin ? {} : { isActive: true };
    return await GalleryAlbum.find(filter).sort({ displayOrder: 1, eventDate: -1 }).limit(100);
  }

  static async getAlbumBySlug(slug, isAdmin = false) {
    if (!slug || typeof slug !== 'string') throw ApiError.badRequest('Invalid album slug');
    const cleanSlug = slug.trim().toLowerCase();
    if (!isDatabaseConnected()) {
      const album = memoryStore.data.albums.find(a => a.slug === cleanSlug && (isAdmin || a.isActive));
      if (!album) throw ApiError.notFound('Gallery album not found');
      const images = memoryStore.data.galleryImages.filter(img => String(img.albumId) === String(album._id) && (isAdmin || img.isActive));
      return { album, images };
    }
    const filter = { slug: cleanSlug };
    if (!isAdmin) filter.isActive = true;
    const album = await GalleryAlbum.findOne(filter);
    if (!album) throw ApiError.notFound('Gallery album not found');

    const imgFilter = { albumId: album._id };
    if (!isAdmin) imgFilter.isActive = true;
    const images = await GalleryImage.find(imgFilter).sort({ displayOrder: 1, createdAt: -1 }).limit(200);
    return { album, images };
  }

  static async getAlbumById(id, isAdmin = true) {
    if (!isDatabaseConnected()) {
      const album = memoryStore.findById('albums', id);
      const images = memoryStore.data.galleryImages.filter(img => String(img.albumId) === String(album._id) && (isAdmin || img.isActive));
      return { album, images };
    }
    assertValidObjectId(id, 'album');
    const album = await GalleryAlbum.findById(id);
    if (!album) throw ApiError.notFound('Gallery album not found');
    const imgFilter = { albumId: album._id };
    if (!isAdmin) imgFilter.isActive = true;
    const images = await GalleryImage.find(imgFilter).sort({ displayOrder: 1, createdAt: -1 }).limit(200);
    return { album, images };
  }

  static async createAlbum(data) {
    if (!isDatabaseConnected()) {
      return memoryStore.create('albums', data);
    }
    return await GalleryAlbum.create(data);
  }

  static async updateAlbum(id, data) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndUpdate('albums', id, data);
    }
    assertValidObjectId(id, 'album');
    const album = await GalleryAlbum.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!album) throw ApiError.notFound('Gallery album not found');
    return album;
  }

  static async deleteAlbum(id) {
    if (!isDatabaseConnected()) {
      const album = memoryStore.findByIdAndDelete('albums', id);
      memoryStore.data.galleryImages = memoryStore.data.galleryImages.filter(img => String(img.albumId) !== String(id));
      return album;
    }
    assertValidObjectId(id, 'album');
    const album = await GalleryAlbum.findByIdAndDelete(id);
    if (!album) throw ApiError.notFound('Gallery album not found');
    await GalleryImage.deleteMany({ albumId: id });
    return album;
  }

  static async addImageToAlbum(albumId, data) {
    if (!isDatabaseConnected()) {
      const album = memoryStore.findById('albums', albumId);
      return memoryStore.create('galleryImages', { ...data, albumId: album._id });
    }
    assertValidObjectId(albumId, 'album');
    const album = await GalleryAlbum.findById(albumId);
    if (!album) throw ApiError.notFound('Album not found');
    return await GalleryImage.create({ ...data, albumId });
  }

  static async updateGalleryImage(id, data) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndUpdate('galleryImages', id, data);
    }
    assertValidObjectId(id, 'image');
    const img = await GalleryImage.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!img) throw ApiError.notFound('Gallery image not found');
    return img;
  }

  static async deleteGalleryImage(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndDelete('galleryImages', id);
    }
    assertValidObjectId(id, 'image');
    const img = await GalleryImage.findByIdAndDelete(id);
    if (!img) throw ApiError.notFound('Image not found');
    return img;
  }

  // ==================== CAMPUS & FACILITIES ====================
  static async getCampusPages(isAdmin = false) {
    if (!isDatabaseConnected()) {
      return memoryStore.find('campusPages', isAdmin ? {} : { isActive: true });
    }
    const filter = isAdmin ? {} : { isActive: true };
    return await CampusPage.find(filter).sort({ displayOrder: 1 }).limit(50);
  }

  static async createCampusPage(data) {
    if (!isDatabaseConnected()) {
      return memoryStore.create('campusPages', data);
    }
    return await CampusPage.create(data);
  }

  static async updateCampusPage(id, data) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndUpdate('campusPages', id, data);
    }
    assertValidObjectId(id, 'campus page');
    const page = await CampusPage.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!page) throw ApiError.notFound('Campus page not found');
    return page;
  }

  static async deleteCampusPage(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndDelete('campusPages', id);
    }
    assertValidObjectId(id, 'campus page');
    const page = await CampusPage.findByIdAndDelete(id);
    if (!page) throw ApiError.notFound('Campus page not found');
    return page;
  }

  static async getFacilities(isAdmin = false) {
    if (!isDatabaseConnected()) {
      return memoryStore.find('facilities', isAdmin ? {} : { isActive: true });
    }
    const filter = isAdmin ? {} : { isActive: true };
    return await Facility.find(filter).sort({ displayOrder: 1 }).limit(50);
  }

  static async createFacility(data) {
    if (!isDatabaseConnected()) {
      return memoryStore.create('facilities', data);
    }
    return await Facility.create(data);
  }

  static async updateFacility(id, data) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndUpdate('facilities', id, data);
    }
    assertValidObjectId(id, 'facility');
    const facility = await Facility.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!facility) throw ApiError.notFound('Facility not found');
    return facility;
  }

  static async deleteFacility(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndDelete('facilities', id);
    }
    assertValidObjectId(id, 'facility');
    const facility = await Facility.findByIdAndDelete(id);
    if (!facility) throw ApiError.notFound('Facility not found');
    return facility;
  }

  // ==================== ACHIEVEMENTS & TOPPERS ====================
  static async getAchievements(query = {}, isAdmin = false) {
    const filter = isAdmin ? {} : { isActive: true };
    if (query.category && typeof query.category === 'string') {
      const cleanCat = escapeRegex(query.category, 50);
      filter.category = new RegExp(`^${cleanCat}$`, 'i');
    }
    if (!isDatabaseConnected()) {
      return memoryStore.find('achievements', filter);
    }
    return await Achievement.find(filter).sort({ isFeatured: -1, displayOrder: 1, date: -1 }).limit(100);
  }

  static async createAchievement(data) {
    if (!isDatabaseConnected()) {
      return memoryStore.create('achievements', data);
    }
    return await Achievement.create(data);
  }

  static async updateAchievement(id, data) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndUpdate('achievements', id, data);
    }
    assertValidObjectId(id, 'achievement');
    const ach = await Achievement.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!ach) throw ApiError.notFound('Achievement not found');
    return ach;
  }

  static async deleteAchievement(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndDelete('achievements', id);
    }
    assertValidObjectId(id, 'achievement');
    const ach = await Achievement.findByIdAndDelete(id);
    if (!ach) throw ApiError.notFound('Achievement not found');
    return ach;
  }

  static async getToppers(query = {}, isAdmin = false) {
    const filter = isAdmin ? {} : { isActive: true };
    if (query.academicYear && typeof query.academicYear === 'string') {
      filter.academicYear = query.academicYear.trim().slice(0, 20);
    }
    if (query.classGrade && typeof query.classGrade === 'string') {
      const cg = query.classGrade.trim().slice(0, 30);
      filter.$or = [{ classGrade: cg }, { examType: cg }];
    } else if (query.examType && typeof query.examType === 'string') {
      filter.examType = query.examType.trim().slice(0, 30);
    }
    if (!isDatabaseConnected()) {
      return memoryStore.find('toppers', filter);
    }
    return await Topper.find(filter).sort({ academicYear: -1, displayOrder: 1, rank: 1 }).limit(100);
  }

  static async createTopper(data) {
    if (!isDatabaseConnected()) {
      return memoryStore.create('toppers', data);
    }
    return await Topper.create(data);
  }

  static async updateTopper(id, data) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndUpdate('toppers', id, data);
    }
    assertValidObjectId(id, 'topper record');
    const topper = await Topper.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!topper) throw ApiError.notFound('Topper record not found');
    return topper;
  }

  static async deleteTopper(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndDelete('toppers', id);
    }
    assertValidObjectId(id, 'topper record');
    const topper = await Topper.findByIdAndDelete(id);
    if (!topper) throw ApiError.notFound('Topper record not found');
    return topper;
  }

  // ==================== DOCUMENTS ====================
  static async getDocuments(query = {}, isAdmin = false) {
    const filter = isAdmin ? {} : { isActive: true };
    if (query.category && typeof query.category === 'string') {
      filter.category = query.category.trim().slice(0, 50);
    }
    if (!isDatabaseConnected()) {
      return memoryStore.find('documents', filter);
    }
    return await Document.find(filter).sort({ displayOrder: 1, publishDate: -1 }).limit(100);
  }

  static async createDocument(data) {
    if (!isDatabaseConnected()) {
      return memoryStore.create('documents', data);
    }
    return await Document.create(data);
  }

  static async updateDocument(id, data) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndUpdate('documents', id, data);
    }
    assertValidObjectId(id, 'document');
    const doc = await Document.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!doc) throw ApiError.notFound('Document not found');
    return doc;
  }

  static async deleteDocument(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndDelete('documents', id);
    }
    assertValidObjectId(id, 'document');
    const doc = await Document.findByIdAndDelete(id);
    if (!doc) throw ApiError.notFound('Document not found');
    return doc;
  }

  // ==================== ACADEMIC CONTENT ====================
  static async getAcademicContent(isAdmin = false) {
    if (!isDatabaseConnected()) {
      return memoryStore.find('academicContent', isAdmin ? {} : { isActive: true });
    }
    const filter = isAdmin ? {} : { isActive: true };
    return await AcademicContent.find(filter).sort({ displayOrder: 1 }).limit(50);
  }

  static async createAcademicContent(data) {
    if (!isDatabaseConnected()) {
      return memoryStore.create('academicContent', data);
    }
    return await AcademicContent.create(data);
  }

  static async updateAcademicContent(id, data) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndUpdate('academicContent', id, data);
    }
    assertValidObjectId(id, 'academic content');
    const item = await AcademicContent.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!item) throw ApiError.notFound('Academic content not found');
    return item;
  }

  static async deleteAcademicContent(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndDelete('academicContent', id);
    }
    assertValidObjectId(id, 'academic content');
    const item = await AcademicContent.findByIdAndDelete(id);
    if (!item) throw ApiError.notFound('Academic content not found');
    return item;
  }

  // ==================== LEGAL PAGES ====================
  static async getLegalPages(isAdmin = false) {
    if (!isDatabaseConnected()) {
      return memoryStore.find('legalPages', isAdmin ? {} : { isActive: true });
    }
    const filter = isAdmin ? {} : { isActive: true };
    return await LegalPage.find(filter).sort({ title: 1 }).limit(20);
  }

  static async getLegalPageBySlug(slug) {
    if (!isDatabaseConnected()) {
      const cleanSlug = typeof slug === 'string' ? slug.trim().toLowerCase().slice(0, 100) : '';
      const page = memoryStore.data.legalPages.find(p => p.slug === cleanSlug);
      if (page) return page;
      return {
        title: (slug || 'Legal Page').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        slug: slug || 'legal-page',
        content: 'Official policy document. L.K.S.K Convent School operates strictly under CBSE norms and state educational guidelines.',
        lastUpdated: new Date(),
        isActive: true,
      };
    }
    const cleanSlug = typeof slug === 'string' ? slug.trim().toLowerCase().slice(0, 100) : '';
    const page = await LegalPage.findOne({ slug: cleanSlug, isActive: true });
    if (!page) throw ApiError.notFound('Legal policy page not found');
    return page;
  }

  static async createLegalPage(data) {
    if (!isDatabaseConnected()) {
      return memoryStore.create('legalPages', data);
    }
    return await LegalPage.create(data);
  }

  static async updateLegalPage(id, data) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndUpdate('legalPages', id, data);
    }
    assertValidObjectId(id, 'legal page');
    const page = await LegalPage.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!page) throw ApiError.notFound('Legal page not found');
    return page;
  }

  static async deleteLegalPage(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndDelete('legalPages', id);
    }
    assertValidObjectId(id, 'legal page');
    const page = await LegalPage.findByIdAndDelete(id);
    if (!page) throw ApiError.notFound('Legal page not found');
    return page;
  }
}

module.exports = ContentService;
