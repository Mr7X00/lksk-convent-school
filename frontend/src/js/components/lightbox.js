/**
 * Accessible Lightbox Module
 * Displays full-resolution media with captions, keyboard navigation, and escape dismiss
 * L.K.S.K Convent School
 */

export class Lightbox {
  constructor() {
    this.lightboxEl = document.getElementById('global-lightbox');
    this.imgEl = document.getElementById('lightbox-image');
    this.captionEl = document.getElementById('lightbox-caption');
    this.closeBtn = document.getElementById('lightbox-close');
    this.prevBtn = document.getElementById('lightbox-prev');
    this.nextBtn = document.getElementById('lightbox-next');
    this.currentIndex = 0;
    this.items = [];
    this.isOpen = false;
    this.previousFocus = null;

    if (this.lightboxEl) {
      this._bindEvents();
    }
  }

  _bindEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    const backdrop = this.lightboxEl.querySelector('.lightbox-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.close());
    }

    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Delegate clicks on lightbox triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-lightbox-src]');
      if (trigger) {
        e.preventDefault();
        this._collectItems();
        const src = trigger.getAttribute('data-lightbox-src');
        const index = this.items.findIndex(item => item.src === src);
        this.open(index >= 0 ? index : 0);
      }
    });
  }

  _collectItems() {
    const elements = document.querySelectorAll('[data-lightbox-src]');
    this.items = Array.from(elements).map(el => ({
      src: el.getAttribute('data-lightbox-src'),
      caption: el.getAttribute('data-lightbox-caption') || el.getAttribute('alt') || 'L.K.S.K Convent School',
    }));
  }

  open(index = 0) {
    if (!this.lightboxEl || this.items.length === 0) return;
    this.previousFocus = document.activeElement;
    this.currentIndex = index;
    this.isOpen = true;
    this._renderCurrent();

    this.lightboxEl.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    if (this.closeBtn) {
      this.closeBtn.focus();
    }
  }

  _renderCurrent() {
    const item = this.items[this.currentIndex];
    if (!item) return;

    if (this.imgEl) {
      this.imgEl.src = item.src;
      this.imgEl.alt = item.caption;
    }
    if (this.captionEl) {
      this.captionEl.textContent = `${item.caption} (${this.currentIndex + 1} of ${this.items.length})`;
    }
  }

  next() {
    if (this.items.length <= 1) return;
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this._renderCurrent();
  }

  prev() {
    if (this.items.length <= 1) return;
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this._renderCurrent();
  }

  close() {
    if (!this.lightboxEl || !this.isOpen) return;
    this.isOpen = false;
    this.lightboxEl.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');

    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus();
    }
  }

  openWithImages(items = [], index = 0) {
    if (!this.lightboxEl || items.length === 0) return;
    this.items = items;
    this.open(index);
  }
}

let globalLightboxInstance = null;

export function initLightbox() {
  if (!globalLightboxInstance) {
    globalLightboxInstance = new Lightbox();
  }
  return globalLightboxInstance;
}

export function openLightboxWithImages(items = [], index = 0) {
  if (!globalLightboxInstance) {
    globalLightboxInstance = new Lightbox();
  }
  globalLightboxInstance.items = items;
  globalLightboxInstance.open(index);
}
