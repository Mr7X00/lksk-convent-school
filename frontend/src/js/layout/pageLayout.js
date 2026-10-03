/**
 * Page Layout Generator
 * Generates unified, accessible Top Bar, Header, Navigation with Dropdowns,
 * Breadcrumbs, Mobile Drawer, Footer, and Floating Action Buttons across all pages.
 * L.K.S.K Convent School
 */

export function getHeaderHtml(activeSection = '') {
  return `
  <!-- Top Institutional Bar -->
  <div class="hidden md:block bg-school-navy-900 text-school-slate-300 text-xs py-2 border-b border-school-navy-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-1.5">
          <svg class="w-3.5 h-3.5 text-school-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>Panditpur, Sohawal, Ayodhya, UP — 224188</span>
        </div>
        <div class="flex items-center space-x-1.5">
          <svg class="w-3.5 h-3.5 text-school-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <a href="mailto:lkskconventschool@gmail.com" class="hover:text-white transition-colors">lkskconventschool@gmail.com</a>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <a href="/academic/admission-inquiry/" class="text-school-slate-300 hover:text-school-gold transition-colors font-medium">Admissions 2026–27</a>
        <span class="text-school-slate-600">|</span>
        <a href="/admin/login" class="text-school-slate-300 hover:text-school-gold transition-colors font-medium flex items-center space-x-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <span>Admin Portal</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Main Site Header -->
  <header class="site-header sticky top-0 z-30 transition-all duration-200 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        
        <!-- School Crest & Identity -->
        <a href="/" class="flex items-center space-x-3.5 group focus:outline-none" aria-label="L.K.S.K Convent School Home">
          <img src="/assets/branding/new%20logo%20transparent.png" alt="L.K.S.K Convent School Crest" class="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm" />
          <div class="flex flex-col">
            <span class="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif leading-none group-hover:text-school-gold transition-colors duration-200">
              L.K.S.K Convent School
            </span>
            <span class="text-xs text-school-gold font-medium tracking-wide mt-1">
              Panditpur, Sohawal, Ayodhya (U.P.)
            </span>
          </div>
        </a>

        <!-- Desktop Navigation Bar -->
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

          <!-- Academic Dropdown (All 10 required items) -->
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

          <!-- Campus Dropdown (All 11 required items) -->
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

          <a href="/gallery/" class="nav-link-btn ${activeSection === 'gallery' ? 'is-active' : ''} px-3.5 py-2 text-sm font-medium">
            Gallery
          </a>

          <a href="/contact/" class="nav-link-btn ${activeSection === 'contact' ? 'is-active' : ''} px-3.5 py-2 text-sm font-medium">
            Contact Us
          </a>
        </nav>


        <!-- CTA & Mobile Menu Toggle -->
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
          <a href="/about/" class="mobile-nav-link flex items-center justify-between py-2.5 px-3 rounded-xl font-medium text-xs">
            <span>About School</span>
          </a>
          <a href="/academic/admission-inquiry/" class="mobile-nav-link flex items-center justify-between py-2.5 px-3 rounded-xl font-medium text-xs text-school-gold font-bold">
            <span>Admission Inquiry</span>
          </a>
          <a href="/gallery/" class="mobile-nav-link flex items-center justify-between py-2.5 px-3 rounded-xl font-medium text-xs">
            <span>Gallery</span>
          </a>
          <a href="/contact/" class="mobile-nav-link flex items-center justify-between py-2.5 px-3 rounded-xl font-medium text-xs">
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
  `;
}

export function getBreadcrumbHtml(crumbs = []) {
  const items = [
    { label: 'Home', href: '/' },
    ...crumbs,
  ];

  return `
  <nav aria-label="Breadcrumb" class="bg-school-slate-100/90 border-b border-school-slate-200 py-2.5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ol class="flex items-center space-x-2 text-xs text-school-slate-600">
        ${items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          if (isLast) {
            return `
              <li class="flex items-center space-x-2">
                <svg class="w-3 h-3 text-school-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <span class="font-semibold text-school-navy" aria-current="page">${item.label}</span>
              </li>
            `;
          }
          return `
            <li>
              <a href="${item.href}" class="hover:text-school-navy transition-colors flex items-center font-medium">
                ${idx === 0 ? `
                  <svg class="w-3.5 h-3.5 mr-1 text-school-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                ` : ''}
                <span>${item.label}</span>
              </a>
            </li>
          `;
        }).join('')}
      </ol>
    </div>
  </nav>
  `;
}

export function getFooterHtml() {
  return `
  <footer class="bg-school-navy-950 text-school-slate-300 pt-16 pb-8 border-t border-school-navy-800 text-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-school-navy-800">
        
        <!-- Column 1: School Identity -->
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <img src="/assets/branding/new%20logo%20transparent.png" alt="L.K.S.K Convent School Crest" class="h-12 w-auto" />
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

        <!-- Column 2: Quick Links -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-white">About &amp; Academics</h4>
          <ul class="space-y-2 text-school-slate-400">
            <li><a href="/about/" class="hover:text-school-gold transition-colors">School Overview</a></li>
            <li><a href="/about/manager/" class="hover:text-school-gold transition-colors">Manager's Desk</a></li>
            <li><a href="/about/principal/" class="hover:text-school-gold transition-colors">Principal's Message</a></li>
            <li><a href="/about/mission-vision/" class="hover:text-school-gold transition-colors">Mission &amp; Vision</a></li>
            <li><a href="/about/faculty/" class="hover:text-school-gold transition-colors">Faculty &amp; Staff</a></li>
            <li><a href="/academic/calendar/" class="hover:text-school-gold transition-colors">Academic Calendar</a></li>
            <li><a href="/academic/notices/" class="hover:text-school-gold transition-colors">Official Notice Board</a></li>
          </ul>
        </div>

        <!-- Column 3: Campus Wings -->
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

        <!-- Column 4: Contact & Office Hours -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-white">Administrative Office</h4>
          <address class="not-italic space-y-2 text-school-slate-400">
            <p>Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188</p>
            <p><strong>Email:</strong> <a href="mailto:lkskconventschool@gmail.com" class="hover:text-white">lkskconventschool@gmail.com</a></p>
            <p><a href="/contact/" class="text-school-gold hover:underline">Contact &amp; Campus Map &rarr;</a></p>
            <p class="pt-2 text-[11px] text-school-slate-400 border-t border-school-navy-800">
              <strong>Office Hours:</strong><br />
              Monday to Saturday: 8:00 AM – 2:00 PM
            </p>
          </address>
        </div>

      </div>

      <!-- Bottom Bar: Copyright, Legal & Developer Credit -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-school-slate-500 text-[11px] gap-4">
        <p>&copy; 2024–2030 L.K.S.K Convent School. All Rights Reserved.</p>
        <div class="flex items-center space-x-3 text-school-slate-500">
          <a href="/legal/#privacy" class="hover:text-school-gold transition-colors">Privacy Policy</a>
          <span>&bull;</span>
          <a href="/legal/#terms" class="hover:text-school-gold transition-colors">Terms of Use</a>
          <span>&bull;</span>
          <a href="/legal/#disclaimer" class="hover:text-school-gold transition-colors">Disclaimer</a>
        </div>
        <p class="flex items-center space-x-1">
          <span>Developed by</span>
          <a href="https://www.instagram.com/lav._.pandeyy/" target="_blank" rel="noopener noreferrer" class="font-semibold text-school-gold hover:text-white hover:underline transition-colors" title="Follow Lav Pandey on Instagram">Lav Pandey</a>
        </p>
      </div>

    </div>
  </footer>

  <!-- Back to Top Button -->
  <button id="back-to-top" type="button" aria-label="Back to top of page" class="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-school-navy text-white shadow-modal opacity-0 invisible translate-y-4 transition-all duration-200 hover:bg-school-navy-700 active:bg-school-navy-900 focus:outline-none">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
    </svg>
  </button>

  <!-- WhatsApp Floating Inquiry Trigger (Configurable via CMS) -->
  <div class="fixed bottom-6 left-6 z-30 hidden">
    <a id="whatsapp-floating-btn" href="#" target="_blank" rel="noopener noreferrer" aria-label="Chat with admissions office on WhatsApp" class="relative group flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 text-white shadow-modal hover:bg-emerald-700 transition-transform duration-200 hover:scale-105 focus:outline-none">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.199.534 1.286.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.177.181-.076.355.101.173.449.741.963 1.199.662.59 1.221.774 1.394.86.173.086.274.072.375-.043s.433-.505.549-.679c.116-.174.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.434 5.177L2 22l4.97-1.303C8.423 21.522 10.153 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"></path>
      </svg>
    </a>
  </div>
  `;
}
