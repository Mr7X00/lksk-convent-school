import { escapeHtml } from '../../utils/sanitize.js';

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
        <h3 class="text-base font-bold text-slate-900">${escapeHtml(title)}</h3>
      </div>
      <p class="text-sm text-slate-600 leading-relaxed mb-6">${escapeHtml(message)}</p>
      <div class="flex justify-end gap-3">
        <button type="button" id="modal-cancel-btn" class="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer">
          ${escapeHtml(cancelText)}
        </button>
        <button type="button" id="modal-confirm-btn" class="px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer ${confirmBtnClass}">
          ${escapeHtml(confirmText)}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const close = () => {
    backdrop.remove();
    window.removeEventListener('keydown', handleKeydown);
  };

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
    }
  };
  window.addEventListener('keydown', handleKeydown);
}

export function showFormModal({
  title = 'Edit Content',
  fields = null,
  formHtml = '',
  submitText = 'Save Changes',
  onSubmit,
}) {
  const existing = document.getElementById('admin-form-modal');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'admin-form-modal';
  backdrop.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in';

  // Helper to render individual field
  function renderField(f) {
    const type = f.type || 'text';
    const val = f.defaultValue !== undefined ? f.defaultValue : (f.value !== undefined ? f.value : '');
    const isFullWidth = f.colSpan === 2 || type === 'textarea' || type === 'checkbox' ||
      ['photoUrl', 'imageUrl', 'coverImageUrl', 'description', 'content', 'curriculumOverview', 'syllabusPdfUrl', 'achievement'].includes(f.name);
    const colClass = isFullWidth ? 'sm:col-span-2' : '';

    if (type === 'checkbox') {
      const isChecked = Boolean(val);
      return `
        <div class="${colClass} pt-2">
          <label class="inline-flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              name="${escapeHtml(f.name)}"
              id="field-${escapeHtml(f.name)}"
              ${isChecked ? 'checked' : ''}
              class="w-4 h-4 rounded text-school-blue focus:ring-school-blue border-slate-300 transition-colors cursor-pointer"
            />
            <span>${escapeHtml(f.label || f.name)}</span>
          </label>
        </div>
      `;
    }

    if (type === 'select') {
      const optionsHtml = (f.options || []).map((opt) => {
        const optVal = typeof opt === 'object' && opt !== null ? opt.value : opt;
        const optLabel = typeof opt === 'object' && opt !== null ? opt.label : opt;
        const isSelected = String(optVal) === String(val);
        return `<option value="${escapeHtml(String(optVal))}" ${isSelected ? 'selected' : ''}>${escapeHtml(String(optLabel))}</option>`;
      }).join('');

      return `
        <div class="${colClass}">
          <label for="field-${escapeHtml(f.name)}" class="block text-xs font-semibold text-slate-700 mb-1">
            ${escapeHtml(f.label || f.name)} ${f.required ? '<span class="text-rose-500 font-bold">*</span>' : ''}
          </label>
          <select
            name="${escapeHtml(f.name)}"
            id="field-${escapeHtml(f.name)}"
            ${f.required ? 'required' : ''}
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:ring-2 focus:ring-school-blue focus:border-school-blue focus:outline-none transition-colors"
          >
            ${optionsHtml}
          </select>
        </div>
      `;
    }

    if (type === 'textarea') {
      return `
        <div class="${colClass}">
          <label for="field-${escapeHtml(f.name)}" class="block text-xs font-semibold text-slate-700 mb-1">
            ${escapeHtml(f.label || f.name)} ${f.required ? '<span class="text-rose-500 font-bold">*</span>' : ''}
          </label>
          <textarea
            name="${escapeHtml(f.name)}"
            id="field-${escapeHtml(f.name)}"
            rows="${f.rows || 3}"
            placeholder="${escapeHtml(f.placeholder || '')}"
            ${f.required ? 'required' : ''}
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-school-blue focus:border-school-blue focus:outline-none transition-colors"
          >${escapeHtml(String(val))}</textarea>
        </div>
      `;
    }

    return `
      <div class="${colClass}">
        <label for="field-${escapeHtml(f.name)}" class="block text-xs font-semibold text-slate-700 mb-1">
          ${escapeHtml(f.label || f.name)} ${f.required ? '<span class="text-rose-500 font-bold">*</span>' : ''}
        </label>
        <input
          type="${type === 'number' ? 'number' : (type || 'text')}"
          name="${escapeHtml(f.name)}"
          id="field-${escapeHtml(f.name)}"
          value="${escapeHtml(String(val !== undefined && val !== null ? val : ''))}"
          placeholder="${escapeHtml(f.placeholder || '')}"
          ${f.step ? `step="${escapeHtml(String(f.step))}"` : (type === 'number' ? 'step="any"' : '')}
          ${f.required ? 'required' : ''}
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-school-blue focus:border-school-blue focus:outline-none transition-colors"
        />
      </div>
    `;
  }

  const contentHtml = (fields && Array.isArray(fields) && fields.length > 0)
    ? `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">${fields.map(renderField).join('')}</div>`
    : formHtml;

  backdrop.innerHTML = `
    <div class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
      <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
        <h3 class="text-base font-bold text-slate-900">${escapeHtml(title)}</h3>
        <button type="button" id="modal-close-btn" class="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer" title="Close">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <form id="modal-form-element" class="flex flex-col flex-1 overflow-hidden">
        <div class="p-6 overflow-y-auto space-y-4 max-h-[calc(92vh-130px)]">
          ${contentHtml}
        </div>
        <div class="px-6 py-3.5 border-t border-slate-100 bg-slate-50/75 flex items-center justify-end gap-3 shrink-0">
          <button type="button" id="modal-form-cancel" class="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer">
            Cancel
          </button>
          <button type="submit" id="modal-form-submit" class="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-school-blue hover:bg-blue-600 rounded-lg transition-colors shadow-sm cursor-pointer">
            ${escapeHtml(submitText)}
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(backdrop);

  const close = () => {
    backdrop.remove();
    window.removeEventListener('keydown', handleKeydown);
  };

  backdrop.querySelector('#modal-close-btn').addEventListener('click', close);
  backdrop.querySelector('#modal-form-cancel').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  const form = backdrop.querySelector('#modal-form-element');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = backdrop.querySelector('#modal-form-submit');
    submitBtn.disabled = true;
    const originalHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5"></span> Saving...';

    // If fields were configured, extract typed payload object
    let payload = null;
    if (fields && Array.isArray(fields) && fields.length > 0) {
      payload = {};
      fields.forEach((f) => {
        const el = form.elements[f.name];
        if (!el) return;
        if (f.type === 'checkbox') {
          payload[f.name] = el.checked;
        } else if (f.type === 'number') {
          payload[f.name] = el.value !== '' ? Number(el.value) : (f.defaultValue ?? 0);
        } else {
          payload[f.name] = el.value.trim();
        }
      });
    }

    try {
      if (onSubmit) {
        if (payload !== null) {
          await onSubmit(payload, form);
        } else {
          await onSubmit(form, form);
        }
      }
      close();
    } catch (err) {
      console.error('[showFormModal] Submission error:', err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
    }
  });

  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      close();
    }
  };
  window.addEventListener('keydown', handleKeydown);
}

