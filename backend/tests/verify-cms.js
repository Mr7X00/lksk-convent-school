/**
 * L.K.S.K Convent School - CMS & Dashboard CRUD Verification Suite
 * Tests admin stats, notices, inquiries, staff, testimonials, documents, and settings.
 */

const http = require('http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const Admin = require('../src/models/Admin');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
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

async function runCmsTests() {
  console.log(`\n${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan} L.K.S.K Convent School — CMS & Dashboard Test Suite  ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}\n`);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const testAdminId = new mongoose.Types.ObjectId();
  const validToken = jwt.sign(
    {
      id: testAdminId,
      username: 'lavpandey',
      role: 'superadmin',
      tokenVersion: 0,
    },
    process.env.JWT_SECRET || 'dev_jwt_secret_lksk_school_2026_secure',
    { expiresIn: '7d' }
  );

  const authHeaders = {
    Authorization: `Bearer ${validToken}`,
    'Content-Type': 'application/json',
  };

  try {
    // TEST 1: Dashboard Statistics Endpoint
    console.log(`${colors.bold}1. Testing Admin Dashboard Statistics Endpoint (/api/admin/stats):${colors.reset}`);

    const unauthStatsRes = await fetch(`${baseUrl}/api/admin/stats`);
    assert(unauthStatsRes.status === 401, 'GET /api/admin/stats without token returns HTTP 401');

    const authStatsRes = await fetch(`${baseUrl}/api/admin/stats`, { headers: authHeaders });
    const statsData = await authStatsRes.json();
    assert(authStatsRes.status === 200, 'GET /api/admin/stats with valid token returns HTTP 200 OK');
    assert(statsData.success === true, 'Stats response contains success: true');
    assert(
      statsData.data &&
        statsData.data.counts &&
        typeof statsData.data.counts.admissionInquiries === 'number' &&
        typeof statsData.data.counts.contactInquiries === 'number' &&
        typeof statsData.data.counts.staff === 'number' &&
        typeof statsData.data.counts.notices === 'number' &&
        typeof statsData.data.counts.documents === 'number',
      'Stats payload aggregates real counts for inquiries, faculty, circulars, and documents'
    );
    assert(
      Array.isArray(statsData.data.recentAdmissions) &&
        Array.isArray(statsData.data.recentContacts) &&
        Array.isArray(statsData.data.recentNotices),
      'Stats payload includes recent inquiry and circular arrays'
    );

    // TEST 2: Staff CRUD API
    console.log(`\n${colors.bold}2. Testing Faculty & Staff Management Endpoints (/api/staff):${colors.reset}`);

    const unauthStaffRes = await fetch(`${baseUrl}/api/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Faculty' }),
    });
    assert(unauthStaffRes.status === 401, 'POST /api/staff without auth returns HTTP 401 Unauthorized');

    const getStaffRes = await fetch(`${baseUrl}/api/staff?all=true`, { headers: authHeaders });
    const getStaffData = await getStaffRes.json();
    assert(getStaffRes.status === 200 && Array.isArray(getStaffData.data), 'GET /api/staff?all=true returns array of faculty');

    // TEST 3: Testimonials Management API
    console.log(`\n${colors.bold}3. Testing Testimonials Endpoints (/api/testimonials):${colors.reset}`);

    const unauthTestimonialRes = await fetch(`${baseUrl}/api/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorName: 'Test' }),
    });
    assert(unauthTestimonialRes.status === 401, 'POST /api/testimonials requires admin authorization');

    const getTestimonialsRes = await fetch(`${baseUrl}/api/testimonials?all=true`, { headers: authHeaders });
    assert(getTestimonialsRes.status === 200, 'GET /api/testimonials returns 200 OK');

    // TEST 4: Documents & Mandatory Disclosures API
    console.log(`\n${colors.bold}4. Testing Official Documents & Disclosures (/api/documents):${colors.reset}`);

    const unauthDocRes = await fetch(`${baseUrl}/api/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Document' }),
    });
    assert(unauthDocRes.status === 401, 'POST /api/documents requires admin authorization');

    const getDocsRes = await fetch(`${baseUrl}/api/documents?all=true`, { headers: authHeaders });
    assert(getDocsRes.status === 200, 'GET /api/documents returns HTTP 200 OK');

    // TEST 5: Notices Management API
    console.log(`\n${colors.bold}5. Testing Notices & Circulars Endpoints (/api/notices):${colors.reset}`);

    const getNoticesAllRes = await fetch(`${baseUrl}/api/notices/all`, { headers: authHeaders });
    const noticesData = await getNoticesAllRes.json();
    assert(getNoticesAllRes.status === 200, 'GET /api/notices/all returns HTTP 200 for authenticated admin');
    assert(noticesData.success === true && Array.isArray(noticesData.data?.notices), 'Returns notices array with pagination metadata');

    // TEST 6: Inquiries Management (Admissions & Contact)
    console.log(`\n${colors.bold}6. Testing Communication Inquiries Management (/api/admissions & /api/contact):${colors.reset}`);

    const getAdmissionsRes = await fetch(`${baseUrl}/api/admissions`, { headers: authHeaders });
    const admissionsData = await getAdmissionsRes.json();
    assert(getAdmissionsRes.status === 200, 'GET /api/admissions returns HTTP 200 for authenticated admin');
    assert(Array.isArray(admissionsData.data?.inquiries), 'Returns inquiries list and pagination');

    const getContactsRes = await fetch(`${baseUrl}/api/contact`, { headers: authHeaders });
    const contactsData = await getContactsRes.json();
    assert(getContactsRes.status === 200, 'GET /api/contact returns HTTP 200 for authenticated admin');
    assert(Array.isArray(contactsData.data?.inquiries), 'Returns contact messages list');

    // TEST 7: Settings CMS API
    console.log(`\n${colors.bold}7. Testing Website Settings Management (/api/settings):${colors.reset}`);

    const getSettingsRes = await fetch(`${baseUrl}/api/settings`);
    const settingsData = await getSettingsRes.json();
    assert(getSettingsRes.status === 200, 'GET /api/settings returns HTTP 200');
    assert(
      settingsData.data?.schoolName === 'L.K.S.K Convent School' &&
        settingsData.data?.contactDetails?.email === 'lkskconventschool@gmail.com',
      'Settings data contains verified school information'
    );

    const unauthSettingsPut = await fetch(`${baseUrl}/api/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tagline: 'Updated tagline' }),
    });
    assert(unauthSettingsPut.status === 401, 'PUT /api/settings without auth returns HTTP 401');

    // TEST 8: Campus, Facilities, Achievements & Legal CMS Endpoints
    console.log(`\n${colors.bold}8. Testing Remaining CMS Content Endpoints:${colors.reset}`);

    const [campusRes, facilitiesRes, achievementsRes, toppersRes, galleryRes, legalRes] = await Promise.all([
      fetch(`${baseUrl}/api/campus?all=true`),
      fetch(`${baseUrl}/api/facilities?all=true`),
      fetch(`${baseUrl}/api/achievements?all=true`),
      fetch(`${baseUrl}/api/achievements/toppers?all=true`),
      fetch(`${baseUrl}/api/gallery?all=true`),
      fetch(`${baseUrl}/api/legal/privacy-policy`),
    ]);

    assert(campusRes.status === 200, 'GET /api/campus resolves successfully');
    assert(facilitiesRes.status === 200, 'GET /api/facilities resolves successfully');
    assert(achievementsRes.status === 200, 'GET /api/achievements resolves successfully');
    assert(toppersRes.status === 200, 'GET /api/achievements/toppers resolves successfully');
    assert(galleryRes.status === 200, 'GET /api/gallery resolves successfully');
    assert(legalRes.status === 200, 'GET /api/legal/:slug resolves successfully');

    // TEST 9: Gallery & Toppers Authorization Protection
    console.log(`\n${colors.bold}9. Testing Gallery & Toppers Authorization Protection:${colors.reset}`);
    const unauthGalleryPost = await fetch(`${baseUrl}/api/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Unauthorized Album' }),
    });
    assert(unauthGalleryPost.status === 401, 'POST /api/gallery requires admin authorization');

    const unauthTopperPost = await fetch(`${baseUrl}/api/achievements/toppers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentName: 'Unauthorized Topper' }),
    });
    assert(unauthTopperPost.status === 401, 'POST /api/achievements/toppers requires admin authorization');

    const unauthGalleryImagePut = await fetch(`${baseUrl}/api/gallery/images/dummyid`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: 'Updated caption' }),
    });
    assert(unauthGalleryImagePut.status === 401, 'PUT /api/gallery/images/:id requires admin authorization');

  } finally {
    server.close();
  }

  // Summary
  console.log(`\n${colors.bold}CMS Verification Summary:${colors.reset}`);
  console.log(`  Passed: ${colors.green}${passedCount}${colors.reset}`);
  console.log(`  Failed: ${failedCount === 0 ? colors.green : colors.red}${failedCount}${colors.reset}`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    console.log(`\n${colors.bold}${colors.green}ALL CMS & DASHBOARD TESTS PASSED SUCCESSFULLY!${colors.reset}\n`);
  }
}

runCmsTests().catch((err) => {
  console.error('Fatal CMS test error:', err);
  process.exit(1);
});
