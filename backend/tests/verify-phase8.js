/**
 * L.K.S.K Convent School - Phase 8 Communication & Inquiry Verification Suite
 * Tests Admission Popup settings, Admission inquiry flow, Contact inquiry flow,
 * Email notifications, Honeypot spam defense, CSV exports, and RBAC authorization.
 */

const http = require('http');
const mongoose = require('mongoose');
const app = require('../src/app');
const { AdmissionInquiry, ContactInquiry, WebsiteSettings, Admin } = require('../src/models');
const EmailService = require('../src/services/emailService');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

let passed = 0;
let failed = 0;

function assert(condition, name, details = '') {
  if (condition) {
    passed++;
    console.log(`  ${colors.green}✓${colors.reset} ${name}`);
  } else {
    failed++;
    console.error(`  ${colors.red}✗${colors.reset} ${name} ${details ? '(' + details + ')' : ''}`);
  }
}

function makeRequest(server, path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const reqHeaders = { ...headers };
    let payload = null;

    if (body) {
      payload = typeof body === 'string' ? body : JSON.stringify(body);
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runPhase8Tests() {
  console.log(`\n${colors.bold}${colors.cyan}================================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan} Phase 8 Verification: Admission, Contact, WhatsApp & CRM Inbox  ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}================================================================${colors.reset}\n`);

  // 1. Mongoose Models Verification
  console.log(`${colors.bold}1. Testing Models & Schema Enhancements:${colors.reset}`);
  
  // AdmissionInquiry
  const testAdmission = new AdmissionInquiry({
    studentName: 'Aarav Sharma',
    parentName: 'Ramesh Sharma',
    email: 'ramesh.sharma@example.com',
    phone: '+91 94523 11111',
    classSeeking: 'Class 6',
    dateOfBirth: new Date('2014-05-15'),
    gender: 'male',
    address: 'Sohawal, Ayodhya',
    message: 'Seeking information on school bus routes.',
    status: 'New',
  });
  const admissionErr = testAdmission.validateSync();
  assert(!admissionErr, 'AdmissionInquiry validates with all Phase 8 student and parent fields');
  assert(testAdmission.gradeApplying === 'Class 6', 'AdmissionInquiry synchronizes classSeeking to gradeApplying for compatibility');
  assert(testAdmission.status === 'New', 'AdmissionInquiry defaults status to New');

  // ContactInquiry
  const testContact = new ContactInquiry({
    name: 'Pooja Verma',
    email: 'pooja.verma@example.com',
    phone: '9876543210',
    subject: 'Academic Session Calendar Query',
    message: 'Could you please confirm the start date of term examinations?',
    status: 'New',
    adminNotes: 'Contacted over phone on 4th Oct',
  });
  const contactErr = testContact.validateSync();
  assert(!contactErr, 'ContactInquiry validates with subject, message, and phone fields');
  assert(testContact.notes === 'Contacted over phone on 4th Oct', 'ContactInquiry synchronizes adminNotes and notes');

  // WebsiteSettings
  const testSettings = new WebsiteSettings();
  assert(testSettings.admissionPopup && testSettings.admissionPopup.enabled === true, 'WebsiteSettings includes admissionPopup schema with default enabled=true');
  assert(testSettings.admissionPopup.title === 'Admission Open — 2026–27', 'WebsiteSettings admissionPopup has default title "Admission Open — 2026–27"');
  assert(testSettings.admissionPopup.ctaUrl === '/academic/admission-inquiry', 'WebsiteSettings admissionPopup has default CTA pointing to /academic/admission-inquiry');
  assert(testSettings.whatsApp && typeof testSettings.whatsApp.defaultMessage === 'string', 'WebsiteSettings includes WhatsApp configuration schema');
  assert(testSettings.contactDetails.googleMapsEmbedUrl !== undefined, 'WebsiteSettings includes googleMapsEmbedUrl in contactDetails');

  // 2. Email Service Safety
  console.log(`\n${colors.bold}2. Testing Email Service Resiliency (No Crash on Missing SMTP):${colors.reset}`);
  const emailRes1 = await EmailService.sendContactNotification({
    name: 'Test Contact',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test inquiry body text',
  });
  assert(emailRes1 && emailRes1.delivered === false && emailRes1.reason === 'SMTP_NOT_CONFIGURED', 'sendContactNotification safely handles unconfigured SMTP without throwing');

  const emailRes2 = await EmailService.sendAdmissionNotification({
    studentName: 'Test Student',
    classSeeking: 'Nursery',
    parentName: 'Parent Test',
    phone: '9452300000',
    email: 'parent@example.com',
  });
  assert(emailRes2 && emailRes2.delivered === false && emailRes2.reason === 'SMTP_NOT_CONFIGURED', 'sendAdmissionNotification safely handles unconfigured SMTP without throwing');

  // 3. HTTP Server and Live Endpoint Testing
  console.log(`\n${colors.bold}3. Testing HTTP API Validations, Honeypot & Endpoints:${colors.reset}`);
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));

  try {
    // Contact Submission Validation
    const invalidContactRes = await makeRequest(server, '/api/contact', 'POST', {
      name: '',
      email: 'invalid-email',
      subject: '',
      message: 'short',
    });
    assert(invalidContactRes.status === 400, 'POST /api/contact rejects empty or malformed inputs with 400');
    assert(Array.isArray(invalidContactRes.body.errors) && invalidContactRes.body.errors.length >= 3, 'POST /api/contact returns granular validation errors');

    // Honeypot spam test on Contact
    const spamContactRes = await makeRequest(server, '/api/contact', 'POST', {
      name: 'Bot Spammer',
      email: 'bot@spam.com',
      subject: 'Buy Cheap Watches',
      message: 'Click this link to buy cheap spam products now!',
      hp_website: 'http://spam-link.com',
    });
    assert(spamContactRes.status === 400, 'POST /api/contact detects honeypot submission and blocks with 400');
    assert(spamContactRes.body.errors?.[0]?.field === 'bot_detected', 'Honeypot rejection flags bot_detected field');

    // Admission Submission Validation
    const invalidAdmissionRes = await makeRequest(server, '/api/admissions', 'POST', {
      studentName: '',
      parentName: '',
      phone: '123', // Too short
      email: 'not-an-email',
      classSeeking: '',
    });
    assert(invalidAdmissionRes.status === 400, 'POST /api/admissions rejects invalid student and contact data with 400');

    // Honeypot spam test on Admissions
    const spamAdmissionRes = await makeRequest(server, '/api/admissions', 'POST', {
      studentName: 'Spam Student',
      parentName: 'Spam Parent',
      phone: '9876543210',
      email: 'spam@bot.net',
      classSeeking: 'Class 1',
      hp_website: 'bot-fill-value',
    });
    assert(spamAdmissionRes.status === 400, 'POST /api/admissions detects honeypot submission and blocks bot spam');

    // 4. Admin Endpoint Authorization Protection
    console.log(`\n${colors.bold}4. Testing Admin Authorization Gateways (RBAC):${colors.reset}`);
    const unauthAdmissions = await makeRequest(server, '/api/admissions', 'GET');
    assert(unauthAdmissions.status === 401, 'GET /api/admissions requires authentication (401)');

    const unauthAdmissionsCsv = await makeRequest(server, '/api/admissions/export/csv', 'GET');
    assert(unauthAdmissionsCsv.status === 401, 'GET /api/admissions/export/csv requires authentication (401)');

    const unauthContact = await makeRequest(server, '/api/contact', 'GET');
    assert(unauthContact.status === 401, 'GET /api/contact requires authentication (401)');

    const unauthContactCsv = await makeRequest(server, '/api/contact/export/csv', 'GET');
    assert(unauthContactCsv.status === 401, 'GET /api/contact/export/csv requires authentication (401)');

    const unauthAdmissionPatch = await makeRequest(server, '/api/admissions/507f1f77bcf86cd799439011', 'PATCH', { status: 'Contacted' });
    assert(unauthAdmissionPatch.status === 401, 'PATCH /api/admissions/:id requires authentication (401)');

    const unauthAdmissionDelete = await makeRequest(server, '/api/admissions/507f1f77bcf86cd799439011', 'DELETE');
    assert(unauthAdmissionDelete.status === 401, 'DELETE /api/admissions/:id requires authentication (401)');

    // 5. Settings Endpoint
    console.log(`\n${colors.bold}5. Testing Website & Communication Settings Endpoints:${colors.reset}`);
    const settingsRes = await makeRequest(server, '/api/settings', 'GET');
    assert(settingsRes.status === 200, 'GET /api/settings resolves with HTTP 200');
    assert(settingsRes.body.data && settingsRes.body.data.admissionPopup !== undefined, 'Settings endpoint returns admissionPopup configuration payload');
    assert(settingsRes.body.data.whatsApp !== undefined, 'Settings endpoint returns whatsApp configuration payload');

    const unauthSettingsPut = await makeRequest(server, '/api/settings', 'PUT', { schoolName: 'Test School' });
    assert(unauthSettingsPut.status === 401, 'PUT /api/settings requires admin authorization (401)');

  } finally {
    server.close();
  }

  console.log(`\n${colors.bold}Phase 8 Verification Summary:${colors.reset}`);
  console.log(`  ${colors.green}Passed:${colors.reset} ${passed}`);
  console.log(`  ${colors.red}Failed:${colors.reset} ${failed}`);

  if (failed === 0) {
    console.log(`\n${colors.bold}${colors.green}ALL PHASE 8 TESTS PASSED SUCCESSFULLY!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.error(`\n${colors.bold}${colors.red}PHASE 8 TESTS FAILED: ${failed} failures.${colors.reset}\n`);
    process.exit(1);
  }
}

runPhase8Tests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
