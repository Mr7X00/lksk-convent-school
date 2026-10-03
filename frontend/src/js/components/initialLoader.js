/**
 * Branded Page Loader Module with Circle Loading Effect & 1.5s display duration
 * L.K.S.K Convent School, Ayodhya
 */

export function initInitialLoader() {
  const loader = document.getElementById('initial-loader');
  if (!loader) return;

  const dismissLoader = () => {
    loader.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      if (loader.parentNode) {
        loader.remove();
      }
    }, 500);
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    dismissLoader();
    return;
  }

  // Guaranteed 1.5s display duration, then smoothly fade out
  setTimeout(dismissLoader, 1500);
}
