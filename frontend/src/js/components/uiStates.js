/**
 * UI State Utilities
 * Generates accessible Loading Skeletons, Error, and Empty state templates
 * With shimmer wave animations and responsive layout structures.
 * L.K.S.K Convent School
 */

export const UIStates = {
  /**
   * Generates accessible shimmering card skeleton(s)
   * @param {number} count - number of cards to render
   * @param {Object} options - { dark: boolean }
   * @returns {string} HTML markup
   */
  skeletonCard(count = 1, { dark = false } = {}) {
    const cardClass = dark ? 'skeleton-card-dark' : 'skeleton-card shadow-sm';
    const shimmerClass = dark ? 'skeleton-shimmer-dark' : 'skeleton-shimmer';

    return Array.from({ length: count }).map(() => `
      <div role="status" aria-busy="true" aria-label="Loading content" class="${cardClass} p-5 space-y-4">
        <div class="h-44 sm:h-48 w-full rounded-xl ${shimmerClass}"></div>
        <div class="space-y-2.5 pt-1">
          <div class="h-3 w-1/4 rounded-md ${shimmerClass}"></div>
          <div class="h-5 w-3/4 rounded-md ${shimmerClass}"></div>
          <div class="h-3.5 w-full rounded-md ${shimmerClass}"></div>
          <div class="h-3.5 w-5/6 rounded-md ${shimmerClass}"></div>
        </div>
        <div class="flex items-center justify-between pt-2">
          <div class="h-8 w-28 rounded-lg ${shimmerClass}"></div>
          <div class="h-4 w-16 rounded-md ${shimmerClass}"></div>
        </div>
      </div>
    `).join('');
  },

  /**
   * Generates accessible shimmering notice list skeleton(s)
   * @param {number} count
   * @returns {string} HTML markup
   */
  skeletonNotice(count = 3) {
    return Array.from({ length: count }).map(() => `
      <article role="status" aria-busy="true" aria-label="Loading circular" class="academic-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-school-slate-200">
        <div class="space-y-2.5 flex-1">
          <div class="flex items-center gap-2">
            <div class="h-5 w-20 rounded-md skeleton-shimmer"></div>
            <div class="h-4 w-24 rounded-md skeleton-shimmer"></div>
          </div>
          <div class="h-5 w-3/4 rounded-md skeleton-shimmer"></div>
          <div class="h-3.5 w-5/6 rounded-md skeleton-shimmer"></div>
        </div>
        <div class="h-9 w-32 rounded-lg skeleton-shimmer shrink-0"></div>
      </article>
    `).join('');
  },

  /**
   * Generates accessible shimmering gallery album skeleton(s)
   * @param {number} count
   * @returns {string} HTML markup
   */
  skeletonGallery(count = 4) {
    return Array.from({ length: count }).map(() => `
      <div role="status" aria-busy="true" aria-label="Loading album" class="relative rounded-academic overflow-hidden border border-school-slate-200 aspect-[4/3] bg-school-slate-100 shadow-sm flex flex-col justify-end p-4">
        <div class="absolute inset-0 skeleton-shimmer"></div>
        <div class="relative z-10 space-y-2">
          <div class="h-3 w-20 rounded bg-white/40"></div>
          <div class="h-4 w-3/4 rounded bg-white/60"></div>
        </div>
      </div>
    `).join('');
  },

  /**
   * Generates accessible shimmering merit topper skeleton(s)
   * @param {number} count
   * @returns {string} HTML markup
   */
  skeletonTopper(count = 4) {
    return Array.from({ length: count }).map(() => `
      <div role="status" aria-busy="true" aria-label="Loading topper" class="academic-card p-5 text-center flex flex-col items-center space-y-3.5 border border-school-slate-200">
        <div class="w-24 h-24 rounded-full skeleton-shimmer"></div>
        <div class="h-5 w-32 rounded-md skeleton-shimmer"></div>
        <div class="h-3 w-24 rounded-md skeleton-shimmer"></div>
        <div class="h-6 w-20 rounded-full skeleton-shimmer"></div>
      </div>
    `).join('');
  },

  /**
   * Generates accessible shimmering faculty/profile skeleton(s)
   * @param {number} count
   * @returns {string} HTML markup
   */
  skeletonProfile(count = 4) {
    return Array.from({ length: count }).map(() => `
      <div role="status" aria-busy="true" aria-label="Loading faculty profile" class="academic-card p-6 flex flex-col items-center text-center space-y-3 border border-school-slate-200">
        <div class="w-28 h-28 rounded-full skeleton-shimmer"></div>
        <div class="h-5 w-36 rounded-md skeleton-shimmer pt-1"></div>
        <div class="h-3.5 w-28 rounded-md skeleton-shimmer"></div>
        <div class="h-3 w-44 rounded-md skeleton-shimmer"></div>
      </div>
    `).join('');
  },

  /**
   * Generates accessible shimmering hero banner skeleton
   * @returns {string} HTML markup
   */
  skeletonHero() {
    return `
      <div role="status" aria-busy="true" aria-label="Loading hero banner" class="relative w-full h-[460px] sm:h-[520px] bg-school-navy-950 overflow-hidden flex items-center">
        <div class="absolute inset-0 skeleton-shimmer-dark opacity-40"></div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-4">
          <div class="h-6 w-44 rounded-md skeleton-shimmer-dark"></div>
          <div class="h-12 w-3/4 max-w-xl rounded-lg skeleton-shimmer-dark"></div>
          <div class="h-4 w-2/3 max-w-lg rounded-md skeleton-shimmer-dark"></div>
          <div class="flex gap-4 pt-4">
            <div class="h-11 w-36 rounded-lg skeleton-shimmer-dark"></div>
            <div class="h-11 w-32 rounded-lg skeleton-shimmer-dark"></div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Unified accessible loading dispatcher
   * @param {string} type - 'card' | 'notice' | 'gallery' | 'topper' | 'profile' | 'hero' | 'spinner'
   * @param {Object} options - { count, dark }
   * @returns {string} HTML markup
   */
  loading(type = 'card', options = {}) {
    if (type === 'spinner') {
      return `
        <div role="status" aria-live="polite" class="flex items-center justify-center p-8 space-x-3 text-school-blue">
          <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm font-medium text-school-slate-600">Loading academic data...</span>
        </div>
      `;
    }

    if (type === 'notice') return this.skeletonNotice(options.count || 3);
    if (type === 'gallery') return this.skeletonGallery(options.count || 4);
    if (type === 'topper') return this.skeletonTopper(options.count || 4);
    if (type === 'profile') return this.skeletonProfile(options.count || 4);
    if (type === 'hero') return this.skeletonHero();

    return this.skeletonCard(options.count || 1, options);
  },

  /**
   * Generates an accessible error state component
   * @param {Object} options - { title, message, onRetryId }
   * @returns {string} HTML markup
   */
  error({ title = 'Unable to Load Content', message = 'An error occurred while loading this section. Please try again.', retryButtonId = null } = {}) {
    return `
      <div role="alert" class="p-6 bg-red-50 border border-red-200 rounded-academic text-center max-w-lg mx-auto">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-700 mx-auto flex items-center justify-center mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <h4 class="text-base font-bold text-red-900 mb-1">${title}</h4>
        <p class="text-xs text-red-700 mb-4 max-w-sm mx-auto leading-relaxed">${message}</p>
        ${retryButtonId ? `
          <button id="${retryButtonId}" type="button" class="btn-academic-secondary btn-academic-sm">
            Try Again
          </button>
        ` : ''}
      </div>
    `;
  },

  /**
   * Generates an accessible empty state component
   * @param {Object} options - { title, message, actionText, actionHref }
   * @returns {string} HTML markup
   */
  empty({ title = 'No Information Available', message = 'There are currently no items published in this section.', actionText = null, actionHref = '#' } = {}) {
    return `
      <div class="p-8 text-center bg-school-slate-50 border border-dashed border-school-slate-300 rounded-academic max-w-md mx-auto">
        <div class="w-12 h-12 rounded-full bg-school-slate-200 text-school-slate-500 mx-auto flex items-center justify-center mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h4 class="text-sm font-semibold text-school-navy mb-1">${title}</h4>
        <p class="text-xs text-school-slate-500 mb-4 max-w-xs mx-auto">${message}</p>
        ${actionText ? `
          <a href="${actionHref}" class="btn-academic-secondary btn-academic-sm">
            ${actionText}
          </a>
        ` : ''}
      </div>
    `;
  }
};
