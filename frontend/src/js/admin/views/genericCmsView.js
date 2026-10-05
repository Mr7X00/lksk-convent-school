/**
 * Reusable Universal CMS View Factory
 * Supports Hero, Testimonials, Gallery, Campus, Facilities, Achievements, Toppers, Academic, Legal, About
 */

import { AdminAuth } from '../../adminAuth.js';
import { showToast } from '../components/toast.js';
import { showConfirmModal, showFormModal } from '../components/modal.js';
import { escapeHtml } from '../../utils/sanitize.js';

export function createGenericCmsView({
  entityName = 'Item',
  endpoint = '',
  columns = [],
  formFields = [],
  defaultSortField = 'displayOrder',
}) {
  return async function renderView(container) {
    container.innerHTML = `
      <div class="space-y-6 animate-fade-in">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">${entityName} Management</h2>
            <p class="text-xs sm:text-sm text-slate-500">Create, edit, toggle, and manage ${entityName.toLowerCase()} records</p>
          </div>
          <div>
            <button id="add-entity-btn" class="inline-flex items-center px-4 py-2.5 bg-school-blue hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Add ${entityName}
            </button>
          </div>
        </div>

        <!-- Table Container -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  ${columns.map((c) => `<th class="px-4 py-3">${c.label}</th>`).join('')}
                  <th class="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody id="cms-table-body" class="divide-y divide-slate-100">
                <tr><td colspan="${columns.length + 1}" class="px-4 py-8 text-center text-slate-400">Loading records...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    let items = [];

    async function loadData() {
      const tbody = container.querySelector('#cms-table-body');
      try {
        const res = await AdminAuth.authFetch(`${endpoint}?all=true`);
        const json = await res.json();
        items = json.data || [];

        if (items.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="${columns.length + 1}" class="px-4 py-12 text-center text-slate-400">
                No ${entityName.toLowerCase()} records currently exist. Click 'Add ${entityName}' to create one.
              </td>
            </tr>
          `;
          return;
        }

        tbody.innerHTML = items.map((item) => `
          <tr class="hover:bg-slate-50 transition-colors">
            ${columns.map((c) => {
              if (c.render) return `<td class="px-4 py-3">${c.render(item)}</td>`;
              const val = item[c.field];
              if (typeof val === 'boolean') {
                return `
                  <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${val ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}">
                      ${val ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                `;
              }
              return `<td class="px-4 py-3 text-slate-700">${val != null ? escapeHtml(String(val)) : '—'}</td>`;
            }).join('')}
            <td class="px-4 py-3 text-right space-x-2">
              <button data-id="${item._id}" data-action="edit" class="text-school-blue font-semibold hover:underline">Edit</button>
              <button data-id="${item._id}" data-action="delete" class="text-rose-600 font-semibold hover:underline">Delete</button>
            </td>
          </tr>
        `).join('');
      } catch (err) {
        showToast(`Error loading ${entityName.toLowerCase()}: ` + err.message, 'error');
      }
    }

    function renderFormField(field, value = '') {
      const type = field.type || 'text';
      const safeVal = (type === 'checkbox') ? '' : escapeHtml(String(value ?? ''));
      if (type === 'textarea') {
        return `
          <div class="${field.colSpan === 2 ? 'col-span-2' : ''}">
            <label class="block font-semibold text-slate-700 mb-1">${escapeHtml(field.label)} ${field.required ? '<span class="text-rose-500 font-bold">*</span>' : ''}</label>
            <textarea name="${field.name}" rows="3" ${field.required ? 'required' : ''} class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-school-blue focus:border-school-blue focus:outline-none transition-colors">${safeVal}</textarea>
          </div>
        `;
      }
      if (type === 'select') {
        return `
          <div class="${field.colSpan === 2 ? 'col-span-2' : ''}">
            <label class="block font-semibold text-slate-700 mb-1">${escapeHtml(field.label)} ${field.required ? '<span class="text-rose-500 font-bold">*</span>' : ''}</label>
            <select name="${field.name}" ${field.required ? 'required' : ''} class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:ring-2 focus:ring-school-blue focus:border-school-blue focus:outline-none transition-colors">
              ${(field.options || []).map((opt) => `
                <option value="${escapeHtml(opt.value)}" ${value === opt.value ? 'selected' : ''}>${escapeHtml(opt.label)}</option>
              `).join('')}
            </select>
          </div>
        `;
      }
      if (type === 'checkbox') {
        return `
          <div class="flex items-center pt-4 ${field.colSpan === 2 ? 'col-span-2' : ''}">
            <label class="inline-flex items-center gap-2.5 font-semibold text-slate-700 cursor-pointer text-xs select-none">
              <input type="checkbox" name="${field.name}" ${value ? 'checked' : ''} class="w-4 h-4 rounded text-school-blue focus:ring-school-blue border-slate-300 transition-colors cursor-pointer" />
              <span>${escapeHtml(field.label)}</span>
            </label>
          </div>
        `;
      }
      return `
        <div class="${field.colSpan === 2 ? 'col-span-2' : ''}">
          <label class="block font-semibold text-slate-700 mb-1">${escapeHtml(field.label)} ${field.required ? '<span class="text-rose-500 font-bold">*</span>' : ''}</label>
          <input type="${type}" name="${field.name}" value="${safeVal}" ${field.required ? 'required' : ''} class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-school-blue focus:border-school-blue focus:outline-none transition-colors" />
        </div>
      `;
    }

    // Add Modal
    container.querySelector('#add-entity-btn').addEventListener('click', () => {
      showFormModal({
        title: `Add ${entityName}`,
        submitText: `Create ${entityName}`,
        formHtml: `
          <div class="grid grid-cols-2 gap-3 text-xs">
            ${formFields.map((f) => renderFormField(f, f.defaultValue ?? '')).join('')}
          </div>
        `,
        onSubmit: async (form) => {
          const payload = {};
          formFields.forEach((f) => {
            if (f.type === 'checkbox') {
              payload[f.name] = form[f.name]?.checked || false;
            } else if (f.type === 'number') {
              payload[f.name] = Number(form[f.name]?.value) || 0;
            } else {
              payload[f.name] = form[f.name]?.value?.trim() || '';
            }
          });

          const res = await AdminAuth.authFetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(payload),
          });
          const json = await res.json();
          if (res.ok && json.success) {
            showToast(`${entityName} created successfully`);
            loadData();
          } else {
            showToast(json.message || 'Error creating record', 'error');
          }
        },
      });
    });

    // Table Actions (Edit & Delete)
    container.querySelector('#cms-table-body').addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;
      const item = items.find((i) => i._id === id);
      if (!item) return;

      if (action === 'delete') {
        showConfirmModal({
          title: `Delete ${entityName}`,
          message: `Are you sure you want to permanently delete this ${entityName.toLowerCase()}?`,
          confirmText: 'Delete Record',
          isDanger: true,
          onConfirm: async () => {
            const res = await AdminAuth.authFetch(`${endpoint}/${id}`, { method: 'DELETE' });
            if (res.ok) {
              showToast(`${entityName} deleted`);
              loadData();
            } else {
              showToast('Delete operation failed', 'error');
            }
          },
        });
      } else if (action === 'edit') {
        showFormModal({
          title: `Edit ${entityName}`,
          submitText: 'Save Changes',
          formHtml: `
            <div class="grid grid-cols-2 gap-3 text-xs">
              ${formFields.map((f) => renderFormField(f, item[f.name])).join('')}
            </div>
          `,
          onSubmit: async (form) => {
            const payload = {};
            formFields.forEach((f) => {
              if (f.type === 'checkbox') {
                payload[f.name] = form[f.name]?.checked || false;
              } else if (f.type === 'number') {
                payload[f.name] = Number(form[f.name]?.value) || 0;
              } else {
                payload[f.name] = form[f.name]?.value?.trim() || '';
              }
            });

            const res = await AdminAuth.authFetch(`${endpoint}/${id}`, {
              method: 'PUT',
              body: JSON.stringify(payload),
            });
            if (res.ok) {
              showToast(`${entityName} updated successfully`);
              loadData();
            }
          },
        });
      }
    });

    loadData();
  };
}
