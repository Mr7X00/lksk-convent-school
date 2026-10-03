/**
 * L.K.S.K Convent School - Master Admin CMS Router & Controller
 */

import { AdminAuth } from '../adminAuth.js';
import { renderDashboard } from './views/dashboardView.js';
import { renderSettings } from './views/settingsView.js';
import { renderNotices } from './views/noticesView.js';
import { renderInquiries } from './views/inquiriesView.js';
import { renderFaculty } from './views/facultyView.js';
import { renderDocuments } from './views/documentsView.js';
import { renderGallery } from './views/galleryView.js';
import { renderToppers } from './views/toppersView.js';
import { renderAchievements } from './views/achievementsView.js';
import { createGenericCmsView } from './views/genericCmsView.js';

// Pre-configured CMS views using reusable factory
const renderHeroSlides = createGenericCmsView({
  entityName: 'Hero Slide',
  endpoint: '/api/hero',
  columns: [
    {
      label: 'Image',
      render: (i) =>
        `<img src="${i.imageUrl || '/assets/hero/slide-campus.jpg'}" alt="${i.title || ''}" class="w-16 h-10 object-cover rounded border border-slate-200 shadow-xs" onerror="this.src='/assets/hero/slide-campus.jpg'" />`,
    },
    { label: 'Title', field: 'title' },
    { label: 'Subtitle', field: 'subtitle' },
    { label: 'Button Link', field: 'ctaLink' },
    { label: 'Display Order', field: 'displayOrder' },
    { label: 'Status', field: 'isActive' },
  ],
  formFields: [
    { name: 'title', label: 'Slide Title', required: true, colSpan: 2 },
    { name: 'subtitle', label: 'Subtitle / Description', colSpan: 2 },
    {
      name: 'imageUrl',
      label: 'Image URL (e.g. /assets/hero/slide-campus.jpg or https://images.unsplash.com/...)',
      required: true,
      colSpan: 2,
    },
    { name: 'ctaText', label: 'Button Text', defaultValue: 'Learn More' },
    { name: 'ctaLink', label: 'Button Target Link', defaultValue: '/academic/admission-inquiry/' },
    { name: 'displayOrder', label: 'Display Order (1 = First)', type: 'number', defaultValue: 1 },
    { name: 'isActive', label: 'Active on Homepage', type: 'checkbox', defaultValue: true },
  ],
});

const renderAnnouncements = createGenericCmsView({
  entityName: 'Announcement',
  endpoint: '/api/announcements',
  columns: [
    { label: 'Title', field: 'title' },
    { label: 'Type', field: 'type' },
    { label: 'Order', field: 'displayOrder' },
    { label: 'Status', field: 'isActive' },
  ],
  formFields: [
    { name: 'title', label: 'Announcement Title', required: true, colSpan: 2 },
    { name: 'content', label: 'Content Details', type: 'textarea', required: true, colSpan: 2 },
    {
      name: 'type',
      label: 'Category',
      type: 'select',
      options: [
        { value: 'urgent', label: 'Urgent' },
        { value: 'general', label: 'General' },
        { value: 'academic', label: 'Academic' },
      ],
    },
    { name: 'linkUrl', label: 'Target Link URL' },
    { name: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
    { name: 'isActive', label: 'Active Announcement', type: 'checkbox', defaultValue: true },
  ],
});

const renderTestimonials = createGenericCmsView({
  entityName: 'Testimonial',
  endpoint: '/api/testimonials',
  columns: [
    { label: 'Author', field: 'authorName' },
    { label: 'Relation Role', field: 'relationRole' },
    { label: 'Rating', render: (i) => `${i.rating} / 5 Stars` },
    { label: 'Featured', render: (i) => i.isFeatured ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">FEATURED</span>' : 'Standard' },
    { label: 'Status', field: 'isActive' },
  ],
  formFields: [
    { name: 'authorName', label: 'Author Name', required: true },
    {
      name: 'relationRole',
      label: 'Relation Role',
      type: 'select',
      options: [
        { value: 'parent', label: 'Parent' },
        { value: 'student', label: 'Student' },
        { value: 'alumni', label: 'Alumni' },
        { value: 'visitor', label: 'Visitor' },
      ],
    },
    { name: 'message', label: 'Testimonial Text', type: 'textarea', required: true, colSpan: 2 },
    { name: 'rating', label: 'Rating (1 - 5)', type: 'number', defaultValue: 5 },
    { name: 'avatarUrl', label: 'Avatar Photo URL' },
    { name: 'isFeatured', label: 'Feature on Homepage', type: 'checkbox' },
    { name: 'isActive', label: 'Active on Site', type: 'checkbox', defaultValue: true },
  ],
});

const renderFacilities = createGenericCmsView({
  entityName: 'Facility',
  endpoint: '/api/facilities',
  columns: [
    { label: 'Facility Name', field: 'name' },
    { label: 'Slug', field: 'slug' },
    { label: 'Display Order', field: 'displayOrder' },
    { label: 'Status', field: 'isActive' },
  ],
  formFields: [
    { name: 'name', label: 'Facility Name', required: true },
    { name: 'slug', label: 'URL Slug', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true, colSpan: 2 },
    { name: 'imageUrl', label: 'Cover Image URL', colSpan: 2 },
    { name: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
    { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
  ],
});

const renderCampusPages = createGenericCmsView({
  entityName: 'Campus Section',
  endpoint: '/api/campus',
  columns: [
    { label: 'Section Title', field: 'title' },
    { label: 'Slug', field: 'slug' },
    { label: 'Status', field: 'isActive' },
  ],
  formFields: [
    { name: 'title', label: 'Section Title', required: true },
    { name: 'slug', label: 'Slug', required: true },
    { name: 'excerpt', label: 'Short Excerpt', colSpan: 2 },
    { name: 'content', label: 'Full Details Content', type: 'textarea', required: true, colSpan: 2 },
    { name: 'coverImageUrl', label: 'Cover Image URL', colSpan: 2 },
    { name: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
    { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
  ],
});



const renderLegalPages = createGenericCmsView({
  entityName: 'Policy Document',
  endpoint: '/api/legal',
  columns: [
    { label: 'Policy Title', field: 'title' },
    { label: 'Slug', field: 'slug' },
    { label: 'Last Updated', render: (i) => new Date(i.lastUpdated).toLocaleDateString() },
    { label: 'Status', field: 'isActive' },
  ],
  formFields: [
    { name: 'title', label: 'Policy Document Title', required: true },
    { name: 'slug', label: 'Slug (e.g. privacy-policy, terms)', required: true },
    { name: 'content', label: 'Full Legal Body', type: 'textarea', required: true, colSpan: 2 },
    { name: 'isActive', label: 'Active on Site', type: 'checkbox', defaultValue: true },
  ],
});

const renderAcademic = createGenericCmsView({
  entityName: 'Academic Wing',
  endpoint: '/api/academic',
  columns: [
    { label: 'Grade / Wing', field: 'gradeLevel' },
    { label: 'Stream', field: 'stream' },
    { label: 'Academic Session', field: 'academicYear' },
    { label: 'Status', field: 'isActive' },
  ],
  formFields: [
    { name: 'gradeLevel', label: 'Grade Wing (e.g. Secondary Wing 9-10)', required: true },
    { name: 'stream', label: 'Stream (Science, Commerce, General)' },
    { name: 'academicYear', label: 'Session Year', defaultValue: '2026-2027' },
    { name: 'curriculumOverview', label: 'Curriculum & Pedagogy', type: 'textarea', required: true, colSpan: 2 },
    { name: 'syllabusPdfUrl', label: 'Syllabus PDF URL', colSpan: 2 },
    { name: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
    { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
  ],
});

export const AdminRouter = {
  routes: {
    '#/': renderDashboard,
    '#/dashboard': renderDashboard,
    '#/settings': renderSettings,
    '#/homepage': renderHeroSlides,
    '#/announcements': renderAnnouncements,
    '#/notices': renderNotices,
    '#/admissions': (c) => renderInquiries(c, 'admissions'),
    '#/inquiries': (c) => renderInquiries(c, 'contacts'),
    '#/faculty': renderFaculty,
    '#/documents': renderDocuments,
    '#/testimonials': renderTestimonials,
    '#/gallery': renderGallery,
    '#/toppers': renderToppers,
    '#/achievements': renderAchievements,
    '#/campus': renderCampusPages,
    '#/facilities': renderFacilities,
    '#/academic': renderAcademic,
    '#/legal': renderLegalPages,
    '#/about': renderCampusPages,
  },

  init(contentContainer) {
    const handleRouteChange = () => {
      const hash = window.location.hash || '#/';
      const handler = this.routes[hash] || this.routes['#/'];

      // Update sidebar active highlights
      document.querySelectorAll('.admin-nav-link').forEach((link) => {
        const linkHash = link.getAttribute('href');
        if (linkHash === hash || (hash === '#/' && linkHash === '#/dashboard')) {
          link.classList.add('bg-school-blue', 'text-white', 'font-semibold');
          link.classList.remove('text-slate-300', 'hover:bg-slate-800');
        } else {
          link.classList.remove('bg-school-blue', 'text-white', 'font-semibold');
          link.classList.add('text-slate-300', 'hover:bg-slate-800');
        }
      });

      handler(contentContainer);
    };

    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();
  },
};
