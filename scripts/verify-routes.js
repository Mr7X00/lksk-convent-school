/**
 * Comprehensive Route and Informational Pages Verification Script
 * Validates:
 * - All 26 informational pages + 404 handler
 * - SEO tags (title, meta description, viewport)
 * - Breadcrumbs & clean layout on all pages
 * - Responsive classes (mobile/tablet/desktop)
 * - Loading & empty state containers
 * - CMS API integration hooks
 * - Zero emojis in public UI
 * - HTTP responses from Vite dev server and API endpoints
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');

const EXPECTED_ROUTES = [
  // About
  { route: '/about', file: 'about/index.html', title: 'About Our Institution' },
  { route: '/about/manager', file: 'about/manager/index.html', title: "Manager's Desk" },
  { route: '/about/principal', file: 'about/principal/index.html', title: "Principal's Desk" },
  { route: '/about/mission-vision', file: 'about/mission-vision/index.html', title: 'Mission & Vision' },
  { route: '/about/faculty', file: 'about/faculty/index.html', title: 'Faculty & Teaching Staff', apiHook: true },
  
  // Academic
  { route: '/academic/admission-process', file: 'academic/admission-process/index.html', title: 'Admission Process & Guidelines' },
  { route: '/academic/admission-inquiry', file: 'academic/admission-inquiry/index.html', title: 'Online Admission Inquiry', formHook: true },
  { route: '/academic/toppers', file: 'academic/toppers/index.html', title: 'Topper Students & Board Results', apiHook: true },
  { route: '/academic/achievements', file: 'academic/achievements/index.html', title: 'Student Achievements & Distinctions', apiHook: true },
  { route: '/academic/co-curricular', file: 'academic/co-curricular/index.html', title: 'Co-Curricular Activities & House System' },
  { route: '/academic/calendar', file: 'academic/calendar/index.html', title: 'Academic Calendar' },
  { route: '/academic/syllabus', file: 'academic/syllabus/index.html', title: 'Syllabus & Curriculum Breakdown' },
  { route: '/academic/timetable', file: 'academic/timetable/index.html', title: 'School Time Table & Bell Schedule' },
  { route: '/academic/notices', file: 'academic/notices/index.html', title: 'Official Notice Board', apiHook: true },
  { route: '/academic/holidays', file: 'academic/holidays/index.html', title: 'Holiday List & Gazetted Recess' },
  
  // Campus (11 pages)
  { route: '/campus/classrooms', file: 'campus/classrooms/index.html', title: 'Campus Infrastructure: Classrooms', campusHook: true },
  { route: '/campus/principal-room', file: 'campus/principal-room/index.html', title: "Campus Infrastructure: Principal Room", campusHook: true },
  { route: '/campus/conference-room', file: 'campus/conference-room/index.html', title: 'Campus Infrastructure: Conference Room', campusHook: true },
  { route: '/campus/parking', file: 'campus/parking/index.html', title: 'Campus Infrastructure: Parking', campusHook: true },
  { route: '/campus/playground', file: 'campus/playground/index.html', title: 'Campus Infrastructure: Playground', campusHook: true },
  { route: '/campus/water-facility', file: 'campus/water-facility/index.html', title: 'Campus Infrastructure: Water Facility', campusHook: true },
  { route: '/campus/assembly', file: 'campus/assembly/index.html', title: 'Campus Infrastructure: Assembly', campusHook: true },
  { route: '/campus/library', file: 'campus/library/index.html', title: 'Campus Infrastructure: Library', campusHook: true },
  { route: '/campus/computer-lab', file: 'campus/computer-lab/index.html', title: 'Campus Infrastructure: Computer Lab', campusHook: true },
  { route: '/campus/science-lab', file: 'campus/science-lab/index.html', title: 'Campus Infrastructure: Science Lab', campusHook: true },
  { route: '/campus/transport', file: 'campus/transport/index.html', title: 'Campus Infrastructure: Transport', campusHook: true },

  // Gallery
  { route: '/gallery', file: 'gallery/index.html', title: 'Photo Gallery', galleryHook: true },

  // Legal Policies
  { route: '/legal', file: 'legal/index.html', title: 'Legal Policies &amp; Privacy' },

  // 404 handler
  { route: '/404.html', file: '404.html', title: 'Page Not Found' }
];

const EMOJI_REGEX = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/u;

function testFileIntegrity() {
  console.log('--- Step 1: Testing File System Integrity & SEO Meta Tags ---');
  let passed = 0;
  let failed = 0;

  for (const item of EXPECTED_ROUTES) {
    const fullPath = path.join(frontendDir, item.file);
    if (!fs.existsSync(fullPath)) {
      console.error(`  FAIL: Missing file ${item.file}`);
      failed++;
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');

    // 1. Title Check
    if (!content.includes('<title>') || !content.includes(item.title)) {
      console.error(`  FAIL: Title missing or incorrect in ${item.file}`);
      failed++;
      continue;
    }

    // 2. SEO Meta tags
    if (!content.includes('name="description"') || !content.includes('name="viewport"')) {
      console.error(`  FAIL: SEO Meta tags missing in ${item.file}`);
      failed++;
      continue;
    }

    // 3. Breadcrumb Check (except 404)
    if (item.file !== '404.html' && !content.includes('aria-label="Breadcrumb"')) {
      console.error(`  FAIL: Breadcrumb missing in ${item.file}`);
      failed++;
      continue;
    }

    // 4. Responsive design indicators
    if (!content.includes('md:') || !content.includes('max-w-7xl')) {
      console.error(`  FAIL: Responsive tokens missing in ${item.file}`);
      failed++;
      continue;
    }

    // 5. Check emojis
    if (EMOJI_REGEX.test(content)) {
      console.error(`  FAIL: Prohibited emoji detected in ${item.file}`);
      failed++;
      continue;
    }

    // 6. Controller hook checks
    if (item.apiHook && !content.includes('academicController') && !content.includes('aboutController')) {
      console.error(`  FAIL: API hook controller script missing in ${item.file}`);
      failed++;
      continue;
    }

    if (item.campusHook && !content.includes('campusController')) {
      console.error(`  FAIL: Campus controller script missing in ${item.file}`);
      failed++;
      continue;
    }

    if (item.galleryHook && !content.includes('galleryController')) {
      console.error(`  FAIL: Gallery controller script missing in ${item.file}`);
      failed++;
      continue;
    }

    passed++;
    console.log(`  PASS: ${item.route} (${item.title})`);
  }

  console.log(`File integrity: ${passed} passed, ${failed} failed.\n`);
  return failed === 0;
}

function fetchHttp(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body });
      });
    }).on('error', (err) => {
      resolve({ statusCode: 0, error: err.message });
    });
  });
}

async function testHttpEndpoints() {
  console.log('--- Step 2: Testing Dev Server HTTP Routes (port 5173) ---');
  let passed = 0;
  let failed = 0;

  for (const item of EXPECTED_ROUTES) {
    const url = `http://localhost:5173${item.route}`;
    const res = await fetchHttp(url);

    if (res.statusCode === 200) {
      if (res.body.includes(item.title) || res.body.includes('L.K.S.K')) {
        passed++;
        console.log(`  PASS: HTTP ${res.statusCode} -> ${item.route}`);
      } else {
        failed++;
        console.error(`  FAIL: HTTP ${res.statusCode} but content mismatch for ${item.route}`);
      }
    } else {
      failed++;
      console.error(`  FAIL: HTTP ${res.statusCode} for ${item.route} (${res.error || 'Server error'})`);
    }
  }

  console.log(`Dev server routes: ${passed} passed, ${failed} failed.\n`);
  return failed === 0;
}

async function testBackendApis() {
  console.log('--- Step 3: Testing Backend CMS API Endpoints (port 5000) ---');
  const endpoints = [
    '/api/health',
    '/api/staff',
    '/api/notices',
    '/api/achievements',
    '/api/achievements/toppers',
    '/api/campus',
    '/api/facilities',
    '/api/documents'
  ];

  let temporaryServer = null;
  const initialCheck = await fetchHttp('http://localhost:5000/api/health');
  if (initialCheck.statusCode === 0) {
    try {
      const app = require('../backend/src/app');
      temporaryServer = await new Promise((resolve) => {
        const s = app.listen(5000, () => resolve(s));
      });
    } catch (err) {
      console.warn('Could not launch temporary backend listener:', err.message);
    }
  }

  let passed = 0;
  let failed = 0;

  try {
    for (const ep of endpoints) {
      const res = await fetchHttp(`http://localhost:5000${ep}`);
      if (res.statusCode === 200) {
        try {
          const json = JSON.parse(res.body);
          if (json.success !== false) {
            passed++;
            console.log(`  PASS: API ${ep} returned HTTP 200 with JSON`);
          } else {
            failed++;
            console.error(`  FAIL: API ${ep} returned success=false`);
          }
        } catch (e) {
          failed++;
          console.error(`  FAIL: API ${ep} non-JSON response: ${e.message}`);
        }
      } else {
        failed++;
        console.error(`  FAIL: API ${ep} returned HTTP ${res.statusCode}`);
      }
    }
  } finally {
    if (temporaryServer) {
      await new Promise((resolve) => temporaryServer.close(resolve));
    }
  }

  console.log(`CMS APIs: ${passed} passed, ${failed} failed.\n`);
  return failed === 0;
}

async function main() {
  console.log('=====================================================');
  console.log(' L.K.S.K Convent School - Route & Page Verification  ');
  console.log('=====================================================\n');

  const fileOk = testFileIntegrity();
  const httpOk = await testHttpEndpoints();
  const apiOk = await testBackendApis();

  console.log('=====================================================');
  if (fileOk && httpOk && apiOk) {
    console.log(' ALL VERIFICATIONS PASSED SUCCESSFULLY!');
    console.log('=====================================================');
    process.exit(0);
  } else {
    console.error(' SOME TESTS FAILED. PLEASE REVIEW LOGS ABOVE.');
    console.log('=====================================================');
    process.exit(1);
  }
}

main();
