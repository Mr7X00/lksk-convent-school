/**
 * Accessible Carousel Component
 * L.K.S.K Convent School
 */

export class AccessibleCarousel {
  constructor(carouselEl) {
    this.el = carouselEl;
    if (!this.el) return;

    this.track = this.el.querySelector('.carousel-track');
    this.slides = Array.from(this.el.querySelectorAll('.carousel-slide'));
    this.prevBtn = this.el.querySelector('.carousel-prev');
    this.nextBtn = this.el.querySelector('.carousel-next');
    this.dotsContainer = this.el.querySelector('.carousel-dots');
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.autoPlayInterval = null;
    this.intervalMs = 5000;

    this._init();
  }

  _init() {
    if (this.totalSlides === 0) return;

    // Create dots if container exists
    if (this.dotsContainer) {
      this.dotsContainer.innerHTML = '';
      this.slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `w-3 h-3 rounded-full transition-all duration-200 ${idx === 0 ? 'bg-school-gold w-8' : 'bg-white/60 hover:bg-white'}`;
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.addEventListener('click', () => {
          this.goTo(idx);
          this._restartAutoPlay();
        });
        this.dotsContainer.appendChild(dot);
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this._restartAutoPlay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this._restartAutoPlay();
      });
    }

    // Keyboard controls
    this.el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prev();
        this._restartAutoPlay();
      } else if (e.key === 'ArrowRight') {
        this.next();
        this._restartAutoPlay();
      }
    });

    // Pause on hover / focus
    this.el.addEventListener('mouseenter', () => this._stopAutoPlay());
    this.el.addEventListener('mouseleave', () => this._startAutoPlay());
    this.el.addEventListener('focusin', () => this._stopAutoPlay());
    this.el.addEventListener('focusout', () => this._startAutoPlay());

    this.goTo(0);
    this._startAutoPlay();
  }

  goTo(index) {
    if (this.totalSlides === 0) return;
    this.currentIndex = (index + this.totalSlides) % this.totalSlides;

    if (this.track) {
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }

    // Update slides accessibility state
    this.slides.forEach((slide, idx) => {
      const isActive = idx === this.currentIndex;
      slide.setAttribute('aria-hidden', (!isActive).toString());
      if (isActive) {
        slide.removeAttribute('tabindex');
      } else {
        slide.setAttribute('tabindex', '-1');
      }
    });

    // Update dots
    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('button');
      dots.forEach((dot, idx) => {
        if (idx === this.currentIndex) {
          dot.className = 'w-8 h-3 rounded-full transition-all duration-200 bg-school-gold';
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.className = 'w-3 h-3 rounded-full transition-all duration-200 bg-white/60 hover:bg-white';
          dot.removeAttribute('aria-current');
        }
      });
    }
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  _startAutoPlay() {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (!this.autoPlayInterval && this.totalSlides > 1) {
      this.autoPlayInterval = setInterval(() => this.next(), this.intervalMs);
    }
  }

  _stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  _restartAutoPlay() {
    this._stopAutoPlay();
    this._startAutoPlay();
  }
}

export function initCarousels() {
  const elements = document.querySelectorAll('[data-carousel]');
  elements.forEach((el) => new AccessibleCarousel(el));
}
