/**
 * Reusable Confirmation and Form Modal Dialogs
 */

export function showConfirmModal({
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  onConfirm,
}) {
  const existing = document.getElementById('admin-confirm-modal');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'admin-confirm-modal';
  backdrop.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in';

  const confirmBtnClass = isDanger
    ? 'bg-rose-600 hover:bg-rose-700 text-white'
    : 'bg-school-blue hover:bg-blue-600 text-white';

  backdrop.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all p-6">
      <div class="flex items-center gap-3.5 mb-3">
        <div class="p-2.5 rounded-full ${isDanger ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-school-blue'}">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <h3 class="text-base font-bold text-slate-900">${title}</h3>
      </div>
      <p class="text-sm text-slate-600 leading-relaxed mb-6">${message}</p>
      <div class="flex justify-end gap-3">
        <button type="button" id="modal-cancel-btn" class="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200">
          ${cancelText}
        </button>
        <button type="button" id="modal-confirm-btn" class="px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-sm ${confirmBtnClass}">
          ${confirmText}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const close = () => backdrop.remove();

  backdrop.querySelector('#modal-cancel-btn').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  backdrop.querySelector('#modal-confirm-btn').addEventListener('click', async () => {
    const confirmBtn = backdrop.querySelector('#modal-confirm-btn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Processing...';
    try {
      if (onConfirm) await onConfirm();
    } finally {
      close();
    }
  });

  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      close();
      window.removeEventListener('keydown', handleKeydown);
    }
  };
  window.addEventListener('keydown', handleKeydown);
}

export function showFormModal({
  title = 'Edit Content',
  formHtml = '',
  submitText = 'Save Changes',
  onSubmit,
}) {
  const existing = document.getElementById('admin-form-modal');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'admin-form-modal';
  backdrop.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto';

  backdrop.innerHTML = `
    <div class="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
      <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h3 class="text-base font-bold text-slate-900">${title}</h3>
        <button type="button" id="modal-close-btn" class="text-slate-400 hover:text-slate-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <form id="modal-form-element" class="p-6 space-y-4">
        ${formHtml}
        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" id="modal-form-cancel" class="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200">
            Cancel
          </button>
          <button type="submit" id="modal-form-submit" class="px-4 py-2 text-xs font-semibold text-white bg-school-blue hover:bg-blue-600 rounded-lg transition-colors shadow-sm">
            ${submitText}
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(backdrop);

  const close = () => backdrop.remove();

  backdrop.querySelector('#modal-close-btn').addEventListener('click', close);
  backdrop.querySelector('#modal-form-cancel').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  const form = backdrop.querySelector('#modal-form-element');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = backdrop.querySelector('#modal-form-submit');
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    try {
      if (onSubmit) await onSubmit(form);
      close();
    } catch (err) {
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      close();
      window.removeEventListener('keydown', handleKeydown);
    }
  };
  window.addEventListener('keydown', handleKeydown);
}
