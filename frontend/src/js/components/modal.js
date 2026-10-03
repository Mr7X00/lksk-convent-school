/**
 * Accessible Modal System
 * Supports keyboard traps, aria-modal, focus restoration, escape dismiss
 * L.K.S.K Convent School
 */

export class AccessibleModal {
  constructor(modalId) {
    this.modalEl = document.getElementById(modalId);
    this.previousActiveElement = null;
    this.closeButtons = [];
    this.isOpen = false;

    if (this.modalEl) {
      this.closeButtons = this.modalEl.querySelectorAll('[data-modal-close]');
      this.backdrop = this.modalEl.querySelector('.modal-backdrop');
      this.dialogPanel = this.modalEl.querySelector('.modal-panel');
      this._bindEvents();
    }
  }

  _bindEvents() {
    this.closeButtons.forEach((btn) => {
      btn.addEventListener('click', () => this.close());
    });

    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }

    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'Tab') {
        this._handleFocusTrap(e);
      }
    });
  }

  _handleFocusTrap(e) {
    if (!this.modalEl) return;
    const focusable = this.modalEl.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }

  open() {
    if (!this.modalEl || this.isOpen) return;
    this.previousActiveElement = document.activeElement;
    this.isOpen = true;
    this.modalEl.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    setTimeout(() => {
      if (this.backdrop) this.backdrop.classList.remove('opacity-0');
      if (this.dialogPanel) {
        this.dialogPanel.classList.remove('opacity-0', 'scale-95');
        this.dialogPanel.classList.add('opacity-100', 'scale-100');
      }
      const focusable = this.modalEl.querySelector('button, input, [href]');
      if (focusable) focusable.focus();
    }, 10);
  }

  close() {
    if (!this.modalEl || !this.isOpen) return;
    this.isOpen = false;

    if (this.backdrop) this.backdrop.classList.add('opacity-0');
    if (this.dialogPanel) {
      this.dialogPanel.classList.remove('opacity-100', 'scale-100');
      this.dialogPanel.classList.add('opacity-0', 'scale-95');
    }

    document.body.classList.remove('overflow-hidden');

    setTimeout(() => {
      this.modalEl.classList.add('hidden');
      if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
        this.previousActiveElement.focus();
      }
    }, 200);
  }
}

export function initAdmissionModalForm() {
  const form = document.getElementById('admission-inquiry-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentNameInput = form.querySelector('#inq-student-name');
    const parentNameInput = form.querySelector('#inq-parent-name');
    const phoneInput = form.querySelector('#inq-phone');
    const classInput = form.querySelector('#inq-class');
    const notesInput = form.querySelector('#inq-notes');
    const submitBtn = form.querySelector('button[type="submit"]');

    const studentName = studentNameInput?.value.trim();
    const parentName = parentNameInput?.value.trim();
    const phone = phoneInput?.value.trim();
    const gradeApplying = classInput?.value.trim();
    const message = notesInput?.value.trim() || '';

    let feedbackEl = form.querySelector('#inquiry-modal-feedback');
    if (!feedbackEl) {
      feedbackEl = document.createElement('div');
      feedbackEl.id = 'inquiry-modal-feedback';
      form.insertBefore(feedbackEl, form.firstChild);
    }

    if (!studentName || !parentName || !phone || !gradeApplying) {
      feedbackEl.className = 'text-xs p-3 rounded mb-3 bg-red-50 text-red-700 border border-red-200 block';
      feedbackEl.textContent = 'Please fill in all required fields marked with an asterisk (*).';
      return;
    }

    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Submit Inquiry';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Submitting...`;
    }

    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          parentName,
          phone,
          gradeApplying,
          message,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        form.innerHTML = `
          <div class="text-center py-6 space-y-3">
            <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h4 class="text-base font-bold text-school-navy font-serif">Inquiry Registered</h4>
            <p class="text-xs text-school-slate-600 max-w-sm mx-auto">
              Thank you, <strong>${studentName}</strong>'s admission inquiry has been received. Our admissions office will get in touch with you shortly.
            </p>
            <div class="pt-3">
              <button data-modal-close type="button" class="btn-academic-primary btn-academic-sm">
                Close Dialog
              </button>
            </div>
          </div>
        `;
        const closeBtn = form.querySelector('[data-modal-close]');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            const modalEl = document.getElementById('modal-admission-inquiry');
            if (modalEl) modalEl.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
          });
        }
      } else {
        feedbackEl.className = 'text-xs p-3 rounded mb-3 bg-red-50 text-red-700 border border-red-200 block';
        feedbackEl.textContent = json.message || 'Submission could not be completed. Please call the school office directly.';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    } catch (err) {
      feedbackEl.className = 'text-xs p-3 rounded mb-3 bg-red-50 text-red-700 border border-red-200 block';
      feedbackEl.textContent = 'Connection error. Please check your internet or call the school office.';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
}

export function initModals() {
  const triggers = document.querySelectorAll('[data-modal-target]');
  triggers.forEach((trigger) => {
    const targetId = trigger.getAttribute('data-modal-target');
    const modal = new AccessibleModal(targetId);
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      modal.open();
    });
  });

  initAdmissionModalForm();
}
