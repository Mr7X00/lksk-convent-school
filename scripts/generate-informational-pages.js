/**
 * Informational Pages Generator
 * Generates all 26 required public pages under about/, academic/, and campus/
 * with complete SEO meta tags, breadcrumbs, unified header/footer,
 * loading states, and API connections.
 */

const fs = require('fs');
const path = require('path');

const frontendDir = path.resolve(__dirname, '../frontend');

function createDirIfMissing(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getBaseTemplate({ title, description, activeSection, crumbs, contentHtml, scriptModule = '' }) {
  // Navigation layout strings
  const crumbsHtml = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    if (isLast) {
      return `
        <li class="flex items-center space-x-2">
          <svg class="w-3 h-3 text-school-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <span class="font-semibold text-school-navy" aria-current="page">${c.label}</span>
        </li>
      `;
    }
    return `
      <li class="flex items-center space-x-2">
        ${i > 0 ? `
          <svg class="w-3 h-3 text-school-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        ` : ''}
        <a href="${c.href}" class="hover:text-school-navy transition-colors flex items-center font-medium">
          ${i === 0 ? `
            <svg class="w-3.5 h-3.5 mr-1 text-school-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
          ` : ''}
          <span>${c.label}</span>
        </a>
      </li>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${description} — L.K.S.K Convent School, Panditpur, Sohawal, Ayodhya (224188)" />
  <title>${title} | L.K.S.K Convent School Ayodhya</title>
  
  <link rel="icon" type="image/svg+xml" href="/assets/branding/svg%20logo.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,700&family=Inter:wght@300;400;500;600;700;800&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/src/css/style.css" />
</head>
<body class="whatsapp-doodle-bg text-school-slate-800 min-h-screen flex flex-col font-sans selection:bg-school-gold selection:text-white">

  <!-- Accessible Skip Link -->
  <a href="#main-content" class="skip-to-content">Skip to main content</a>

  <!-- Announcement Bar -->
  <aside id="announcement-bar" aria-label="Official School Announcement" class="bg-school-navy text-white text-xs py-2 px-4 border-b border-school-navy-700 relative z-40 transition-all duration-200">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-3">
      <div class="flex items-center gap-2.5 overflow-hidden">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-school-gold text-white shrink-0">
          Announcement
        </span>
        <p class="truncate text-school-slate-200 font-medium text-xs">
          Important Update — Admission OPEN for 2026–2027 | Register NOW!
        </p>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <a href="/academic/admission-inquiry/" class="underline text-school-gold-200 hover:text-white transition-colors text-xs font-semibold focus:outline-none">
          Inquire Online
        </a>
        <button id="dismiss-announcement-btn" type="button" aria-label="Dismiss announcement" class="text-school-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-school-navy-700">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </aside>



  <!-- Header -->
  <header class="site-header sticky top-0 z-30 transition-all duration-200 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20 sm:h-24">
        
        <a href="/" class="flex items-center space-x-3.5 group focus:outline-none h-full py-1" aria-label="L.K.S.K Convent School Home">
          <img src="/assets/branding/new%20logo%20transparent.png" alt="L.K.S.K Convent School Crest" class="h-16 sm:h-20 lg:h-[86px] w-auto max-h-full object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md py-0.5" />
          <div class="flex flex-col justify-center">
            <span class="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white font-serif leading-none group-hover:text-school-gold transition-colors duration-200">
              L.K.S.K Convent School
            </span>
            <span class="text-xs sm:text-sm text-school-gold font-medium tracking-wide mt-1">
              Panditpur, Sohawal, Ayodhya (U.P.)
            </span>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-1.5" aria-label="Main Navigation">
          <a href="/" class="nav-link-btn ${activeSection === 'home' ? 'is-active' : ''} px-3.5 py-2 text-sm font-semibold">
            Home
          </a>

          <!-- About Us Dropdown -->
          <div class="relative nav-dropdown-container">
            <button type="button" class="nav-dropdown-trigger nav-link-btn group inline-flex items-center px-3.5 py-2 text-sm font-medium ${activeSection === 'about' ? 'is-active' : ''} focus:outline-none" aria-expanded="false" aria-haspopup="true">
              <span>About Us</span>
              <svg class="dropdown-chevron w-4 h-4 ml-1.5 text-school-gold transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div class="nav-dropdown-menu hidden absolute top-full left-0 w-60 pt-2.5 z-50">
              <div class="dropdown-box rounded-xl p-1.5">
                <a href="/about/" class="dropdown-item block rounded-lg">School Overview</a>
                <a href="/about/manager/" class="dropdown-item block rounded-lg">Manager's Desk</a>
                <a href="/about/principal/" class="dropdown-item block rounded-lg">Principal's Message</a>
                <a href="/about/mission-vision/" class="dropdown-item block rounded-lg">Mission &amp; Vision</a>
                <a href="/about/faculty/" class="dropdown-item block rounded-lg">Faculty &amp; Staff</a>
              </div>
            </div>
          </div>

          <!-- Academic Dropdown -->
          <div class="relative nav-dropdown-container">
            <button type="button" class="nav-dropdown-trigger nav-link-btn group inline-flex items-center px-3.5 py-2 text-sm font-medium ${activeSection === 'academic' ? 'is-active' : ''} focus:outline-none" aria-expanded="false" aria-haspopup="true">
              <span>Academic</span>
              <svg class="dropdown-chevron w-4 h-4 ml-1.5 text-school-gold transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div class="nav-dropdown-menu hidden absolute top-full left-0 w-64 pt-2.5 z-50">
              <div class="dropdown-box rounded-xl p-1.5 max-h-96 overflow-y-auto">
                <a href="/academic/admission-process/" class="dropdown-item block rounded-lg">Admission Process</a>
                <a href="/academic/admission-inquiry/" class="dropdown-item block rounded-lg">Admission Inquiry</a>
                <a href="/academic/toppers/" class="dropdown-item block rounded-lg">Topper Students</a>
                <a href="/academic/achievements/" class="dropdown-item block rounded-lg">Student Achievements</a>
                <a href="/academic/co-curricular/" class="dropdown-item block rounded-lg">Co-Curricular Activities</a>
                <a href="/academic/calendar/" class="dropdown-item block rounded-lg">Academic Calendar</a>
                <a href="/academic/syllabus/" class="dropdown-item block rounded-lg">Syllabus</a>
                <a href="/academic/timetable/" class="dropdown-item block rounded-lg">Time Table</a>
                <a href="/academic/notices/" class="dropdown-item block rounded-lg">Notice Board</a>
                <a href="/academic/holidays/" class="dropdown-item block rounded-lg">Holiday List</a>
              </div>
            </div>
          </div>

          <!-- Campus Dropdown -->
          <div class="relative nav-dropdown-container">
            <button type="button" class="nav-dropdown-trigger nav-link-btn group inline-flex items-center px-3.5 py-2 text-sm font-medium ${activeSection === 'campus' ? 'is-active' : ''} focus:outline-none" aria-expanded="false" aria-haspopup="true">
              <span>Campus</span>
              <svg class="dropdown-chevron w-4 h-4 ml-1.5 text-school-gold transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div class="nav-dropdown-menu hidden absolute top-full left-0 w-64 pt-2.5 z-50">
              <div class="dropdown-box rounded-xl p-1.5 max-h-96 overflow-y-auto">
                <a href="/campus/classrooms/" class="dropdown-item block rounded-lg">Classrooms</a>
                <a href="/campus/principal-room/" class="dropdown-item block rounded-lg">Principal's Room</a>
                <a href="/campus/conference-room/" class="dropdown-item block rounded-lg">Conference Room</a>
                <a href="/campus/parking/" class="dropdown-item block rounded-lg">Parking Space</a>
                <a href="/campus/playground/" class="dropdown-item block rounded-lg">Playground</a>
                <a href="/campus/water-facility/" class="dropdown-item block rounded-lg">Water Facility</a>
                <a href="/campus/assembly/" class="dropdown-item block rounded-lg">Assembly Area</a>
                <a href="/campus/library/" class="dropdown-item block rounded-lg">School Library</a>
                <a href="/campus/computer-lab/" class="dropdown-item block rounded-lg">Computer Lab</a>
                <a href="/campus/science-lab/" class="dropdown-item block rounded-lg">Science Lab</a>
                <a href="/campus/transport/" class="dropdown-item block rounded-lg">Transport</a>
              </div>
            </div>
          </div>

          <a href="/gallery/" class="nav-link-btn ${activeSection === 'gallery' ? 'is-active' : ''} px-3.5 py-2 text-sm font-medium">Gallery</a>
          <a href="/#contact-section" class="nav-link-btn ${activeSection === 'contact' ? 'is-active' : ''} px-3.5 py-2 text-sm font-medium">Contact Us</a>
        </nav>

        <div class="flex items-center space-x-3">
          <a href="/academic/admission-inquiry/" class="hidden sm:inline-flex items-center justify-center px-4 py-2 btn-navbar-cta font-bold text-xs rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all duration-200">
            <span>Admission Inquiry</span>
            <svg class="w-3.5 h-3.5 ml-1.5 text-school-navy-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>

          <button id="mobile-menu-toggle" type="button" aria-label="Open mobile navigation menu" aria-expanded="false" class="lg:hidden p-2 rounded-lg text-slate-200 hover:text-school-gold hover:bg-white/10 transition-colors focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

      </div>
    </div>
  </header>

  <!-- Mobile Navigation Drawer -->
  <div id="mobile-nav-drawer" class="hidden fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
    <div id="mobile-drawer-backdrop" class="fixed inset-0 bg-school-navy-950/80 backdrop-blur-sm transition-opacity duration-200 opacity-0"></div>
    <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
      <div class="mobile-drawer-panel w-screen max-w-sm shadow-modal flex flex-col transform -translate-x-full transition-transform duration-200 ease-in-out border-l border-school-gold/30">
        
        <!-- Drawer Header -->
        <div class="p-4 border-b border-school-gold/20 flex items-center justify-between bg-school-navy-950">
          <div class="flex items-center space-x-2.5">
            <img src="/assets/branding/new%20logo%20transparent.png" alt="L.K.S.K Crest" class="h-9 w-auto drop-shadow" />
            <div>
              <span class="font-bold text-sm text-white font-serif tracking-wide block">L.K.S.K Convent</span>
              <span class="text-[10px] text-school-gold font-medium block">Panditpur, Sohawal</span>
            </div>
          </div>
          <button id="mobile-drawer-close" type="button" aria-label="Close navigation menu" class="p-2 rounded-xl text-slate-300 hover:text-school-gold hover:bg-white/10 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Drawer Body Navigation Links -->
        <div class="flex-1 overflow-y-auto py-3 px-3 space-y-1 bg-school-navy-900/95 text-slate-200">
          <a href="/" class="mobile-nav-link flex items-center justify-between py-2.5 px-3 rounded-xl font-medium text-xs">
            <span>Home</span>
          </a>
          
          <!-- About Submenu -->
          <div class="py-1">
            <button type="button" class="mobile-dropdown-trigger mobile-nav-link w-full flex items-center justify-between py-2.5 px-3 rounded-xl font-medium text-xs" data-target="m-about" aria-expanded="false">
              <span>About Us</span>
              <svg class="mobile-dropdown-icon w-3.5 h-3.5 text-school-gold transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div id="m-about" class="mobile-submenu-box hidden pl-3 pr-2 py-1.5 my-1 space-y-1">
              <a href="/about/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">School Overview</a>
              <a href="/about/manager/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Manager's Desk</a>
              <a href="/about/principal/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Principal's Message</a>
              <a href="/about/mission-vision/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Mission &amp; Vision</a>
              <a href="/about/faculty/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Faculty &amp; Staff</a>
            </div>
          </div>

          <!-- Academic Submenu -->
          <div class="py-1">
            <button type="button" class="mobile-dropdown-trigger mobile-nav-link w-full flex items-center justify-between py-2.5 px-3 rounded-xl font-medium text-xs" data-target="m-academic" aria-expanded="false">
              <span>Academic</span>
              <svg class="mobile-dropdown-icon w-3.5 h-3.5 text-school-gold transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div id="m-academic" class="mobile-submenu-box hidden pl-3 pr-2 py-1.5 my-1 space-y-1 max-h-56 overflow-y-auto">
              <a href="/academic/admission-process/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Admission Process</a>
              <a href="/academic/admission-inquiry/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg text-school-gold font-bold">Admission Inquiry</a>
              <a href="/academic/toppers/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Topper Students</a>
              <a href="/academic/achievements/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Student Achievements</a>
              <a href="/academic/co-curricular/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Co-Curricular Activities</a>
              <a href="/academic/calendar/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Academic Calendar</a>
              <a href="/academic/syllabus/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Syllabus</a>
              <a href="/academic/timetable/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Time Table</a>
              <a href="/academic/notices/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Notice Board</a>
              <a href="/academic/holidays/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Holiday List</a>
            </div>
          </div>

          <!-- Campus Submenu -->
          <div class="py-1">
            <button type="button" class="mobile-dropdown-trigger mobile-nav-link w-full flex items-center justify-between py-2.5 px-3 rounded-xl font-medium text-xs" data-target="m-campus" aria-expanded="false">
              <span>Campus</span>
              <svg class="mobile-dropdown-icon w-3.5 h-3.5 text-school-gold transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div id="m-campus" class="mobile-submenu-box hidden pl-3 pr-2 py-1.5 my-1 space-y-1 max-h-56 overflow-y-auto">
              <a href="/campus/classrooms/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Classrooms</a>
              <a href="/campus/principal-room/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Principal's Room</a>
              <a href="/campus/conference-room/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Conference Room</a>
              <a href="/campus/parking/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Parking Space</a>
              <a href="/campus/playground/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Playground</a>
              <a href="/campus/water-facility/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Water Facility</a>
              <a href="/campus/assembly/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Assembly Area</a>
              <a href="/campus/library/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">School Library</a>
              <a href="/campus/computer-lab/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Computer Lab</a>
              <a href="/campus/science-lab/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Science Lab</a>
              <a href="/campus/transport/" class="mobile-submenu-item block px-3 py-1.5 text-xs rounded-lg">Transport</a>
            </div>
          </div>

          <a href="/gallery/" class="mobile-nav-link flex items-center justify-between py-2.5 px-3 rounded-xl font-medium text-xs">
            <span>Gallery</span>
          </a>
          <a href="/#contact-section" class="mobile-nav-link flex items-center justify-between py-2.5 px-3 rounded-xl font-medium text-xs">
            <span>Contact Us</span>
          </a>
        </div>

        <!-- Drawer Footer Actions -->
        <div class="p-4 border-t border-school-gold/25 bg-school-navy-950/90 space-y-2">
          <a href="/academic/admission-inquiry/" class="w-full btn-navbar-cta py-2.5 rounded-xl font-bold text-xs shadow-md text-center block">
            Admission Inquiry
          </a>
          <a href="/admin/login" class="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-200 border border-school-gold/40 hover:text-school-gold hover:bg-white/5 transition-all text-center flex items-center justify-center">
            <span>Admin Portal</span>
          </a>
        </div>

      </div>
    </div>
  </div>

  <!-- Breadcrumbs -->
  <nav aria-label="Breadcrumb" class="bg-school-slate-100/90 border-b border-school-slate-200 py-2.5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ol class="flex items-center space-x-2 text-xs text-school-slate-600">
        ${crumbsHtml}
      </ol>
    </div>
  </nav>

  <!-- Page Header Sector: Unified High-Contrast Banner with Disciplined Spacing -->
  <section class="page-header-sector bg-gradient-to-r from-school-navy-950 via-[#0d1e38] to-school-navy-950 text-white border-b-2 border-school-gold/40 py-8 sm:py-10 relative overflow-hidden shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="flex flex-col items-start gap-2 max-w-4xl">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-school-gold/20 text-school-gold border border-school-gold/40">
          ${activeSection.toUpperCase()} &bull; INSTITUTIONAL PORTAL
        </span>
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-white tracking-tight">
          ${title}
        </h1>
        <div class="w-14 h-1 bg-school-gold rounded-full my-1"></div>
        <p class="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          ${description}
        </p>
      </div>
    </div>
  </section>

  <!-- Main Content Sector -->
  <main id="main-content" class="page-content-sector flex-grow w-full py-8 sm:py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      ${contentHtml}
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-school-navy-950 text-school-slate-300 pt-16 pb-8 border-t border-school-navy-800 text-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-school-navy-800">
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <img src="/assets/branding/new%20logo%20transparent.png" alt="L.K.S.K Crest" class="h-12 w-auto" />
            <div>
              <span class="block text-base font-bold text-white font-serif">L.K.S.K Convent School</span>
              <span class="block text-[11px] text-school-slate-400">Panditpur, Sohawal, Ayodhya</span>
            </div>
          </div>
          <p class="text-school-slate-400 leading-relaxed text-xs">
            Dedicated to character building, disciplined academic development, and lifelong learning for every child in Uttar Pradesh.
          </p>
          <div class="text-[11px] text-school-gold font-semibold pt-1">
            Affiliation: State &amp; National Curriculum Standard
          </div>
        </div>

        <div class="space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-white">About &amp; Academics</h4>
          <ul class="space-y-2 text-school-slate-400">
            <li><a href="/about/" class="hover:text-school-gold transition-colors">School Overview</a></li>
            <li><a href="/about/manager/" class="hover:text-school-gold transition-colors">Manager's Desk</a></li>
            <li><a href="/about/principal/" class="hover:text-school-gold transition-colors">Principal's Message</a></li>
            <li><a href="/about/mission-vision/" class="hover:text-school-gold transition-colors">Mission &amp; Vision</a></li>
            <li><a href="/about/faculty/" class="hover:text-school-gold transition-colors">Faculty &amp; Staff</a></li>
            <li><a href="/academic/calendar/" class="hover:text-school-gold transition-colors">Academic Calendar</a></li>
            <li><a href="/academic/notices/" class="hover:text-school-gold transition-colors">Notice Board</a></li>
          </ul>
        </div>

        <div class="space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-white">Campus Infrastructure</h4>
          <ul class="space-y-2 text-school-slate-400">
            <li><a href="/campus/classrooms/" class="hover:text-school-gold transition-colors">Modern Classrooms</a></li>
            <li><a href="/campus/library/" class="hover:text-school-gold transition-colors">School Central Library</a></li>
            <li><a href="/campus/science-lab/" class="hover:text-school-gold transition-colors">Science &amp; Computer Labs</a></li>
            <li><a href="/campus/playground/" class="hover:text-school-gold transition-colors">Playground &amp; Athletics</a></li>
            <li><a href="/campus/transport/" class="hover:text-school-gold transition-colors">Safe Bus Transport</a></li>
            <li><a href="/campus/water-facility/" class="hover:text-school-gold transition-colors">RO Water Facility</a></li>
            <li><a href="/campus/assembly/" class="hover:text-school-gold transition-colors">Morning Assembly Area</a></li>
          </ul>
        </div>

        <div class="space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-white">Administrative Office</h4>
          <address class="not-italic space-y-2 text-school-slate-400">
            <p>Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188</p>
            <p><strong>Phone:</strong> <a href="tel:+919452300000" class="hover:text-white">+91 94523 00000</a></p>
            <p><strong>Email:</strong> <a href="mailto:lkskconventschool@gmail.com" class="hover:text-white">lkskconventschool@gmail.com</a></p>
            <p class="pt-2 text-[11px] text-school-slate-400 border-t border-school-navy-800">
              <strong>Office Hours:</strong><br />Monday to Saturday: 8:00 AM – 2:00 PM
            </p>
          </address>
        </div>
      </div>

      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-school-slate-500 text-[11px] gap-4">
        <p>&copy; 2026 L.K.S.K Convent School. All Rights Reserved.</p>
        <p class="flex items-center space-x-1">
          <span>Designed &amp; Developed by</span>
          <span class="font-semibold text-school-gold">Lav Pandey</span>
        </p>
      </div>
    </div>
  </footer>

  <!-- Lightbox Modal -->
  <div id="global-lightbox" class="hidden fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Media Lightbox Viewer">
    <div class="lightbox-backdrop fixed inset-0 bg-school-navy-950/90 transition-opacity"></div>
    <div class="relative z-10 w-full h-full flex flex-col justify-between p-4 sm:p-6">
      <div class="flex items-center justify-between text-white">
        <p id="lightbox-caption" class="text-xs sm:text-sm font-medium truncate max-w-xl text-school-slate-200">Media Viewer</p>
        <button id="lightbox-close" type="button" aria-label="Close media preview" class="p-2 rounded hover:bg-white/10 text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="flex-1 flex items-center justify-center my-4 overflow-hidden">
        <img id="lightbox-image" src="" alt="Enlarged view" class="max-h-[75vh] max-w-full object-contain rounded shadow-modal" />
      </div>
      <div class="flex items-center justify-center space-x-6 text-white pb-2">
        <button id="lightbox-prev" type="button" class="inline-flex items-center px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold">Previous</button>
        <button id="lightbox-next" type="button" class="inline-flex items-center px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold">Next</button>
      </div>
    </div>
  </div>

  <!-- Back to Top & WhatsApp -->
  <button id="back-to-top" type="button" aria-label="Back to top of page" class="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-school-navy text-white shadow-modal opacity-0 invisible translate-y-4 transition-all duration-200 hover:bg-school-navy-700 active:bg-school-navy-900 focus:outline-none">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
  </button>
  <div class="fixed bottom-6 left-6 z-30">
    <a id="whatsapp-floating-btn" href="https://wa.me/919452300000?text=Hello%20L.K.S.K%20Convent%20School%2C%20I%20would%20like%20to%20inquire%20about%20admissions" target="_blank" rel="noopener noreferrer" aria-label="Chat with admissions office on WhatsApp" class="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 text-white shadow-modal hover:bg-emerald-700 transition-transform duration-200 hover:scale-105">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.199.534 1.286.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.177.181-.076.355.101.173.449.741.963 1.199.662.59 1.221.774 1.394.86.173.086.274.072.375-.043s.433-.505.549-.679c.116-.174.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.434 5.177L2 22l4.97-1.303C8.423 21.522 10.153 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"></path></svg>
    </a>
  </div>

  <!-- Shared Scripts & Specific Page Module -->
  <script type="module">
    import { initHeaderNavigation } from '/src/js/components/headerNav.js';
    import { initAnnouncementBar } from '/src/js/components/announcementBar.js';
    import { initBackToTop } from '/src/js/components/backToTop.js';
    import { initFloatingActions } from '/src/js/components/floatingActions.js';
    import { initLightbox } from '/src/js/components/lightbox.js';

    document.addEventListener('DOMContentLoaded', () => {
      initHeaderNavigation();
      initAnnouncementBar();
      initBackToTop();
      initFloatingActions();
      initLightbox();
    });
  </script>
  ${scriptModule}
</body>
</html>`;
}

// ==========================================
// 1. ABOUT PAGES DEFINITIONS
// ==========================================
const aboutPages = [
  {
    path: 'about/index.html',
    title: 'About Our Institution',
    description: 'School overview, institutional history since 2017, location in Panditpur, Sohawal, Ayodhya, and scholastic philosophy.',
    activeSection: 'about',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about/' }],
    contentHtml: `
      <div class="space-y-12">
        <div class="border-b border-school-slate-200 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Institutional Profile</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">About L.K.S.K Convent School</h1>
          <div class="academic-divider mt-2"></div>
          <p class="text-sm sm:text-base text-school-slate-600 mt-3 max-w-3xl leading-relaxed">
            Established in 2017 at Panditpur, Sohawal, Ayodhya (Uttar Pradesh — 224188), L.K.S.K Convent School was founded to deliver disciplined, holistic, and value-grounded education to students across the region.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div class="lg:col-span-8 space-y-6">
            <div class="academic-card p-6 sm:p-8 space-y-4">
              <h2 class="text-xl font-bold font-serif text-school-navy">Foundational Background &amp; Philosophy</h2>
              <p class="text-xs sm:text-sm text-school-slate-700 leading-relaxed">
                The school was conceived to bridge the gap between quality academic standards and localized access in Sohawal and Ayodhya. Over nine years of continuous service, the institution has nurtured students from early pre-primary classes through senior board examinations.
              </p>
              <p class="text-xs sm:text-sm text-school-slate-700 leading-relaxed">
                Our pedagogical approach blends rigorous core subject mastery in science, mathematics, and classical languages with moral ethics, physical sports, cultural recitation, and computational literacy.
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="/about/manager/" class="academic-card p-5 block group transition-colors hover:border-school-gold">
                <span class="text-xs font-bold text-school-gold uppercase">Leadership</span>
                <h3 class="text-base font-bold text-school-navy mt-1 group-hover:text-school-blue">Manager's Desk &rarr;</h3>
                <p class="text-xs text-school-slate-500 mt-1">Read the institutional vision, motivation, and message to guardians.</p>
              </a>

              <a href="/about/principal/" class="academic-card p-5 block group transition-colors hover:border-school-gold">
                <span class="text-xs font-bold text-school-blue uppercase">Administration</span>
                <h3 class="text-base font-bold text-school-navy mt-1 group-hover:text-school-blue">Principal's Message &rarr;</h3>
                <p class="text-xs text-school-slate-500 mt-1">Explore our academic philosophy, pedagogical standards, and student mentoring.</p>
              </a>
            </div>
          </div>

          <div class="lg:col-span-4 space-y-6">
            <div class="academic-card p-6 bg-school-surface-parchment">
              <h3 class="text-sm font-bold uppercase tracking-wider text-school-navy mb-4">Fast Facts</h3>
              <ul class="space-y-3 text-xs text-school-slate-700">
                <li class="flex justify-between pb-2 border-b border-school-slate-200">
                  <span class="text-school-slate-500">Established:</span>
                  <span class="font-bold">2017</span>
                </li>
                <li class="flex justify-between pb-2 border-b border-school-slate-200">
                  <span class="text-school-slate-500">Curriculum:</span>
                  <span class="font-bold">State &amp; National Norms</span>
                </li>
                <li class="flex justify-between pb-2 border-b border-school-slate-200">
                  <span class="text-school-slate-500">Pin Code:</span>
                  <span class="font-bold">224188</span>
                </li>
                <li class="flex justify-between pb-2 border-b border-school-slate-200">
                  <span class="text-school-slate-500">District:</span>
                  <span class="font-bold">Ayodhya, Uttar Pradesh</span>
                </li>
                <li class="flex justify-between">
                  <span class="text-school-slate-500">Campus Atmosphere:</span>
                  <span class="font-bold text-emerald-700">Disciplined &amp; Safe</span>
                </li>
              </ul>
              <div class="mt-6 pt-4 border-t border-school-slate-200">
                <a href="/academic/admission-inquiry/" class="block text-center btn-academic-gold btn-academic-sm">
                  Apply for Admission
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    path: 'about/manager/index.html',
    title: "Manager's Desk",
    description: "Official message, vision, motivation, and address to parents and students from the Manager of L.K.S.K Convent School.",
    activeSection: 'about',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about/' }, { label: "Manager's Desk", href: '/about/manager/' }],
    contentHtml: `
      <div class="space-y-10">
        <div class="border-b border-school-slate-200 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Leadership &amp; Governance</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">Manager's Desk</h1>
          <div class="academic-divider mt-2"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div class="lg:col-span-4">
            <div class="academic-card p-6 text-center flex flex-col items-center">
              <div class="w-36 h-36 rounded-full overflow-hidden border-4 border-school-gold mb-4 shadow-lg shrink-0">
                <img src="/assets/branding/manager-portrait.jpg" alt="Manager of L.K.S.K Convent School" class="w-full h-full object-cover" />
              </div>
              <h2 class="text-lg font-bold font-serif text-school-navy">Office of the Manager</h2>
              <p class="text-xs font-semibold text-school-gold mt-0.5">L.K.S.K Convent School</p>
              <p class="text-xs text-school-slate-500 mt-2">Panditpur, Sohawal, Ayodhya</p>
            </div>
          </div>

          <div class="lg:col-span-8 space-y-6">
            <div class="academic-card p-6 sm:p-8 space-y-4">
              <h3 class="text-lg font-bold font-serif text-school-navy">Vision &amp; Motivation</h3>
              <p class="text-xs sm:text-sm text-school-slate-700 leading-relaxed italic border-l-4 border-school-gold pl-4 py-1">
                "An institution is built not merely with bricks and mortar, but with unwavering ethical convictions, disciplined habits, and high scholastic aspirations for every child."
              </p>
              <p class="text-xs sm:text-sm text-school-slate-700 leading-relaxed">
                When L.K.S.K Convent School was established in 2017, our primary mission was to ensure that families in Panditpur and adjacent rural zones received high-quality schooling without needing to compromise on values or travel excessively.
              </p>
              <h3 class="text-base font-bold font-serif text-school-navy pt-2">Message to Parents &amp; Guardians</h3>
              <p class="text-xs sm:text-sm text-school-slate-700 leading-relaxed">
                Parents are our co-educators. We assure you that your trust is our highest priority. Every child walking through our gates receives careful mentoring, safety oversight, and the guidance required to achieve academic distinction and responsible citizenship.
              </p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    path: 'about/principal/index.html',
    title: "Principal's Message",
    description: "Academic philosophy, motivation, and leadership message from the Principal of L.K.S.K Convent School.",
    activeSection: 'about',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about/' }, { label: "Principal's Message", href: '/about/principal/' }],
    contentHtml: `
      <div class="space-y-10">
        <div class="border-b border-school-slate-200 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Academic Leadership</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">Principal's Message</h1>
          <div class="academic-divider mt-2"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div class="lg:col-span-4">
            <div class="academic-card p-6 text-center flex flex-col items-center">
              <div class="w-36 h-36 rounded-full overflow-hidden border-4 border-school-blue mb-4 shadow-lg shrink-0">
                <img src="/assets/branding/principal-portrait.jpg" alt="Principal of L.K.S.K Convent School" class="w-full h-full object-cover" />
              </div>
              <h2 class="text-lg font-bold font-serif text-school-navy">Principal's Desk</h2>
              <p class="text-xs font-semibold text-school-blue mt-0.5">L.K.S.K Convent School</p>
              <p class="text-xs text-school-slate-500 mt-2">Academic Administration</p>
            </div>
          </div>

          <div class="lg:col-span-8 space-y-6">
            <div class="academic-card p-6 sm:p-8 space-y-4">
              <h3 class="text-lg font-bold font-serif text-school-navy">Academic Philosophy &amp; Motivation</h3>
              <p class="text-xs sm:text-sm text-school-slate-700 leading-relaxed italic border-l-4 border-school-blue pl-4 py-1">
                "Real education is teaching children how to think clearly, communicate truthfully, and act honorably in the service of their family and nation."
              </p>
              <p class="text-xs sm:text-sm text-school-slate-700 leading-relaxed">
                At L.K.S.K Convent School, we balance syllabus completion with deeper conceptual clarity. Through practical science labs, digital computer instruction, and daily reading periods in our library, students develop autonomous intellectual curiosity.
              </p>
              <h3 class="text-base font-bold font-serif text-school-navy pt-2">Commitment to Every Student</h3>
              <p class="text-xs sm:text-sm text-school-slate-700 leading-relaxed">
                Whether a student excels in mathematics, expressive literature, or physical athletics, our faculty provides tailored support to bring out their highest potential. We welcome you to experience our vibrant scholastic community.
              </p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    path: 'about/mission-vision/index.html',
    title: 'Mission & Vision',
    description: 'The guiding mission, vision, and core educational tenets of L.K.S.K Convent School, Panditpur, Sohawal, Ayodhya.',
    activeSection: 'about',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about/' }, { label: 'Mission & Vision', href: '/about/mission-vision/' }],
    contentHtml: `
      <div class="space-y-12">
        <div class="border-b border-school-slate-200 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Institutional Tenets</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">Our Mission &amp; Vision</h1>
          <div class="academic-divider mt-2"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="academic-card p-6 sm:p-8 bg-gradient-to-b from-school-surface-parchment to-white border-t-4 border-t-school-navy">
            <span class="text-xs font-bold text-school-gold uppercase tracking-wider">Statement of Purpose</span>
            <h2 class="text-xl font-bold font-serif text-school-navy mt-1 mb-4">Our Mission</h2>
            <p class="text-xs sm:text-sm text-school-slate-700 leading-relaxed">
              To deliver accessible, disciplined, and rigorous education that equips students with analytical intellect, moral integrity, physical fitness, and civic consciousness, fostering lifelong learners who contribute positively to community and country.
            </p>
          </div>

          <div class="academic-card p-6 sm:p-8 bg-gradient-to-b from-school-surface-parchment to-white border-t-4 border-t-school-gold">
            <span class="text-xs font-bold text-school-blue uppercase tracking-wider">Aspirational Future</span>
            <h2 class="text-xl font-bold font-serif text-school-navy mt-1 mb-4">Our Vision</h2>
            <p class="text-xs sm:text-sm text-school-slate-700 leading-relaxed">
              To stand as the leading benchmark of academic distinction and character development in Ayodhya district, recognized for nurturing ethical leaders, scientific thinkers, and compassionate citizens.
            </p>
          </div>
        </div>

        <div class="academic-card p-6 sm:p-8">
          <h3 class="text-lg font-bold font-serif text-school-navy mb-4">Guiding Institutional Tenets</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="p-4 rounded bg-school-surface border border-school-slate-200">
              <h4 class="text-sm font-bold text-school-navy">1. Discipline &amp; Humility</h4>
              <p class="text-xs text-school-slate-600 mt-1">Punctuality, respectful dialogue, and personal responsibility forming daily conduct.</p>
            </div>
            <div class="p-4 rounded bg-school-surface border border-school-slate-200">
              <h4 class="text-sm font-bold text-school-navy">2. Intellectual Inquiry</h4>
              <p class="text-xs text-school-slate-600 mt-1">Encouraging questioning, practical experiments in science, and critical thought.</p>
            </div>
            <div class="p-4 rounded bg-school-surface border border-school-slate-200">
              <h4 class="text-sm font-bold text-school-navy">3. Community Service</h4>
              <p class="text-xs text-school-slate-600 mt-1">Cultivating respect for Indian heritage, environmental stewardship, and social service.</p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    path: 'about/faculty/index.html',
    title: 'Faculty & Teaching Staff',
    description: 'Directory of experienced educators, department heads, and subject specialists at L.K.S.K Convent School.',
    activeSection: 'about',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about/' }, { label: 'Faculty & Staff', href: '/about/faculty/' }],
    contentHtml: `
      <div class="space-y-8">
        <div class="border-b border-school-slate-200 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Our Educators</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">Faculty &amp; Academic Staff</h1>
          <div class="academic-divider mt-2"></div>
          <p class="text-xs sm:text-sm text-school-slate-600 mt-2">
            Meet the qualified and dedicated mentors shaping student intellect and moral character across each academic wing.
          </p>
        </div>

        <!-- Department Filter Buttons -->
        <div class="flex flex-wrap gap-2 pb-2">
          <button type="button" data-dept-filter="all" class="px-3.5 py-1.5 rounded-academic text-xs font-semibold bg-school-navy text-white transition-colors">All Faculty</button>
          <button type="button" data-dept-filter="science" class="px-3.5 py-1.5 rounded-academic text-xs font-semibold bg-white text-school-slate-700 border border-school-slate-200 hover:bg-school-slate-50 transition-colors">Science &amp; STEM</button>
          <button type="button" data-dept-filter="mathematics" class="px-3.5 py-1.5 rounded-academic text-xs font-semibold bg-white text-school-slate-700 border border-school-slate-200 hover:bg-school-slate-50 transition-colors">Mathematics</button>
          <button type="button" data-dept-filter="languages" class="px-3.5 py-1.5 rounded-academic text-xs font-semibold bg-white text-school-slate-700 border border-school-slate-200 hover:bg-school-slate-50 transition-colors">Languages</button>
          <button type="button" data-dept-filter="humanities" class="px-3.5 py-1.5 rounded-academic text-xs font-semibold bg-white text-school-slate-700 border border-school-slate-200 hover:bg-school-slate-50 transition-colors">Humanities</button>
          <button type="button" data-dept-filter="sports" class="px-3.5 py-1.5 rounded-academic text-xs font-semibold bg-white text-school-slate-700 border border-school-slate-200 hover:bg-school-slate-50 transition-colors">Sports &amp; Physical Ed.</button>
          <button type="button" data-dept-filter="primary wing" class="px-3.5 py-1.5 rounded-academic text-xs font-semibold bg-white text-school-slate-700 border border-school-slate-200 hover:bg-school-slate-50 transition-colors">Primary Wing</button>
        </div>

        <!-- Faculty Grid Container -->
        <div id="faculty-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"></div>
      </div>
    `,
    scriptModule: `
      <script type="module">
        import { AboutController } from '/src/js/pages/aboutController.js';
        document.addEventListener('DOMContentLoaded', () => {
          AboutController.initFacultyPage();
        });
      </script>
    `
  }
];

// ==========================================
// 2. ACADEMIC PAGES DEFINITIONS (10 items)
// ==========================================
const academicPages = [
  {
    path: 'academic/admission-process/index.html',
    title: 'Admission Process & Guidelines',
    description: 'Official admission guidelines, eligibility criteria, document checklist, and fee instructions for Session 2026–27.',
    activeSection: 'academic',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Academic', href: '/academic/admission-process/' }, { label: 'Admission Process', href: '/academic/admission-process/' }],
    contentHtml: `
      <div class="space-y-10">
        <div class="border-b border-school-slate-200 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Session 2026–27</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">Admission Process &amp; Guidelines</h1>
          <div class="academic-divider mt-2"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-8 space-y-6">
            <div class="academic-card p-6 sm:p-8 space-y-4">
              <h2 class="text-lg font-bold font-serif text-school-navy">Step-by-Step Admission Procedure</h2>
              <ol class="space-y-4 text-xs sm:text-sm text-school-slate-700 list-decimal pl-5">
                <li><strong>Registration &amp; Inquiry:</strong> Submit the online admission inquiry or collect the school prospectus from the administrative counter at Panditpur, Sohawal.</li>
                <li><strong>Campus Visit &amp; Interaction:</strong> Parents and the applicant are invited for an informal interactive meeting and campus orientation.</li>
                <li><strong>Document Submission:</strong> Present required birth verification, previous school transfer certificates (if applicable), and medical fitness declarations.</li>
                <li><strong>Enrollment Formalities:</strong> Finalize admission confirmation and collect textbook and uniform procurement lists.</li>
              </ol>
            </div>

            <div class="academic-card p-6 sm:p-8 space-y-4">
              <h2 class="text-lg font-bold font-serif text-school-navy">Required Documents Checklist</h2>
              <ul class="space-y-2 text-xs text-school-slate-700">
                <li class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Official Municipal / Gram Panchayat Birth Certificate (Original + 2 copies)</span>
                </li>
                <li class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Transfer Certificate (TC) countersigned from previous recognized school (Class II onwards)</span>
                </li>
                <li class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Recent passport-size colored photographs of student (4 copies) and parents (2 each)</span>
                </li>
                <li class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Photocopy of Aadhaar Card (Student &amp; Parents)</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="lg:col-span-4 space-y-6">
            <div class="academic-card p-6 bg-school-surface-parchment text-center">
              <h3 class="text-sm font-bold uppercase tracking-wider text-school-navy mb-2">Ready to Apply?</h3>
              <p class="text-xs text-school-slate-600 mb-4">Complete your inquiry form online for priority counseling.</p>
              <a href="/academic/admission-inquiry/" class="block btn-academic-gold text-xs">Proceed to Online Inquiry</a>
              <p class="text-[11px] text-school-slate-500 mt-4">Questions? Call: <a href="tel:+919452300000" class="font-bold text-school-navy">+91 94523 00000</a></p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    path: 'academic/admission-inquiry/index.html',
    title: 'Online Admission Inquiry',
    description: 'Submit an online inquiry form for admissions into L.K.S.K Convent School for Academic Session 2026–27.',
    activeSection: 'academic',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Academic', href: '/academic/admission-process/' }, { label: 'Admission Inquiry', href: '/academic/admission-inquiry/' }],
    contentHtml: `
      <div class="max-w-3xl mx-auto space-y-8">
        <div class="border-b border-school-slate-200 pb-6 text-center">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Admission Session 2026–27</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">Online Admission Inquiry Form</h1>
          <div class="academic-divider mx-auto mt-2 mb-3"></div>
          <p class="text-xs sm:text-sm text-school-slate-600">Please provide preliminary student and parent information. Our admissions office will reach out directly.</p>
        </div>

        <div id="page-inquiry-response" class="hidden"></div>

        <div class="academic-card p-6 sm:p-10">
          <form id="page-admission-inquiry-form" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label for="inq-student-name" class="block text-xs font-semibold text-school-slate-700 mb-1">Student Full Name *</label>
                <input type="text" id="inq-student-name" required placeholder="Enter student's full name" class="w-full px-3 py-2 text-xs rounded border border-school-slate-300 focus:border-school-blue focus:ring-1 focus:ring-school-blue" />
              </div>
              <div>
                <label for="inq-parent-name" class="block text-xs font-semibold text-school-slate-700 mb-1">Parent / Guardian Name *</label>
                <input type="text" id="inq-parent-name" required placeholder="Parent or guardian name" class="w-full px-3 py-2 text-xs rounded border border-school-slate-300 focus:border-school-blue focus:ring-1 focus:ring-school-blue" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label for="inq-phone" class="block text-xs font-semibold text-school-slate-700 mb-1">Contact Phone Number *</label>
                <input type="tel" id="inq-phone" required placeholder="10-digit mobile number" class="w-full px-3 py-2 text-xs rounded border border-school-slate-300 focus:border-school-blue focus:ring-1 focus:ring-school-blue" />
              </div>
              <div>
                <label for="inq-email" class="block text-xs font-semibold text-school-slate-700 mb-1">Email Address</label>
                <input type="email" id="inq-email" placeholder="name@example.com" class="w-full px-3 py-2 text-xs rounded border border-school-slate-300 focus:border-school-blue focus:ring-1 focus:ring-school-blue" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label for="inq-class" class="block text-xs font-semibold text-school-slate-700 mb-1">Class Applying For *</label>
                <select id="inq-class" required class="w-full px-3 py-2 text-xs rounded border border-school-slate-300 focus:border-school-blue focus:ring-1 focus:ring-school-blue">
                  <option value="">Select Grade Level...</option>
                  <option value="Nursery">Nursery / LKG / UKG</option>
                  <option value="Primary (I-V)">Primary Wing (Class I – V)</option>
                  <option value="Middle (VI-VIII)">Middle Wing (Class VI – VIII)</option>
                  <option value="Secondary (IX-X)">Secondary Wing (Class IX – X)</option>
                  <option value="Senior Secondary (XI-XII)">Senior Secondary (Class XI – XII)</option>
                </select>
              </div>
              <div>
                <label for="inq-previous-school" class="block text-xs font-semibold text-school-slate-700 mb-1">Previous School (if any)</label>
                <input type="text" id="inq-previous-school" placeholder="Last institution attended" class="w-full px-3 py-2 text-xs rounded border border-school-slate-300 focus:border-school-blue focus:ring-1 focus:ring-school-blue" />
              </div>
            </div>

            <div>
              <label for="inq-message" class="block text-xs font-semibold text-school-slate-700 mb-1">Additional Query or Message</label>
              <textarea id="inq-message" rows="3" placeholder="Transport requirements, sibling details, or specific queries..." class="w-full px-3 py-2 text-xs rounded border border-school-slate-300 focus:border-school-blue focus:ring-1 focus:ring-school-blue"></textarea>
            </div>

            <div class="pt-3 border-t border-school-slate-100 flex items-center justify-between">
              <span class="text-[11px] text-school-slate-400">* Required fields</span>
              <button type="submit" class="btn-academic-primary btn-academic-sm">
                Submit Inquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    `,
    scriptModule: `
      <script type="module">
        import { AcademicController } from '/src/js/pages/academicController.js';
        document.addEventListener('DOMContentLoaded', () => {
          AcademicController.initAdmissionInquiryPage();
        });
      </script>
    `
  },
  {
    path: 'academic/toppers/index.html',
    title: 'Topper Students & Board Results',
    description: 'Hall of fame celebrating Class X and XII Board Examination toppers at L.K.S.K Convent School.',
    activeSection: 'academic',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Academic', href: '/academic/admission-process/' }, { label: 'Topper Students', href: '/academic/toppers/' }],
    contentHtml: `
      <div class="space-y-8">
        <div class="border-b border-school-slate-200 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Hall of Fame</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">Topper Students &amp; Board Results</h1>
          <div class="academic-divider mt-2"></div>
          <p class="text-xs sm:text-sm text-school-slate-600 mt-2">Honoring students who demonstrated exceptional academic diligence and scored high merit rankings in official board examinations.</p>
        </div>

        <div id="toppers-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </div>
    `,
    scriptModule: `
      <script type="module">
        import { AcademicController } from '/src/js/pages/academicController.js';
        document.addEventListener('DOMContentLoaded', () => {
          AcademicController.initToppersPage();
        });
      </script>
    `
  },
  {
    path: 'academic/achievements/index.html',
    title: 'Student Achievements & Distinctions',
    description: 'Awards, medals, science fair recognitions, and athletic accomplishments of students from L.K.S.K Convent School.',
    activeSection: 'academic',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Academic', href: '/academic/admission-process/' }, { label: 'Achievements', href: '/academic/achievements/' }],
    contentHtml: `
      <div class="space-y-8">
        <div class="border-b border-school-slate-200 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Institutional Honors</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">Student Achievements &amp; Distinctions</h1>
          <div class="academic-divider mt-2"></div>
        </div>

        <div id="achievements-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </div>
    `,
    scriptModule: `
      <script type="module">
        import { AcademicController } from '/src/js/pages/academicController.js';
        document.addEventListener('DOMContentLoaded', () => {
          AcademicController.initAchievementsPage();
        });
      </script>
    `
  },
  {
    path: 'academic/co-curricular/index.html',
    title: 'Co-Curricular Activities & House System',
    description: 'Explore the clubs, house competitions, arts, debate, and cultural programs at L.K.S.K Convent School.',
    activeSection: 'academic',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Academic', href: '/academic/admission-process/' }, { label: 'Co-Curricular', href: '/academic/co-curricular/' }],
    contentHtml: `
      <div class="space-y-10">
        <div class="border-b border-school-slate-200 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Holistic Development</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">Co-Curricular Activities &amp; Clubs</h1>
          <div class="academic-divider mt-2"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="academic-card p-6 space-y-3">
            <h3 class="text-base font-bold font-serif text-school-navy">House System &amp; Leadership</h3>
            <p class="text-xs text-school-slate-600 leading-relaxed">Students are assigned to four school houses to promote camaraderie, healthy competition, team spirit, and democratic leadership roles.</p>
          </div>
          <div class="academic-card p-6 space-y-3">
            <h3 class="text-base font-bold font-serif text-school-navy">Literary &amp; Debate Club</h3>
            <p class="text-xs text-school-slate-600 leading-relaxed">Weekly competitions in Hindi and English elocution, poetry recitation, essay writing, and public speaking under staff mentorship.</p>
          </div>
          <div class="academic-card p-6 space-y-3">
            <h3 class="text-base font-bold font-serif text-school-navy">Eco &amp; Science Explorers</h3>
            <p class="text-xs text-school-slate-600 leading-relaxed">Promotes botanical awareness, campus recycling, scientific model building, and environmental sustainability projects.</p>
          </div>
        </div>
      </div>
    `
  },
  {
    path: 'academic/calendar/index.html',
    title: 'Academic Calendar',
    description: 'Annual schedule of examinations, terms, holidays, and school functions for Academic Session 2026–27.',
    activeSection: 'academic',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Academic', href: '/academic/admission-process/' }, { label: 'Academic Calendar', href: '/academic/calendar/' }],
    contentHtml: `
      <div class="space-y-8">
        <div class="border-b border-school-slate-200 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Session 2026–27</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">Academic Calendar</h1>
          <div class="academic-divider mt-2"></div>
        </div>

        <div class="academic-card p-6 sm:p-8 space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-school-slate-200">
            <h2 class="text-base font-bold font-serif text-school-navy">Key Term Dates &amp; Milestone Events</h2>
            <span class="px-2.5 py-0.5 rounded text-xs font-semibold bg-school-navy text-white">Year 2026–27</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-school-surface-parchment text-school-navy font-bold border-b border-school-slate-200">
                  <th class="p-3">Event / Milestone</th>
                  <th class="p-3">Tentative Dates</th>
                  <th class="p-3">Target Grades</th>
                  <th class="p-3">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-school-slate-100 text-school-slate-700">
                <tr>
                  <td class="p-3 font-semibold">Commencement of New Academic Term</td>
                  <td class="p-3">April 05, 2026</td>
                  <td class="p-3">All Classes (Nursery–XII)</td>
                  <td class="p-3 text-emerald-700 font-semibold">Scheduled</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">Periodic Assessment I</td>
                  <td class="p-3">July 15–22, 2026</td>
                  <td class="p-3">Class I through XII</td>
                  <td class="p-3 text-school-slate-500">Upcoming</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">Mid-Term Half-Yearly Examinations</td>
                  <td class="p-3">September 20–30, 2026</td>
                  <td class="p-3">Class I through XII</td>
                  <td class="p-3 text-school-slate-500">Upcoming</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">Annual Sports &amp; Cultural Meet</td>
                  <td class="p-3">November 26–28, 2026</td>
                  <td class="p-3">All Students</td>
                  <td class="p-3 text-school-gold font-semibold">Annual Feature</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">Annual Final Examinations</td>
                  <td class="p-3">February 20–March 05, 2027</td>
                  <td class="p-3">Class I–IX &amp; XI</td>
                  <td class="p-3 text-school-slate-500">Upcoming</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  },
  {
    path: 'academic/syllabus/index.html',
    title: 'Syllabus & Curriculum Breakdown',
    description: 'Subject-wise syllabus overview and learning guidelines for Nursery through Class XII.',
    activeSection: 'academic',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Academic', href: '/academic/admission-process/' }, { label: 'Syllabus', href: '/academic/syllabus/' }],
    contentHtml: `
      <div class="space-y-8">
        <div class="border-b border-school-slate-200 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Curricular Planning</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">Syllabus &amp; Curriculum Breakdown</h1>
          <div class="academic-divider mt-2"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="academic-card p-6 space-y-3">
            <h3 class="text-base font-bold font-serif text-school-navy">Primary Wing (Class I–V)</h3>
            <p class="text-xs text-school-slate-600">English, Hindi, Mathematics, Environmental Studies (EVS), General Knowledge, and Art &amp; Craft.</p>
            <span class="block text-[11px] text-school-blue font-semibold">State &amp; National NCERT Alignment</span>
          </div>

          <div class="academic-card p-6 space-y-3">
            <h3 class="text-base font-bold font-serif text-school-navy">Middle Wing (Class VI–VIII)</h3>
            <p class="text-xs text-school-slate-600">Science (Physics, Chemistry, Biology), Mathematics, Social Sciences (History, Civics, Geography), Sanskrit, and Computers.</p>
            <span class="block text-[11px] text-school-blue font-semibold">Experimental Practical Component</span>
          </div>

          <div class="academic-card p-6 space-y-3">
            <h3 class="text-base font-bold font-serif text-school-navy">Secondary Wing (Class IX–XII)</h3>
            <p class="text-xs text-school-slate-600">Advanced Mathematics, Physics, Chemistry, Biology, Commerce, Economics, Hindi, English, and Information Technology.</p>
            <span class="block text-[11px] text-school-blue font-semibold">Rigorous Board Exam Focus</span>
          </div>
        </div>
      </div>
    `
  },
  {
    path: 'academic/timetable/index.html',
    title: 'School Time Table & Bell Schedule',
    description: 'Daily class schedule, assembly timings, and bell orders for L.K.S.K Convent School.',
    activeSection: 'academic',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Academic', href: '/academic/admission-process/' }, { label: 'Time Table', href: '/academic/timetable/' }],
    contentHtml: `
      <div class="space-y-8">
        <div class="border-b border-school-slate-200 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Daily Order</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">School Time Table &amp; Bell Schedule</h1>
          <div class="academic-divider mt-2"></div>
        </div>

        <div class="academic-card p-6 sm:p-8 space-y-4">
          <h2 class="text-base font-bold font-serif text-school-navy">Standard Daily Bell Schedule</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-school-surface-parchment text-school-navy font-bold border-b border-school-slate-200">
                  <th class="p-3">Period / Activity</th>
                  <th class="p-3">Timings</th>
                  <th class="p-3">Duration</th>
                  <th class="p-3">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-school-slate-100 text-school-slate-700">
                <tr>
                  <td class="p-3 font-semibold">Morning Assembly &amp; Attendance</td>
                  <td class="p-3">08:00 AM – 08:30 AM</td>
                  <td class="p-3">30 Mins</td>
                  <td class="p-3">Prayer, News, Moral Thought &amp; National Anthem</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">Period 1 &amp; 2</td>
                  <td class="p-3">08:30 AM – 09:50 AM</td>
                  <td class="p-3">80 Mins</td>
                  <td class="p-3">Core Academic Subjects</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">Period 3 &amp; 4</td>
                  <td class="p-3">09:50 AM – 11:10 AM</td>
                  <td class="p-3">80 Mins</td>
                  <td class="p-3">Science &amp; Mathematics Practicals</td>
                </tr>
                <tr class="bg-amber-50/50">
                  <td class="p-3 font-semibold text-school-navy">Recess &amp; Refreshment Break</td>
                  <td class="p-3 font-semibold">11:10 AM – 11:35 AM</td>
                  <td class="p-3">25 Mins</td>
                  <td class="p-3">Nutritional Break &amp; Free Recreation</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">Period 5 &amp; 6</td>
                  <td class="p-3">11:35 AM – 12:55 PM</td>
                  <td class="p-3">80 Mins</td>
                  <td class="p-3">Languages &amp; Social Studies</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">Period 7 &amp; 8 (Sports / Library / Computers)</td>
                  <td class="p-3">12:55 PM – 02:00 PM</td>
                  <td class="p-3">65 Mins</td>
                  <td class="p-3">Co-Curricular, Sports &amp; Supervised Study</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  },
  {
    path: 'academic/notices/index.html',
    title: 'Official Notice Board',
    description: 'Live administrative circulars, urgent announcements, and exam notices from L.K.S.K Convent School.',
    activeSection: 'academic',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Academic', href: '/academic/admission-process/' }, { label: 'Notice Board', href: '/academic/notices/' }],
    contentHtml: `
      <div class="space-y-8">
        <div class="border-b border-school-slate-200 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Live Updates</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">Official Notice Board</h1>
          <div class="academic-divider mt-2"></div>
        </div>

        <!-- Filter & Search Controls -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="sm:col-span-2">
            <input type="text" id="notice-search-input" placeholder="Search notices by keyword..." class="w-full px-3.5 py-2 text-xs rounded border border-school-slate-300 focus:border-school-blue focus:ring-1 focus:ring-school-blue" />
          </div>
          <div>
            <select id="notice-category-filter" class="w-full px-3.5 py-2 text-xs rounded border border-school-slate-300 focus:border-school-blue focus:ring-1 focus:ring-school-blue">
              <option value="">All Categories</option>
              <option value="Academic">Academic</option>
              <option value="Admission">Admission</option>
              <option value="Examination">Examination</option>
              <option value="Holiday">Holiday</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        <div id="notices-list-container" class="space-y-4"></div>
      </div>
    `,
    scriptModule: `
      <script type="module">
        import { AcademicController } from '/src/js/pages/academicController.js';
        document.addEventListener('DOMContentLoaded', () => {
          AcademicController.initNoticesPage();
        });
      </script>
    `
  },
  {
    path: 'academic/holidays/index.html',
    title: 'Holiday List & Gazetted Recess',
    description: 'Official schedule of seasonal vacations, festival breaks, and gazetted school holidays.',
    activeSection: 'academic',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Academic', href: '/academic/admission-process/' }, { label: 'Holiday List', href: '/academic/holidays/' }],
    contentHtml: `
      <div class="space-y-8">
        <div class="border-b border-school-slate-200 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Annual Gazette</span>
          <h1 class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">Holiday List &amp; Seasonal Recess</h1>
          <div class="academic-divider mt-2"></div>
        </div>

        <div class="academic-card p-6 sm:p-8 space-y-4">
          <h2 class="text-base font-bold font-serif text-school-navy">Approved Gazetted &amp; Festival Breaks (Session 2026–27)</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-school-surface-parchment text-school-navy font-bold border-b border-school-slate-200">
                  <th class="p-3">Occasion / Holiday</th>
                  <th class="p-3">Date</th>
                  <th class="p-3">Day</th>
                  <th class="p-3">Category</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-school-slate-100 text-school-slate-700">
                <tr>
                  <td class="p-3 font-semibold">Dr. B.R. Ambedkar Jayanti</td>
                  <td class="p-3">April 14, 2026</td>
                  <td class="p-3">Tuesday</td>
                  <td class="p-3">National Holiday</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">Summer Vacation</td>
                  <td class="p-3">May 21 – June 25, 2026</td>
                  <td class="p-3">36 Days</td>
                  <td class="p-3 font-semibold text-school-gold">Summer Recess</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">Independence Day</td>
                  <td class="p-3">August 15, 2026</td>
                  <td class="p-3">Saturday</td>
                  <td class="p-3">Celebration (Parade &amp; Flag)</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">Gandhi Jayanti</td>
                  <td class="p-3">October 02, 2026</td>
                  <td class="p-3">Friday</td>
                  <td class="p-3">National Holiday</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">Dussehra &amp; Vijayadashami Break</td>
                  <td class="p-3">October 19–21, 2026</td>
                  <td class="p-3">Mon–Wed</td>
                  <td class="p-3">Festival Break</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">Diwali &amp; Chhath Puja Recess</td>
                  <td class="p-3">November 07–12, 2026</td>
                  <td class="p-3">Sat–Thu</td>
                  <td class="p-3 font-semibold text-school-gold">Festival Recess</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">Winter Vacation</td>
                  <td class="p-3">December 31, 2026 – January 07, 2027</td>
                  <td class="p-3">8 Days</td>
                  <td class="p-3 font-semibold text-school-blue">Winter Recess</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  }
];

// ==========================================
// 3. CAMPUS PAGES DEFINITIONS (11 items)
// ==========================================
const campusSlugs = [
  'classrooms',
  'principal-room',
  'conference-room',
  'parking',
  'playground',
  'water-facility',
  'assembly',
  'library',
  'computer-lab',
  'science-lab',
  'transport',
];

const campusPages = campusSlugs.map((slug) => {
  const formattedTitle = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    path: `campus/${slug}/index.html`,
    title: `Campus Infrastructure: ${formattedTitle}`,
    description: `Detailed facilities, photograph gallery, and technical specifications for ${formattedTitle} at L.K.S.K Convent School, Ayodhya.`,
    activeSection: 'campus',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Campus', href: '/campus/classrooms/' }, { label: formattedTitle, href: `/campus/${slug}/` }],
    contentHtml: `
      <div class="space-y-12">
        <!-- Header -->
        <div class="border-b border-school-slate-200 pb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-school-gold">Campus Wing</span>
          <h1 id="campus-page-title" class="text-3xl sm:text-4xl font-bold font-serif text-school-navy mt-1">${formattedTitle}</h1>
          <div class="academic-divider mt-2 mb-3"></div>
          <p id="campus-page-desc" class="text-xs sm:text-sm text-school-slate-600 max-w-3xl leading-relaxed">
            Loading facility details...
          </p>
        </div>

        <!-- Carousel -->
        <div data-carousel class="relative overflow-hidden rounded-academic border border-school-slate-200 shadow-card bg-school-navy-950 focus:outline-none" tabindex="0">
          <div id="campus-carousel-track" class="carousel-track flex transition-transform duration-300 ease-in-out w-full"></div>
          <button type="button" class="carousel-prev absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button type="button" class="carousel-next absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

        <!-- Key Highlights -->
        <div class="space-y-4">
          <h2 class="text-xl font-bold font-serif text-school-navy">Key Highlights &amp; Specifications</h2>
          <ul id="campus-highlights-container" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5"></ul>
        </div>

        <!-- Photo Gallery -->
        <div class="space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-school-slate-200">
            <h2 class="text-xl font-bold font-serif text-school-navy">Facility Photo Gallery</h2>
            <span class="text-xs text-school-slate-500">Click photo for full lightbox</span>
          </div>
          <div id="campus-gallery-container" class="grid grid-cols-2 sm:grid-cols-4 gap-4"></div>
        </div>

        <!-- Optional Video Section -->
        <div id="campus-video-section" class="hidden space-y-4">
          <h2 class="text-xl font-bold font-serif text-school-navy">Video Demonstration</h2>
          <div class="relative overflow-hidden rounded-academic border border-school-slate-200 aspect-video max-w-3xl bg-black">
            <video class="w-full h-full object-cover" controls preload="none" playsinline></video>
          </div>
        </div>
      </div>
    `,
    scriptModule: `
      <script type="module">
        import { CampusController } from '/src/js/pages/campusController.js';
        document.addEventListener('DOMContentLoaded', () => {
          CampusController.initCampusPage('${slug}');
        });
      </script>
    `
  };
});

// ==========================================
// 4. ACCESSIBLE 404 INVALID ROUTE PAGE
// ==========================================
const notFoundPage = {
  path: '404.html',
  title: 'Page Not Found',
  description: 'The requested page could not be located on L.K.S.K Convent School portal.',
  activeSection: '',
  crumbs: [{ label: 'Home', href: '/' }, { label: '404 Error', href: '#' }],
  contentHtml: `
    <div class="max-w-md mx-auto text-center py-16 space-y-5">
      <div class="w-16 h-16 rounded-full bg-rose-50 text-rose-700 mx-auto flex items-center justify-center border border-rose-200">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      </div>
      <h1 class="text-3xl font-bold font-serif text-school-navy">404 - Page Not Found</h1>
      <p class="text-xs text-school-slate-600 leading-relaxed">
        The page you are searching for might have been moved, renamed, or is currently unavailable. Please verify the URL or navigate back to the home portal.
      </p>
      <div class="pt-2">
        <a href="/" class="btn-academic-primary btn-academic-sm">Return to School Homepage</a>
      </div>
    </div>
  `
};

// Generate all pages
const allPages = [
  ...aboutPages,
  ...academicPages,
  ...campusPages,
  notFoundPage
];

console.log(`Generating ${allPages.length} public informational pages...`);

allPages.forEach((p) => {
  const fullPath = path.join(frontendDir, p.path);
  createDirIfMissing(path.dirname(fullPath));
  const html = getBaseTemplate(p);
  fs.writeFileSync(fullPath, html, 'utf8');
  console.log(`  ✓ Generated: ${p.path}`);
});

console.log('\nAll informational pages generated successfully!');
