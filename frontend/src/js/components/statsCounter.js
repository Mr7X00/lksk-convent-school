/**
 * Statistics Count-Up Animation Module
 * IntersectionObserver triggered, smooth ease-out calculation,
 * and immediate display if prefers-reduced-motion is requested.
 * L.K.S.K Convent School
 */

export function initStatsCounter() {
  const statElements = document.querySelectorAll('[data-counter-target]');
  if (statElements.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateCount = (element) => {
    const target = parseInt(element.getAttribute('data-counter-target'), 10);
    const suffix = element.getAttribute('data-counter-suffix') || '';
    const prefix = element.getAttribute('data-counter-prefix') || '';
    const duration = 1800; // ms

    if (isNaN(target)) return;

    if (prefersReducedMotion) {
      element.textContent = `${prefix}${target}${suffix}`;
      return;
    }

    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Quartic ease-out curve for clean institutional feel
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.floor(easeOut * target);

      element.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px',
  });

  statElements.forEach((el) => observer.observe(el));
}
