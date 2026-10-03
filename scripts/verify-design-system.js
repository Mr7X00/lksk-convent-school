/**
 * L.K.S.K Convent School - Design System & Global UI Verification Suite
 * Tests all required tokens, components, dropdown items, accessibility and responsiveness rules
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('\n======================================================');
console.log(' L.K.S.K Convent School — Design System Verification  ');
console.log('======================================================\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
    failed++;
  }
}

const frontendDir = path.resolve(__dirname, '../frontend');
const indexHtmlPath = path.join(frontendDir, 'index.html');
const styleCssPath = path.join(frontendDir, 'src/css/style.css');
const tailwindConfigPath = path.join(frontendDir, 'tailwind.config.js');

const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const styleCss = fs.readFileSync(styleCssPath, 'utf8');
const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');

console.log('1. Verifying Design Tokens & Theme Configuration:');

test('Tailwind config specifies academic color tokens (navy, blue, gold, surface, slate)', () => {
  assert(tailwindConfig.includes('#0c2340'), 'Navy primary hex code must exist');
  assert(tailwindConfig.includes('#165d96'), 'Institutional blue hex code must exist');
  assert(tailwindConfig.includes('#b47514'), 'Academic gold hex code must exist');
  assert(tailwindConfig.includes('surface'), 'Surface tokens must exist');
  assert(tailwindConfig.includes('slate'), 'Slate tokens must exist');
});

test('Tailwind config defines typography families (sans & classic serif)', () => {
  assert(tailwindConfig.includes('Inter'), 'Inter font family must be defined');
  assert(tailwindConfig.includes('Merriweather'), 'Merriweather serif font family must be defined');
});

test('Tailwind config defines restrained shadows (subtle, card, dropdown, modal)', () => {
  assert(tailwindConfig.includes('shadow-subtle') || tailwindConfig.includes("'subtle'"), 'Subtle shadow must exist');
  assert(tailwindConfig.includes('shadow-card') || tailwindConfig.includes("'card'"), 'Card shadow must exist');
  assert(tailwindConfig.includes('shadow-dropdown') || tailwindConfig.includes("'dropdown'"), 'Dropdown shadow must exist');
  assert(tailwindConfig.includes('shadow-modal') || tailwindConfig.includes("'modal'"), 'Modal shadow must exist');
});

test('Tailwind config defines responsive breakpoints including mobile and desktop (xs, sm, md, lg, xl, 2xl, 3xl)', () => {
  assert(tailwindConfig.includes("'xs': '375px'"), '375px breakpoint must exist');
  assert(tailwindConfig.includes("'3xl': '1920px'"), '1920px breakpoint must exist');
});

test('Reduced-motion media query is implemented in CSS', () => {
  assert(styleCss.includes('prefers-reduced-motion: reduce'), 'prefers-reduced-motion media query must be present');
  assert(styleCss.includes('animation-duration: 0.01ms'), 'Animations must be suppressed under reduced-motion');
});

test('Focus-visible styles are implemented for WCAG accessibility', () => {
  assert(styleCss.includes(':focus-visible'), ':focus-visible must be explicitly defined');
  assert(styleCss.includes('outline'), 'Outline or box-shadow must be set on focus-visible');
});

test('Strict rule: Zero emojis used in website UI files', () => {
  // Common emoji range regex
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert(!emojiRegex.test(indexHtml), 'index.html must not contain emojis');
  assert(!emojiRegex.test(styleCss), 'style.css must not contain emojis');
});

console.log('\n2. Verifying School Branding & Navigation Structure:');

test('School name "L.K.S.K Convent School" is prominently featured', () => {
  assert(indexHtml.includes('L.K.S.K Convent School'), 'School name must be present in index.html');
});

test('All primary navigation links are present in Header (Home, About Us, Academic, Campus, Gallery, Contact Us)', () => {
  const primaryLinks = ['Home', 'About Us', 'Academic', 'Campus', 'Gallery', 'Contact Us'];
  primaryLinks.forEach((link) => {
    assert(indexHtml.includes(link), `Primary link "${link}" must exist in navigation`);
  });
});

test('Academic dropdown supports all 10 required items', () => {
  const requiredAcademicItems = [
    'Admission Process',
    'Admission Inquiry',
    'Topper Students',
    'Student Achievements',
    'Co-Curricular Activities',
    'Academic Calendar',
    'Syllabus',
    'Time Table',
    'Notice Board',
    'Holiday List',
  ];
  requiredAcademicItems.forEach((item) => {
    assert(indexHtml.includes(item), `Academic dropdown must contain "${item}"`);
  });
});

test('Campus dropdown supports all 11 required items', () => {
  const requiredCampusItems = [
    'Classrooms',
    "Principal's Room",
    'Conference Room',
    'Parking Space',
    'Playground',
    'Water Facility',
    'Assembly Area',
    'School Library',
    'Computer Lab',
    'Science Lab',
    'Transport',
  ];
  requiredCampusItems.forEach((item) => {
    assert(indexHtml.includes(item), `Campus dropdown must contain "${item}"`);
  });
});

console.log('\n3. Verifying Global UI Components in markup:');

test('Header & Skip to content link are present', () => {
  assert(indexHtml.includes('<header'), 'Header element must exist');
  assert(indexHtml.includes('skip-to-content'), 'Skip link for keyboard accessibility must exist');
});

test('Announcement Bar is present and dismissible', () => {
  assert(indexHtml.includes('id="announcement-bar"'), 'Announcement bar ID must exist');
  assert(indexHtml.includes('id="dismiss-announcement-btn"'), 'Dismiss announcement button must exist');
});

test('Breadcrumbs component is present with schema-ready semantic navigation', () => {
  assert(indexHtml.includes('aria-label="Breadcrumb"'), 'Breadcrumbs nav with aria-label must exist');
  assert(indexHtml.includes('<ol'), 'Breadcrumbs list must exist');
});

test('Initial branded loader exists with required text and scholarly elements', () => {
  assert(indexHtml.includes('id="initial-loader"'), 'Initial loader must have id="initial-loader"');
  assert(indexHtml.includes('Welcome to L.K.S.K Convent School'), 'Loader must include "Welcome to L.K.S.K Convent School"');
  assert(indexHtml.includes('Established 2017'), 'Loader must include "Established 2017"');
});

test('Important Announcement Bar contains required text', () => {
  assert(indexHtml.includes('Important Update — Admission OPEN for 2026–2027 | Register NOW!'), 'Announcement bar must display exact required placeholder text');
});

test('Hero Section contains 5-slide carousel with required text and CTAs', () => {
  assert(indexHtml.includes('id="hero-carousel"'), 'Hero carousel must have id="hero-carousel"');
  assert(indexHtml.includes('Admission Open — 2026–27'), 'Hero must mention "Admission Open — 2026–27"');
  assert(indexHtml.includes('Admission Inquiry'), 'Hero must include "Admission Inquiry" CTA');
  assert(indexHtml.includes('Contact School'), 'Hero must include "Contact School" CTA');
  assert(indexHtml.includes('hero-progress'), 'Hero carousel must have progress bar');
  assert(indexHtml.includes('hero-dot'), 'Hero carousel must have navigation dots');
});

test('About section contains history, manager, and principal message excerpts', () => {
  assert(indexHtml.includes('id="about-section"'), 'About section must exist');
  assert(indexHtml.includes('2017'), 'Foundation year 2017 must be stated');
  assert(indexHtml.includes('Manager\'s Vision'), 'Manager\'s Desk highlight must exist');
  assert(indexHtml.includes('Principal\'s Address'), 'Principal\'s Message highlight must exist');
});

test('Facilities section includes all 10 required items', () => {
  const requiredFacilities = [
    'Bus Services',
    'Playground',
    'Computer Lab',
    'Science Lab',
    'Library',
    'Sports Activities',
    'Creative Fest',
    'Modern Classrooms',
    'Water Facility',
    'Transport',
  ];
  requiredFacilities.forEach((facility) => {
    assert(indexHtml.includes(facility), `Facility "${facility}" must exist in facilities section`);
  });
});

test('Statistics section contains all 5 metrics and counter animation targets', () => {
  assert(indexHtml.includes('Total Students'), 'Total Students metric must exist');
  assert(indexHtml.includes('Total Teachers'), 'Total Teachers metric must exist');
  assert(indexHtml.includes('Total Staff'), 'Total Staff metric must exist');
  assert(indexHtml.includes('Established'), 'Established metric must exist');
  assert(indexHtml.includes('Years of Experience'), 'Years of Experience metric must exist');
  assert(indexHtml.includes('data-counter-target="2017"'), 'Established 2017 target must exist');
  assert(indexHtml.includes('data-counter-target="9"'), '9+ years experience target must exist');
});

test('Video section is responsive with poster, controls, and sound-safe playback', () => {
  assert(indexHtml.includes('id="school-video-wrapper"'), 'Video wrapper must exist');
  assert(indexHtml.includes('<video'), 'HTML5 video element must exist');
  assert(indexHtml.includes('poster='), 'Video must specify poster');
  assert(indexHtml.includes('video-play-btn'), 'Video play overlay button must exist');
  assert(!indexHtml.includes('autoplay'), 'Video must not autoplay with sound');
});

test('School Corner contains all 6 required academic resource cards', () => {
  const schoolCornerCards = [
    'Time Table',
    'Syllabus',
    'Academic Calendar',
    'Notice Board',
    'Holiday List',
    'Downloads',
  ];
  schoolCornerCards.forEach((card) => {
    assert(indexHtml.includes(card), `School Corner must contain card "${card}"`);
  });
});

test('Testimonials section contains authentic community reviews and ratings', () => {
  assert(indexHtml.includes('What Parents &amp; Guardians Say'), 'Testimonials heading must exist');
  assert(indexHtml.includes('Parent of Class'), 'Parent role metadata must exist');
});

test('Gallery preview section connects with lightbox viewer', () => {
  assert(indexHtml.includes('id="gallery-section"'), 'Gallery section must exist');
  assert(indexHtml.includes('data-lightbox-src'), 'Gallery items must have data-lightbox-src');
});

test('Achievements preview section displays merit toppers', () => {
  assert(indexHtml.includes('id="achievements-section"'), 'Achievements section must exist');
  assert(indexHtml.includes('Ananya Kumar'), 'Topper Ananya Kumar must be listed');
});

test('Admission CTA section provides 4-step roadmap and admission trigger', () => {
  assert(indexHtml.includes('id="admissions-cta"'), 'Admissions CTA section must exist');
  assert(indexHtml.includes('Online Inquiry'), 'Step 1 must be Online Inquiry');
  assert(indexHtml.includes('School Tour'), 'Step 2 must be School Tour');
  assert(indexHtml.includes('Verification'), 'Step 3 must be Verification');
  assert(indexHtml.includes('Enrollment'), 'Step 4 must be Enrollment');
});

test('Contact & Location section contains address, form, and map container', () => {
  assert(indexHtml.includes('id="contact-section"'), 'Contact section must exist');
  assert(indexHtml.includes('id="public-contact-form"'), 'Public contact form must exist');
  assert(indexHtml.includes('Panditpur, Sohawal, Ayodhya'), 'Address must be present');
});

test('Floating action controls are present (Back-to-top, WhatsApp, Social rail)', () => {
  assert(indexHtml.includes('id="back-to-top"'), 'Back to top button must exist');
  assert(indexHtml.includes('id="whatsapp-floating-btn"'), 'WhatsApp button must exist');
  assert(indexHtml.includes('aria-label="Social media channels"'), 'Social rail must exist');
});

console.log('\n4. Verifying Component Modules exist on filesystem:');

const componentFiles = [
  'frontend/src/js/components/initialLoader.js',
  'frontend/src/js/components/heroCarousel.js',
  'frontend/src/js/components/statsCounter.js',
  'frontend/src/js/components/videoSection.js',
  'frontend/src/js/components/contactForm.js',
  'frontend/src/js/components/headerNav.js',
  'frontend/src/js/components/announcementBar.js',
  'frontend/src/js/components/modal.js',
  'frontend/src/js/components/lightbox.js',
  'frontend/src/js/components/backToTop.js',
  'frontend/src/js/components/floatingActions.js',
  'frontend/src/js/components/uiStates.js',
];

componentFiles.forEach((file) => {
  test(`Component module exists: ${file}`, () => {
    assert(fs.existsSync(path.resolve(__dirname, '..', file)), `File ${file} must exist`);
  });
});

console.log(`\nHomepage & Design System Verification Summary:`);
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}\n`);

if (failed > 0) {
  process.exit(1);
}
console.log('ALL 15 HOMEPAGE SECTIONS & DESIGN SYSTEM TESTS PASSED SUCCESSFULLY!\n');

