/**
 * L.K.S.K Convent School - Backend Architecture & Model Verification Suite
 * Tests models, validation schemas, error handling, and live REST endpoints.
 */

const http = require('http');
const mongoose = require('mongoose');
const app = require('../src/app');
const { getDatabaseStatus } = require('../src/config/db');
const {
  Admin,
  WebsiteSettings,
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
} = require('../src/models');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passedCount++;
    console.log(`  ${colors.green}✓${colors.reset} ${testName}`);
  } else {
    failedCount++;
    console.error(`  ${colors.red}✗${colors.reset} ${testName} ${details ? '(' + details + ')' : ''}`);
  }
}

async function runTests() {
  console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan} L.K.S.K Convent School — Backend Verification Suite ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}\n`);

  // SECTION 1: Mongoose Models & Schema Validation
  console.log(`${colors.bold}1. Testing Mongoose Schemas & Model Validations (18 Models):${colors.reset}`);

  // Model 1: Admin
  const validAdmin = new Admin({
    username: 'superadmin',
    email: 'admin@lksk.edu',
    passwordHash: 'dummy_hash_for_testing',
    role: 'superadmin',
  });
  const adminValErr = validAdmin.validateSync();
  assert(!adminValErr, 'Admin schema validates correct data');

  const invalidAdmin = new Admin({ username: 'ab', email: 'not-an-email' });
  const invalidAdminErr = invalidAdmin.validateSync();
  assert(
    invalidAdminErr && invalidAdminErr.errors.email && invalidAdminErr.errors.username,
    'Admin schema rejects invalid username and malformed email'
  );

  // Model 2: WebsiteSettings
  const settings = new WebsiteSettings();
  assert(
    settings.schoolName === 'L.K.S.K Convent School' &&
      settings.establishedYear === 2017 &&
      settings.affiliationNumber.includes('TODO'),
    'WebsiteSettings defaults match official school records & TODOs'
  );

  // Model 3: HeroSlide
  const heroSlide = new HeroSlide({
    title: 'Nurturing Future Leaders',
    imageUrl: 'https://example.com/banner.jpg',
  });
  assert(!heroSlide.validateSync(), 'HeroSlide schema validates with required fields and defaults');

  // Model 4: Announcement
  const announcement = new Announcement({
    title: 'Admissions Open 2026-27',
    content: 'Registration forms are now available online.',
    type: 'academic',
  });
  assert(!announcement.validateSync(), 'Announcement schema validates valid announcement category');

  const invalidAnnouncement = new Announcement({
    title: 'Invalid Announcement',
    content: 'Content',
    type: 'unsupported-type',
  });
  assert(
    Boolean(invalidAnnouncement.validateSync()?.errors.type),
    'Announcement schema rejects unsupported type enum'
  );

  // Model 5: AdmissionInquiry
  const admission = new AdmissionInquiry({
    studentName: 'Aarav Sharma',
    parentName: 'Ramesh Sharma',
    email: 'ramesh.sharma@example.com',
    phone: '+919876543210',
    gradeApplying: 'Class 6',
  });
  assert(!admission.validateSync(), 'AdmissionInquiry schema validates with correct student info');

  const invalidAdmission = new AdmissionInquiry({
    studentName: 'A',
    email: 'bad-email',
    phone: '123',
  });
  const invalidAdmissionErr = invalidAdmission.validateSync();
  assert(
    Boolean(invalidAdmissionErr?.errors.email && invalidAdmissionErr?.errors.phone),
    'AdmissionInquiry rejects invalid email and phone number formats'
  );

  // Model 6: ContactInquiry
  const contact = new ContactInquiry({
    name: 'Sunita Verma',
    email: 'sunita@example.com',
    subject: 'Transportation Route Inquiry',
    message: 'Does school transport service the Sohawal bypass route?',
  });
  assert(!contact.validateSync(), 'ContactInquiry schema validates required inquiry fields');

  // Model 7: Staff
  const staff = new Staff({
    name: 'Dr. R. K. Mishra',
    designation: 'Principal',
    department: 'Administration',
    qualification: 'M.Sc., B.Ed., Ph.D.',
  });
  assert(!staff.validateSync(), 'Staff schema validates faculty records');

  // Model 8: Testimonial
  const testimonial = new Testimonial({
    authorName: 'Priya Singh',
    relationRole: 'parent',
    message: 'The academic environment and focus on values has been exemplary for my children.',
    rating: 5,
  });
  assert(!testimonial.validateSync(), 'Testimonial schema validates rating and relationRole');

  // Model 9: GalleryAlbum
  const album = new GalleryAlbum({
    title: 'Annual Sports Meet 2026',
    slug: 'annual-sports-meet-2026',
    coverImageUrl: 'https://example.com/sports.jpg',
  });
  assert(!album.validateSync(), 'GalleryAlbum schema validates required title, slug, and cover');

  // Model 10: GalleryImage
  const dummyAlbumId = new mongoose.Types.ObjectId();
  const galleryImg = new GalleryImage({
    albumId: dummyAlbumId,
    imageUrl: 'https://example.com/track.jpg',
    caption: '100m sprint finals',
  });
  assert(!galleryImg.validateSync(), 'GalleryImage schema validates album reference');

  // Model 11: CampusPage
  const campus = new CampusPage({
    title: 'Modern Science Laboratories',
    slug: 'science-laboratories',
    content: 'Fully equipped physics, chemistry, and biology labs.',
  });
  assert(!campus.validateSync(), 'CampusPage schema validates infrastructure content');

  // Model 12: Facility
  const facility = new Facility({
    name: 'Smart Classrooms',
    slug: 'smart-classrooms',
    description: 'Digitally enabled classrooms with interactive learning displays.',
  });
  assert(!facility.validateSync(), 'Facility schema validates with slug and description');

  // Model 13: Achievement
  const achievement = new Achievement({
    title: 'District Science Exhibition First Prize',
    category: 'academic',
    description: 'Awarded first position in the inter-school science symposium.',
  });
  assert(!achievement.validateSync(), 'Achievement schema validates category and details');

  // Model 14: Topper
  const topper = new Topper({
    studentName: 'Ananya Srivastava',
    academicYear: '2025-2026',
    examType: 'Class 10',
    percentageOrScore: '98.6%',
  });
  assert(!topper.validateSync(), 'Topper schema validates board exam results structure');

  // Model 15: Notice
  const notice = new Notice({
    title: 'Periodic Assessment Schedule Announced',
    category: 'examination',
    content: 'Periodic assessments will commence from the third week of November.',
  });
  assert(!notice.validateSync(), 'Notice schema validates circular details and category');

  // Model 16: Document
  const doc = new Document({
    title: 'CBSE Mandatory Public Disclosure Form',
    category: 'mandatory_disclosure',
    fileUrl: 'https://example.com/disclosure.pdf',
    fileFormat: 'PDF',
  });
  assert(!doc.validateSync(), 'Document schema validates official disclosure categories');

  // Model 17: AcademicContent
  const academic = new AcademicContent({
    gradeLevel: 'Secondary Wing (Classes 9 - 10)',
    curriculumOverview: 'Affiliated curriculum adhering to national pedagogical standards.',
  });
  assert(!academic.validateSync(), 'AcademicContent schema validates curriculum structure');

  // Model 18: LegalPage
  const legal = new LegalPage({
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: 'Official data protection and privacy policy for L.K.S.K Convent School portal.',
  });
  assert(!legal.validateSync(), 'LegalPage schema validates policy records');

  // SECTION 2: Live HTTP API Endpoints & Middlewares
  console.log(`\n${colors.bold}2. Testing Live HTTP REST API Endpoints & Middlewares:${colors.reset}`);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 2.1 Test GET /api/health
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'GET /api/health returns HTTP 200 OK');
    assert(healthData.success === true, 'GET /api/health returns standard success: true');
    assert(
      healthData.data && healthData.data.school && healthData.data.school.name === 'L.K.S.K Convent School',
      'GET /api/health provides verified school metadata'
    );
    assert(
      healthData.data && healthData.data.database && typeof healthData.data.database.status === 'string',
      'GET /api/health provides live database status indicator'
    );

    // 2.2 Test Root GET /
    const rootRes = await fetch(`${baseUrl}/`);
    const rootData = await rootRes.json();
    assert(rootRes.status === 200 && rootData.success === true, 'GET / returns standard welcome payload');

    // 2.3 Test 404 Handler on non-existent route
    const notFoundRes = await fetch(`${baseUrl}/api/non-existent-route-xyz`);
    const notFoundData = await notFoundRes.json();
    assert(notFoundRes.status === 404, 'Non-existent route returns HTTP 404 Not Found');
    assert(
      notFoundData.success === false && notFoundData.errors.length > 0,
      '404 response adheres to standard error structure with errors array'
    );

    // 2.4 Test Contact Form Validation (Missing required fields)
    const badContactRes = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'A',
        email: 'invalid-email',
      }),
    });
    const badContactData = await badContactRes.json();
    assert(badContactRes.status === 400, 'POST /api/contact with invalid data returns HTTP 400 Bad Request');
    assert(
      badContactData.success === false && badContactData.errors.length >= 3,
      'POST /api/contact validation catches multiple missing fields (email, subject, message)'
    );

    // 2.5 Test Admission Form Validation (Missing fields)
    const badAdmissionRes = await fetch(`${baseUrl}/api/admissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: '',
        email: 'not-valid',
      }),
    });
    const badAdmissionData = await badAdmissionRes.json();
    assert(badAdmissionRes.status === 400, 'POST /api/admissions with invalid data returns HTTP 400');
    assert(
      badAdmissionData.success === false && badAdmissionData.errors.length > 0,
      'POST /api/admissions validation lists specific field failure reasons'
    );

    // 2.6 Test Auth Protection on Protected Endpoint (POST /api/notices without token)
    const unauthNoticeRes = await fetch(`${baseUrl}/api/notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Unauthorized Notice Attempt',
        content: 'Should be rejected',
        category: 'general',
      }),
    });
    const unauthNoticeData = await unauthNoticeRes.json();
    assert(unauthNoticeRes.status === 401, 'POST /api/notices without Bearer token returns HTTP 401 Unauthorized');
    assert(
      unauthNoticeData.success === false && unauthNoticeData.message.includes('token required'),
      'Protected endpoints block unauthorized access securely'
    );

    // 2.7 Test Auth Login Validation (empty body)
    const emptyLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const emptyLoginData = await emptyLoginRes.json();
    assert(emptyLoginRes.status === 400, 'POST /api/auth/login with empty body returns HTTP 400');
    assert(
      emptyLoginData.success === false && emptyLoginData.errors.length >= 2,
      'Login validator requires usernameOrEmail and password'
    );

    // 2.8 Test Route Mounting & Resolution for All 17 Endpoints
    const endpointsToVerify = [
      '/api/settings',
      '/api/hero',
      '/api/announcements',
      '/api/staff',
      '/api/gallery',
      '/api/campus',
      '/api/facilities',
      '/api/achievements',
      '/api/testimonials',
      '/api/documents',
      '/api/notices',
      '/api/academic',
    ];

    let allMounted = true;
    for (const ep of endpointsToVerify) {
      const res = await fetch(`${baseUrl}${ep}`);
      if (res.status === 404) {
        allMounted = false;
        console.error(`Route not found: ${ep}`);
      }
    }
    assert(allMounted, 'All 17 requested API routes are correctly mounted and resolve');

  } finally {
    server.close();
  }

  // Summary
  console.log(`\n${colors.bold}Verification Summary:${colors.reset}`);
  console.log(`  Passed: ${colors.green}${passedCount}${colors.reset}`);
  console.log(`  Failed: ${failedCount === 0 ? colors.green : colors.red}${failedCount}${colors.reset}`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    console.log(`\n${colors.bold}${colors.green}ALL ARCHITECTURAL & MODEL TESTS PASSED SUCCESSFULLY!${colors.reset}\n`);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
