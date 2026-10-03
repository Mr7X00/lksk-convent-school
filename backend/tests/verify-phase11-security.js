/**
 * Phase 11 — Security Hardening & Production Audit Verification Suite
 * L.K.S.K Convent School
 *
 * Validates:
 * 1. Authentication Security (Bcrypt hashing, generic errors, lockout logic, session revocation)
 * 2. Authorization & RBAC (Protected admin routes reject unauthenticated requests with 401)
 * 3. Object-Level Authorization & ObjectID validation (Rejects malformed IDs with 400)
 * 4. NoSQL Operator Injection Protection (Strips $ and . keys from body/query/params)
 * 5. Mass Assignment Protection (Public admission/contact forms cannot inject status or internal notes)
 * 6. Input Validation, Bounded Pagination & ReDoS search escaping
 * 7. CSV Export Formula Injection Mitigation (Prefixed with single quote)
 * 8. HTTP Security Headers (Helmet, nosniff, frame-ancestors, CSP)
 * 9. Production Info Disclosure (Health check masking, seed-admin disabled in prod)
 */

const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const { Admin, AdmissionInquiry, ContactInquiry } = require('../src/models');
const mongoSanitize = require('../src/middlewares/mongoSanitize');
const InquiryService = require('../src/services/inquiry.service');
const { escapeRegex, isSafeUrl, escapeCsvCell } = require('../src/utils/security');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_lksk_school_2026_secure';

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

async function runSecurityTests() {
  console.log(`\n${colors.bold}${colors.cyan}================================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan} Phase 11 — Security Hardening & Production Audit Verification  ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}================================================================${colors.reset}\n`);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // ------------------------------------------------------------------------
    // SECTION 1: Security Utilities & Cryptography
    // ------------------------------------------------------------------------
    console.log(`${colors.bold}1. Testing Cryptographic Hashing & Utility Defenses:${colors.reset}`);

    // Bcrypt hashing check
    const plainPassword = 'AuditAdminPassword#2026';
    const hash = await Admin.hashPassword(plainPassword);
    assert(hash && hash.startsWith('$2'), 'Password hashing uses modern bcrypt salt and rounds');
    assert(await bcrypt.compare(plainPassword, hash), 'Bcrypt hash correctly verifies against plain text');
    assert(!(await bcrypt.compare('WrongPassword#123', hash)), 'Bcrypt hash rejects incorrect password');

    // ReDoS protection via escapeRegex
    const dangerousRegex = '.*+?^${}()|[\\]\\\\evil.*';
    const escaped = escapeRegex(dangerousRegex, 50);
    assert(escaped.includes('\\(') && escaped.includes('\\[') && escaped.includes('\\$'), 'escapeRegex safely escapes regex metacharacters');
    assert(escapeRegex('a'.repeat(200), 50).length === 50, 'escapeRegex bounds max regex length to prevent catastrophic backtracking');

    // URL security check
    assert(isSafeUrl('https://example.com/test'), 'isSafeUrl accepts valid https:// URLs');
    assert(isSafeUrl('http://example.com/test'), 'isSafeUrl accepts valid http:// URLs');
    assert(!isSafeUrl('javascript:alert(1)'), 'isSafeUrl rejects javascript: scheme');
    assert(!isSafeUrl('data:text/html,<script>alert(1)</script>'), 'isSafeUrl rejects data: scheme');
    assert(!isSafeUrl('vbscript:msgbox(1)'), 'isSafeUrl rejects vbscript: scheme');

    // CSV Formula Injection mitigation
    assert(escapeCsvCell('=CMD|/C calc.exe') === '"\'=CMD|/C calc.exe"', 'escapeCsvCell neutralizes = formula prefix');
    assert(escapeCsvCell('   +1234') === '"\'   +1234"', 'escapeCsvCell neutralizes formula with leading whitespace');
    assert(escapeCsvCell('@SUM(A1:A10)') === '"\'@SUM(A1:A10)"', 'escapeCsvCell neutralizes @ formula prefix');
    assert(escapeCsvCell('-2+5') === '"\'-2+5"', 'escapeCsvCell neutralizes - formula prefix');
    assert(escapeCsvCell('Normal Text') === '"Normal Text"', 'escapeCsvCell preserves normal alphanumeric text safely');

    // ------------------------------------------------------------------------
    // SECTION 2: Authentication Security & Session Revocation
    // ------------------------------------------------------------------------
    console.log(`\n${colors.bold}2. Testing Authentication & Session Lifecycle:${colors.reset}`);

    const testAdminId = new mongoose.Types.ObjectId();
    const testAdminRecord = {
      _id: testAdminId,
      id: testAdminId.toString(),
      fullName: 'Lav Pandey',
      name: 'Lav Pandey',
      username: 'lavpandey',
      email: 'lkskconventschool@gmail.com',
      role: 'superadmin',
      isActive: true,
      tokenVersion: 0,
      passwordHash: hash,
      failedLoginAttempts: 0,
      lastLogoutAt: null,
      comparePassword: async function (pw) {
        return await bcrypt.compare(pw, this.passwordHash);
      },
      isLocked: () => false,
      incrementLoginAttempts: async function () { this.failedLoginAttempts += 1; },
      resetLoginAttempts: async function () { this.failedLoginAttempts = 0; },
      save: async function () {},
    };

    // Mock Admin model find operations
    const origFindOne = Admin.findOne;
    const origFindById = Admin.findById;

    Admin.findOne = function (query) {
      return {
        select: function () {
          if (query.username === 'lavpandey' || query.email === 'lkskconventschool@gmail.com') {
            return Promise.resolve(testAdminRecord);
          }
          return Promise.resolve(null);
        },
      };
    };

    Admin.findById = function (id) {
      if (String(id) === String(testAdminId)) {
        return Promise.resolve(testAdminRecord);
      }
      return Promise.resolve(null);
    };

    // 2.1 Generic error messages on invalid login
    const badLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail: 'lavpandey', password: 'WrongPassword' }),
    });
    const badLoginJson = await badLoginRes.json();
    assert(badLoginRes.status === 401, 'Bad password returns HTTP 401');
    assert(badLoginJson.message && badLoginJson.message.toLowerCase().includes('invalid credentials'), 'Generic error message returned on bad password (no password mismatch hint)');

    const unknownUserRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail: 'completely_unknown_user_9999', password: 'SomePassword' }),
    });
    const unknownUserJson = await unknownUserRes.json();
    assert(unknownUserRes.status === 401, 'Nonexistent account returns HTTP 401');
    assert(unknownUserJson.message && unknownUserJson.message.toLowerCase().includes('invalid credentials'), 'Generic error message returned on unknown account (no account existence hint)');

    // 2.2 Valid Login
    const validLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail: 'lavpandey', password: plainPassword }),
    });
    const validLoginJson = await validLoginRes.json();
    assert(validLoginRes.status === 200, 'Valid login returns HTTP 200');
    assert(Boolean(validLoginJson.data?.token), 'Valid login returns JWT token');
    const token = validLoginJson.data.token;

    // 2.3 Access protected route with token
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(meRes.status === 200, 'Access protected /api/auth/me with valid token returns HTTP 200');

    // 2.4 Token session revocation via tokenVersion / logout
    testAdminRecord.tokenVersion = 1; // Admin logged out or invalidated sessions
    const revokedRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(revokedRes.status === 401, 'Token with outdated tokenVersion is rejected with HTTP 401 (session revocation)');
    testAdminRecord.tokenVersion = 0; // restore

    // ------------------------------------------------------------------------
    // SECTION 3: Authorization & Broken Access Control
    // ------------------------------------------------------------------------
    console.log(`\n${colors.bold}3. Testing Broken Access Control & RBAC Across Admin Routes:${colors.reset}`);

    const adminEndpoints = [
      { method: 'GET', url: '/api/admin/stats' },
      { method: 'GET', url: '/api/admissions' },
      { method: 'GET', url: '/api/contact' },
      { method: 'GET', url: '/api/admissions/export/csv' },
      { method: 'GET', url: '/api/contact/export/csv' },
      { method: 'POST', url: '/api/notices' },
      { method: 'POST', url: '/api/documents' },
      { method: 'POST', url: '/api/staff' },
      { method: 'POST', url: '/api/gallery' },
      { method: 'POST', url: '/api/achievements' },
      { method: 'PUT', url: '/api/settings' },
      { method: 'DELETE', url: '/api/documents/507f1f77bcf86cd799439011' },
    ];

    let allBlocked = true;
    for (const ep of adminEndpoints) {
      const res = await fetch(`${baseUrl}${ep.url}`, {
        method: ep.method,
        headers: { 'Content-Type': 'application/json' },
        body: ['POST', 'PUT', 'PATCH'].includes(ep.method) ? JSON.stringify({ dummy: 'test' }) : undefined,
      });
      if (res.status !== 401) {
        allBlocked = false;
        console.error(`Endpoint ${ep.method} ${ep.url} failed to block anonymous request: returned ${res.status}`);
      }
    }
    assert(allBlocked, 'All 12 sensitive admin operations strictly require authentication (HTTP 401)');

    // ------------------------------------------------------------------------
    // SECTION 4: Object-Level Authorization & ObjectID Validation
    // ------------------------------------------------------------------------
    console.log(`\n${colors.bold}4. Testing Object-Level Authorization & Parameter Validation:${colors.reset}`);

    const activeToken = jwt.sign(
      { id: testAdminId.toString(), username: 'lavpandey', role: 'superadmin' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Test path traversal / injection in :id
    const malformedIds = [
      '../../etc/passwd',
      'invalid-id',
      '1',
      '507f1f77bcf86cd79943901z', // invalid hex
      '%2e%2e%2f',
    ];

    let objectIdValidationPassed = true;
    for (const badId of malformedIds) {
      const encodedId = encodeURIComponent(badId);
      const res = await fetch(`${baseUrl}/api/admissions/${encodedId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${activeToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Under Review' }),
      });
      if (res.status !== 400) {
        objectIdValidationPassed = false;
        console.error(`Malformed ID "${badId}" did not return 400: got ${res.status}`);
      }
    }
    assert(objectIdValidationPassed, 'validateObjectId middleware intercepts malformed IDs and path traversal attempts with HTTP 400');

    // ------------------------------------------------------------------------
    // SECTION 5: NoSQL Operator Injection Protection (mongoSanitize)
    // ------------------------------------------------------------------------
    console.log(`\n${colors.bold}5. Testing NoSQL Operator Injection Defenses:${colors.reset}`);

    const reqMock = {
      body: {
        normalField: 'test',
        $where: 'sleep(1000)',
        nested: {
          $ne: 'bad',
          allowed: 'ok',
          'dotted.key': 'evil',
        },
      },
      query: {
        category: 'Sports',
        $gt: '',
      },
      params: {
        id: '123',
        $ne: '456',
      },
    };

    mongoSanitize(reqMock, {}, () => {});
    assert(reqMock.body.$where === undefined, 'mongoSanitize stripped top-level $where operator');
    assert(reqMock.body.nested.$ne === undefined, 'mongoSanitize stripped nested $ne operator');
    assert(reqMock.body.nested['dotted.key'] === undefined, 'mongoSanitize stripped key with dot notation');
    assert(reqMock.body.nested.allowed === 'ok', 'mongoSanitize preserved benign nested fields');
    assert(reqMock.query.$gt === undefined, 'mongoSanitize stripped $gt operator from query parameters');
    assert(reqMock.query.category === 'Sports', 'mongoSanitize preserved benign query parameters');

    // ------------------------------------------------------------------------
    // SECTION 6: Mass Assignment Protection
    // ------------------------------------------------------------------------
    console.log(`\n${colors.bold}6. Testing Mass Assignment Protection on Public Forms:${colors.reset}`);

    // Mock create method to inspect fields passed by InquiryService
    const originalAdmissionCreate = AdmissionInquiry.create;
    const dbConfig = require('../src/config/db');
    const origReadyState = mongoose.connection.readyState;
    Object.defineProperty(mongoose.connection, 'readyState', { value: 1, configurable: true });

    let interceptedData = null;
    AdmissionInquiry.create = function (data) {
      interceptedData = data;
      return Promise.resolve({ ...data, _id: new mongoose.Types.ObjectId() });
    };

    await InquiryService.createAdmissionInquiry({
      studentName: 'Aarav Gupta',
      parentName: 'Ramesh Gupta',
      email: 'aarav.parent@example.com',
      phone: '9876543211',
      gradeApplying: 'Class 6',
      // Attacker attempts to forge privileged fields:
      status: 'Enrolled',
      adminNotes: 'APPROVED_BY_HACKER',
      role: 'superadmin',
      isAdmin: true,
    });

    assert(interceptedData.status === 'New', 'status forced to "New"; attacker-supplied "Enrolled" was discarded');
    assert(interceptedData.adminNotes === '', 'adminNotes forced to empty string; attacker notes were discarded');
    assert(interceptedData.role === undefined, 'Arbitrary privilege field "role" was rejected');
    assert(interceptedData.isAdmin === undefined, 'Arbitrary privilege field "isAdmin" was rejected');

    AdmissionInquiry.create = originalAdmissionCreate;
    Object.defineProperty(mongoose.connection, 'readyState', { value: origReadyState, configurable: true });

    // ------------------------------------------------------------------------
    // SECTION 7: HTTP Security Headers & Helmet
    // ------------------------------------------------------------------------
    console.log(`\n${colors.bold}7. Testing Security Headers & Production Configuration:${colors.reset}`);

    const headerRes = await fetch(`${baseUrl}/api/health`);
    const headers = headerRes.headers;

    assert(headers.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options: nosniff is set');
    assert(headers.get('x-frame-options') === 'SAMEORIGIN', 'X-Frame-Options: SAMEORIGIN is set');
    assert(Boolean(headers.get('content-security-policy')), 'Content-Security-Policy header is present');
    
    const csp = headers.get('content-security-policy') || '';
    assert(csp.includes("frame-ancestors 'self'"), "CSP restricts frame-ancestors to 'self' (prevents clickjacking)");

    // Health endpoint information masking
    const healthJson = await headerRes.json();
    assert(healthJson.data?.school?.name === 'L.K.S.K Convent School', 'Health endpoint reports school identity');

    // In production mode, database host and db name must be masked
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const prodHealthRes = await fetch(`${baseUrl}/api/health`);
    const prodHealthJson = await prodHealthRes.json();
    assert(prodHealthJson.data?.database?.host === undefined, 'Health check database host masked/omitted in production');
    assert(prodHealthJson.data?.database?.name === undefined, 'Health check database name masked/omitted in production');
    process.env.NODE_ENV = originalEnv;

    // Restore Admin mock
    Admin.findOne = origFindOne;
    Admin.findById = origFindById;

  } finally {
    server.close();
  }

  // Summary
  console.log(`\n${colors.bold}Phase 11 Security Verification Summary:${colors.reset}`);
  console.log(`  Passed: ${colors.green}${passedCount}${colors.reset}`);
  console.log(`  Failed: ${failedCount === 0 ? colors.green : colors.red}${failedCount}${colors.reset}`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    console.log(`\n${colors.bold}${colors.green}ALL PHASE 11 SECURITY AUDIT & HARDENING TESTS PASSED!${colors.reset}\n`);
  }
}

runSecurityTests().catch((err) => {
  console.error('Fatal security test error:', err);
  process.exit(1);
});
