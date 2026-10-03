/**
 * Admission Open Poster Popup Component
 * Displays the official L.K.S.K Convent School Admission Open Poster
 * with interactive anchor link, Inquiry button, and smooth dismissal.
 */

export function initAdmissionPopup() {
  // Delay slightly (~1.8s) so the initial 1.5s branded loader finishes first
  setTimeout(() => {
    renderAdmissionPosterPopup();
  }, 1800);
}

export function renderAdmissionPosterPopup() {
  if (document.getElementById('admission-campaign-modal')) return;

  const previousActiveElement = document.activeElement;
  const posterImgSrc = '/assets/branding/admission-open-poster.png';
  const inquiryUrl = '/contact/#public-contact-form';

  const modal = document.createElement('aside');
  modal.id = 'admission-campaign-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'admission-modal-title');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 transition-opacity duration-300';

  modal.innerHTML = `
    <!-- Backdrop Blur Overlay -->
    <div id="admission-modal-backdrop" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"></div>

    <!-- Modal Poster Card Panel (Compact, Perfectly Fitted & Scrollbar-Free) -->
    <div id="admission-modal-panel" class="relative z-10 w-full max-w-[340px] sm:max-w-[380px] bg-white rounded-2xl shadow-2xl border-2 border-amber-400/60 overflow-hidden transform transition-all duration-300 scale-95 opacity-0 flex flex-col">
      
      <!-- Prominent Circular Close Button (X) -->
      <button
        id="admission-modal-close"
        type="button"
        aria-label="Close admission notice"
        class="absolute top-2 right-2 z-30 w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-slate-950/85 hover:bg-red-600 text-white flex items-center justify-center shadow-xl border border-white/70 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Top Header Strip -->
      <div class="bg-gradient-to-r from-school-navy-950 via-school-blue to-amber-500 py-1.5 px-3 text-center">
        <h2 id="admission-modal-title" class="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-white">
          Admission Open &bull; Academic Year 2026–2027
        </h2>
      </div>

      <!-- Clickable Poster Anchor Link (Zero scrollbars, perfectly contained) -->
      <div class="relative bg-amber-50/40 flex items-center justify-center p-2.5 overflow-hidden">
        <a
          href="${inquiryUrl}"
          id="admission-poster-anchor"
          class="relative block group cursor-pointer select-none max-h-[52vh] sm:max-h-[55vh] overflow-hidden rounded-xl shadow-xs"
          title="Click to open Contact & Admission Form"
        >
          <img
            src="${posterImgSrc}"
            alt="L.K.S.K Convent School Admission Open 2026-2027 Poster"
            class="max-h-[52vh] sm:max-h-[55vh] w-auto h-auto object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.015]"
          />
          <div class="absolute inset-0 bg-school-navy-950/0 group-hover:bg-school-navy-950/15 transition-colors pointer-events-none flex items-center justify-center">
            <span class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1.5 rounded-lg bg-school-navy-950/90 text-amber-300 text-xs font-bold shadow-xl border border-amber-300/40">
              Apply via Contact Form &rarr;
            </span>
          </div>
        </a>
      </div>

      <!-- Action Footer with Buttons -->
      <div class="p-2.5 sm:p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2">
        <!-- Inquiry for Admission Button -> Goes to Contact Page -->
        <a
          id="admission-inquiry-cta-btn"
          href="${inquiryUrl}"
          class="flex-1 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-school-navy-950 font-bold text-xs sm:text-sm shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-amber-200"
        >
          <span>Apply for Admission</span>
          <svg class="w-3.5 h-3.5 text-school-navy-950 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </a>

        <!-- WhatsApp Quick Connect -->
        <a
          href="https://wa.me/918127746334?text=Hello%20L.K.S.K%20Convent%20School%2C%20I%20would%20like%20to%20inquire%20about%20admissions"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span>WhatsApp</span>
        </a>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  const panel = modal.querySelector('#admission-modal-panel');
  const backdrop = modal.querySelector('#admission-modal-backdrop');
  const closeBtn = modal.querySelector('#admission-modal-close');

  // Trigger smooth enter transition
  requestAnimationFrame(() => {
    panel.classList.remove('scale-95', 'opacity-0');
    panel.classList.add('scale-100', 'opacity-100');
    document.body.classList.add('overflow-hidden');
  });

  function closeModal() {
    panel.classList.remove('scale-100', 'opacity-100');
    panel.classList.add('scale-95', 'opacity-0');
    backdrop.classList.add('opacity-0');
    document.body.classList.remove('overflow-hidden');

    setTimeout(() => {
      modal.remove();
      renderMinimizedBadge();
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    }, 250);
  }

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  // Keyboard navigation & trap Escape
  function handleKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleKeydown);
    }
  }

  document.addEventListener('keydown', handleKeydown);

  // Set initial focus to primary CTA & ensure body scroll is unlocked on navigation
  const primaryCta = modal.querySelector('#admission-inquiry-cta-btn');
  const posterAnchor = modal.querySelector('#admission-poster-anchor');
  const handleCtaClick = () => {
    document.body.classList.remove('overflow-hidden');
  };
  primaryCta?.addEventListener('click', handleCtaClick);
  posterAnchor?.addEventListener('click', handleCtaClick);
  if (primaryCta) primaryCta.focus();
}

export function renderMinimizedBadge() {
  if (document.getElementById('admission-minimized-badge')) return;

  const session = '2026–27';

  const badge = document.createElement('div');
  badge.id = 'admission-minimized-badge';
  badge.className = 'fixed bottom-24 left-5 sm:left-6 z-30 transition-transform duration-200 hover:scale-105';
  badge.innerHTML = `
    <button
      type="button"
      id="admission-minimized-badge-btn"
      aria-label="Open Admission Notice"
      class="inline-flex items-center space-x-2 px-3.5 py-2 rounded-full bg-school-navy text-white text-xs font-semibold shadow-modal hover:bg-school-blue transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-school-gold"
    >
      <span class="w-2 h-2 rounded-full bg-school-gold animate-pulse"></span>
      <span>Admission Open ${session}</span>
      <svg class="w-3.5 h-3.5 text-school-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
  `;

  document.body.appendChild(badge);

  badge.querySelector('#admission-minimized-badge-btn')?.addEventListener('click', () => {
    badge.remove();
    renderAdmissionPosterPopup();
  });
}
