/**
 * Hero Carousel Module
 * Premium responsive carousel with touch/swipe, keyboard navigation,
 * autoplay with pause-on-hover/focus, and accessible ARIA attributes
 * L.K.S.K Convent School
 */

export class HeroCarousel {
  constructor(containerId = 'hero-carousel') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.track = this.container.querySelector('.hero-track');
    this.slides = Array.from(this.container.querySelectorAll('.hero-slide'));
    this.prevBtn = this.container.querySelector('.hero-prev');
    this.nextBtn = this.container.querySelector('.hero-next');
    this.dotsContainer = this.container.querySelector('.hero-dots');
    this.progressBar = this.container.querySelector('.hero-progress');
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.autoPlayInterval = null;
    this.intervalDuration = 5500;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    if (this.totalSlides === 0) return;

    // Build accessible dot indicators
    if (this.dotsContainer) {
      this.dotsContainer.innerHTML = '';
      this.slides.forEach((slide, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `hero-dot h-2.5 rounded-full transition-all duration-300 ${
          idx === 0 ? 'w-8 bg-school-gold' : 'w-2.5 bg-white/50 hover:bg-white'
        }`;
        dot.setAttribute('aria-label', `Navigate to slide ${idx + 1} of ${this.totalSlides}`);
        dot.addEventListener('click', () => {
          this.goTo(idx);
          this.restartAutoplay();
        });
        this.dotsContainer.appendChild(dot);
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.restartAutoplay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this.restartAutoplay();
      });
    }

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prev();
        this.restartAutoplay();
      } else if (e.key === 'ArrowRight') {
        this.next();
        this.restartAutoplay();
      }
    });

    // Touch & Swipe gestures for mobile
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.stopAutoplay();
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
      this.startAutoplay();
    }, { passive: true });

    // Pause autoplay on mouse hover or focus in
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());
    this.container.addEventListener('focusin', () => this.stopAutoplay());
    this.container.addEventListener('focusout', () => this.startAutoplay());

    this.goTo(0);
    this.startAutoplay();
  }

  handleSwipe() {
    const swipeThreshold = 45;
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  goTo(index) {
    if (this.totalSlides === 0) return;
    this.currentIndex = (index + this.totalSlides) % this.totalSlides;

    if (this.track) {
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }

    // Update ARIA attributes
    this.slides.forEach((slide, idx) => {
      const isActive = idx === this.currentIndex;
      slide.setAttribute('aria-hidden', (!isActive).toString());
      if (isActive) {
        slide.removeAttribute('tabindex');
      } else {
        slide.setAttribute('tabindex', '-1');
      }
    });

    // Update Dots
    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.hero-dot');
      dots.forEach((dot, idx) => {
        if (idx === this.currentIndex) {
          dot.className = 'hero-dot h-2.5 w-8 rounded-full transition-all duration-300 bg-school-gold';
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.className = 'hero-dot h-2.5 w-2.5 rounded-full transition-all duration-300 bg-white/50 hover:bg-white';
          dot.removeAttribute('aria-current');
        }
      });
    }

    // Reset Progress Bar Animation
    if (this.progressBar) {
      this.progressBar.style.transition = 'none';
      this.progressBar.style.width = '0%';
      setTimeout(() => {
        this.progressBar.style.transition = `width ${this.intervalDuration}ms linear`;
        this.progressBar.style.width = '100%';
      }, 50);
    }
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  startAutoplay() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || this.totalSlides <= 1) return;

    if (!this.autoPlayInterval) {
      this.autoPlayInterval = setInterval(() => {
        this.next();
      }, this.intervalDuration);
    }
  }

  stopAutoplay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  restartAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}

export async function initHeroCarousel() {
  const container = document.getElementById('hero-carousel');
  if (!container) return null;

  const track = container.querySelector('.hero-track');
  if (track) {
    try {
      const res = await fetch('/api/hero');
      if (res.ok) {
        const json = await res.json();
        const slides = (json.data || []).filter((s) => s.isActive !== false);

        if (slides.length > 0) {
          track.innerHTML = slides
            .map((slide, idx) => {
              const isFirst = idx === 0;
              const title = slide.title || 'L.K.S.K Convent School';
              const subtitle = slide.subtitle || '';
              const ctaText = slide.ctaText || 'Learn More';
              const ctaLink = slide.ctaLink || '/about';
              const imageUrl = slide.imageUrl || '/assets/hero/slide-campus.jpg';
              const isModal = ctaLink === '#admission-inquiry' || ctaLink.includes('modal');

              return `
              <div class="hero-slide min-w-full relative flex items-center" aria-label="Slide ${idx + 1} of ${slides.length}: ${title}" ${!isFirst ? 'aria-hidden="true"' : ''}>
                <img src="${imageUrl}" alt="${title}" class="absolute inset-0 w-full h-full object-cover object-center" ${isFirst ? 'fetchpriority="high"' : 'loading="lazy"'} onerror="this.src='/assets/hero/slide-campus.jpg'" />
                <div class="absolute inset-0 bg-gradient-to-r from-school-navy-950/95 via-school-navy-900/80 to-transparent"></div>
                
                <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
                  <div class="max-w-2xl">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded bg-school-gold/90 text-school-navy-950 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                      <span class="w-2 h-2 rounded-full bg-school-navy-950"></span>
                      Admission Open — 2026–27
                    </div>
                    ${
                      isFirst
                        ? `<h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif text-white tracking-tight leading-tight">${title}</h1>`
                        : `<h2 class="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif text-white tracking-tight leading-tight">${title}</h2>`
                    }
                    ${subtitle ? `<p class="mt-4 text-base sm:text-lg text-school-slate-200 leading-relaxed max-w-xl">${subtitle}</p>` : ''}
                    <div class="mt-8 flex flex-wrap gap-4">
                      ${
                        isModal
                          ? `<button type="button" data-modal-target="admission-inquiry-modal" class="btn-academic-gold btn-academic-lg"><span>${ctaText}</span></button>`
                          : `<a href="${ctaLink}" class="btn-academic-gold btn-academic-lg"><span>${ctaText}</span></a>`
                      }
                      <a href="#contact-section" class="btn-academic-secondary btn-academic-lg">
                        <span>Contact School</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            `;
            })
            .join('');
        }
      }
    } catch (e) {
      console.warn('Hero carousel dynamic load failed, using fallback slides:', e);
    }
  }

  return new HeroCarousel('hero-carousel');
}
