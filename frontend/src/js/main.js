/**
 * L.K.S.K Convent School - Public Client Main Script
 * Initializes Design System, Branded Loader, Hero Carousel,
 * Stats Counters, Video Player, Navigation, Lightbox, Modals, and Forms.
 */

import { initInitialLoader } from './components/initialLoader.js';
import { initHeroCarousel } from './components/heroCarousel.js';
import { initStatsCounter } from './components/statsCounter.js';
import { initVideoSection } from './components/videoSection.js';
import { initContactForm } from './components/contactForm.js';
import { initHomepageGallery } from './components/galleryPreview.js';
import { initHeaderNavigation } from './components/headerNav.js';
import { initAnnouncementBar } from './components/announcementBar.js';
import { initModals } from './components/modal.js';
import { initLightbox } from './components/lightbox.js';
import { initBackToTop } from './components/backToTop.js';
import { initFloatingActions } from './components/floatingActions.js';
import { initAdmissionPopup } from './components/admissionPopup.js';
import { initScrollReveal } from './components/scrollReveal.js';

function initApp() {
  // 1. Initial Branded Loader
  initInitialLoader();

  // 2. Global Navigation & Layout Controls
  initHeaderNavigation();
  initAnnouncementBar();

  // 3. Homepage Interactive Components
  initHeroCarousel();
  initStatsCounter();
  initVideoSection();
  initContactForm();
  initHomepageGallery();

  // 4. Overlays, Dialogs & Marketing Banners
  initModals();
  initLightbox();
  initBackToTop();
  initFloatingActions();
  initAdmissionPopup();

  // 5. Smooth Scroll Animations
  initScrollReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

