/**
 * Smooth Scroll-Reveal & Scroll Animation Effects Engine
 * Uses performant IntersectionObserver to animate sections, cards, and
 * elements into view with staggered cascades and directional transforms.
 * Also manages the real-time reading progress bar at the top of the viewport.
 */

export function initScrollReveal() {
  initScrollProgressBar();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      el.classList.add('is-revealed');
    });
    return;
  }

  // 1. Tag Section Headings for smooth fade-up
  document.querySelectorAll('section').forEach((section) => {
    if (section.id === 'hero-carousel') return;

    // Tag section intro headers (badge, h2, divider, paragraph)
    const headerBlock = section.querySelector('.text-center.max-w-xl, .text-center.max-w-2xl, .space-y-4 > h2');
    if (headerBlock && !headerBlock.classList.contains('reveal-on-scroll')) {
      headerBlock.classList.add('reveal-on-scroll');
    }

    // Tag individual cards inside grids for staggered entrance
    const grids = section.querySelectorAll('.grid');
    grids.forEach((grid) => {
      const children = Array.from(grid.children);
      children.forEach((child, index) => {
        if (!child.classList.contains('reveal-on-scroll') && !child.closest('header')) {
          child.classList.add('reveal-on-scroll');
          // Stagger card delays
          child.style.transitionDelay = `${(index % 6) * 90}ms`;
        }
      });
    });
  });

  // 2. Tag specific hero / high-impact blocks
  const customRevealTargets = [
    { selector: '#about-section .lg\\:grid-cols-2 > div:first-child', effect: 'reveal-slide-left' },
    { selector: '#about-section .lg\\:grid-cols-2 > div:last-child', effect: 'reveal-slide-right' },
    { selector: '#admissions-cta .lg\\:col-span-8', effect: 'reveal-slide-left' },
    { selector: '#admissions-cta .lg\\:col-span-4', effect: 'reveal-slide-right' },
    { selector: '#school-video-wrapper', effect: 'reveal-zoom-in' },
    { selector: '#contact-section .lg\\:col-span-5', effect: 'reveal-slide-left' },
    { selector: '#contact-section .lg\\:col-span-7', effect: 'reveal-slide-right' },
    { selector: '#stats-section', effect: 'reveal-scale-up' },
  ];

  customRevealTargets.forEach(({ selector, effect }) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add('reveal-on-scroll');
      if (effect) el.classList.add(effect);
    });
  });

  // 3. Setup IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.08,
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    // Reveal immediately if already within initial viewport
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('is-revealed');
    } else {
      revealObserver.observe(el);
    }
  });
}

/**
 * Real-time Scroll Progress Bar
 */
function initScrollProgressBar() {
  let progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress-bar';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.prepend(progressBar);
  }

  let ticking = false;
  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  }, { passive: true });

  updateScrollProgress();
}
