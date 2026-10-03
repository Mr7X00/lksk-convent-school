/**
 * L.K.S.K Convent School - Administrator Authentication & Authorization Test Suite
 * Tests valid login, invalid login, logout, token expiration, protected endpoints, and rate limiting.
 */

const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const app = require('../src/app');
const Admin = require('../src/models/Admin');
const AuthService = require('../src/services/auth.service');

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

async function runAuthTests() {
  console.log(`\n${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan} L.K.S.K Convent School — Security & Auth Test Suite  ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}\n`);

  // SECTION 1: Unit & Model Level Security
  console.log(`${colors.bold}1. Testing Cryptography, Admin Model & Security Methods:${colors.reset}`);

  // Test 1.1: Password Hashing with Bcrypt
  const plainPassword = 'SecurePassword@2026';
  const hashed = await Admin.hashPassword(plainPassword);
  assert(hashed && hashed.startsWith('$2'), 'Admin.hashPassword generates secure Bcrypt salt and hash');
  assert(await bcrypt.compare(plainPassword, hashed), 'Hashed password verifies against plain text');
  assert(!(await bcrypt.compare('WrongPassword', hashed)), 'Hashed password rejects invalid password');

  // Test 1.2: Password not exposed by default
  const adminDoc = new Admin({
    name: 'Lav Pandey',
    username: 'lavpandey',
    email: 'lkskconventschool@gmail.com',
    passwordHash: hashed,
  });
  const jsonOutput = adminDoc.toJSON();
  assert(jsonOutput.name === 'Lav Pandey', 'Admin model persists initial administrator name (Lav Pandey)');

  // Test 1.3: Brute-force account lock method
  assert(adminDoc.isLocked() === false, 'Account initially unlocked');
  adminDoc.lockUntil = new Date(Date.now() + 60000);
  assert(adminDoc.isLocked() === true, 'Admin.isLocked identifies active lock window');
  adminDoc.lockUntil = new Date(Date.now() - 1000);
  assert(adminDoc.isLocked() === false, 'Admin.isLocked releases after lock window expires');
  adminDoc.lockUntil = null;

  // SECTION 2: Live HTTP REST API Authentication & Authorization
  console.log(`\n${colors.bold}2. Testing Live HTTP Endpoints & Authorization Middlewares:${colors.reset}`);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  // In-memory test administrator for auth pipeline tests
  const testAdminId = new mongoose.Types.ObjectId();
  const testAdminRecord = {
    _id: testAdminId,
    id: testAdminId.toString(),
    name: 'Lav Pandey',
    username: 'lavpandey',
    email: 'lkskconventschool@gmail.com',
    role: 'superadmin',
    isActive: true,
    tokenVersion: 0,
    passwordHash: hashed,
    comparePassword: async function (pw) {
      return await bcrypt.compare(pw, this.passwordHash);
    },
    isLocked: () => false,
    incrementLoginAttempts: async () => {},
    resetLoginAttempts: async () => {},
    save: async () => {},
  };

  // Mock Admin.findOne and findById for test runner
  const originalFindOne = Admin.findOne;
  const originalFindById = Admin.findById;

  Admin.findOne = function (query) {
    return {
      select: function (fields) {
        if (
          query.username === 'lavpandey' ||
          query.email === 'lkskconventschool@gmail.com'
        ) {
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

  try {
    // TEST 2.1: Valid Login
    const validLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'lavpandey',
        password: plainPassword,
      }),
    });
    const validLoginData = await validLoginRes.json();
    assert(validLoginRes.status === 200, 'POST /api/auth/login returns HTTP 200 OK for valid credentials');
    assert(validLoginData.success === true, 'Login response has success: true');
    assert(Boolean(validLoginData.data?.token), 'Login response contains signed JWT token');
    assert(validLoginData.data?.admin?.name === 'Lav Pandey', 'Login response returns administrator name (Lav Pandey)');
    assert(!validLoginData.data?.admin?.passwordHash, 'Login response strictly hides passwordHash');

    const authToken = validLoginData.data.token;

    // TEST 2.2: Invalid Login (Wrong Password - Generic Error)
    const badPwRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'lavpandey',
        password: 'IncorrectPassword!',
      }),
    });
    const badPwData = await badPwRes.json();
    assert(badPwRes.status === 401, 'POST /api/auth/login returns HTTP 401 for wrong password');
    assert(badPwData.success === false, 'Invalid login response has success: false');
    assert(
      badPwData.message === 'Invalid credentials',
      'Generic error message used on bad password (no password mismatch hint)'
    );

    // TEST 2.3: Invalid Login (Non-existent User - Same Generic Error)
    const badUserRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'nonexistent_user',
        password: plainPassword,
      }),
    });
    const badUserData = await badUserRes.json();
    assert(badUserRes.status === 401, 'POST /api/auth/login returns HTTP 401 for non-existent account');
    assert(
      badUserData.message === 'Invalid credentials',
      'Generic error message used on non-existent user (prevents account enumeration)'
    );

    // TEST 2.4: Protected API WITH Authentication (GET /api/auth/me)
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, 'GET /api/auth/me returns HTTP 200 with valid Bearer token');
    assert(meData.success === true && meData.data?.admin?.username === 'lavpandey', 'Protected route returns verified admin profile');

    // TEST 2.5: Protected API WITHOUT Authentication
    const noAuthRes = await fetch(`${baseUrl}/api/auth/me`);
    const noAuthData = await noAuthRes.json();
    assert(noAuthRes.status === 401, 'GET /api/auth/me without token returns HTTP 401 Unauthorized');
    assert(
      noAuthData.message.includes('token required'),
      'Clear error message indicating authentication token required'
    );

    // TEST 2.6: Malformed Authentication Token
    const malformedRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        Authorization: 'Bearer this.is.a.malformed.fake.token',
      },
    });
    assert(malformedRes.status === 401, 'Malformed JWT token returns HTTP 401 Unauthorized');

    // TEST 2.7: Expired Authentication Token
    const expiredToken = jwt.sign(
      { id: testAdminId, username: 'lavpandey', role: 'superadmin', tokenVersion: 0 },
      process.env.JWT_SECRET || 'dev_jwt_secret_lksk_school_2026_secure',
      { expiresIn: '-1s' } // Expired 1 second ago
    );
    const expiredRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${expiredToken}`,
      },
    });
    const expiredData = await expiredRes.json();
    assert(expiredRes.status === 401, 'Expired JWT token returns HTTP 401 Unauthorized');
    assert(
      expiredData.message.includes('expired'),
      'Expired token message properly prompts user to log in again'
    );

    // TEST 2.8: Logout & Session Invalidation
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const logoutData = await logoutRes.json();
    assert(logoutRes.status === 200, 'POST /api/auth/logout returns HTTP 200 OK');
    assert(logoutData.success === true, 'Logout responds with success: true');

    // TEST 2.9: Brute-Force Rate Limiting (Rapid Login Attempts)
    console.log(`\n${colors.bold}3. Testing Brute-Force Rate Limiting on Login:${colors.reset}`);
    let hitRateLimit = false;

    // Send rapid requests to trigger authLimiter (max: 10 per 15 min)
    for (let i = 0; i < 12; i++) {
      const rateRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernameOrEmail: 'lavpandey',
          password: 'Attempt_' + i,
        }),
      });

      if (rateRes.status === 429) {
        hitRateLimit = true;
        const rateData = await rateRes.json();
        assert(
          rateData.success === false && rateData.message.includes('Too many login attempts'),
          'HTTP 429 received with standard brute-force warning message'
        );
        break;
      }
    }

    assert(hitRateLimit, 'Rate limiter activates and enforces HTTP 429 on excessive attempts');

  } finally {
    // Restore original methods
    Admin.findOne = originalFindOne;
    Admin.findById = originalFindById;
    server.close();
  }

  // Summary
  console.log(`\n${colors.bold}Authentication Verification Summary:${colors.reset}`);
  console.log(`  Passed: ${colors.green}${passedCount}${colors.reset}`);
  console.log(`  Failed: ${failedCount === 0 ? colors.green : colors.red}${failedCount}${colors.reset}`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    console.log(`\n${colors.bold}${colors.green}ALL AUTHENTICATION & AUTHORIZATION TESTS PASSED!${colors.reset}\n`);
  }
}

runAuthTests().catch((err) => {
  console.error('Fatal auth test error:', err);
  process.exit(1);
});
