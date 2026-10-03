/**
 * Mandatory Disclosures & Official Documents CMS View
 */

import { AdminAuth } from '../../adminAuth.js';
import { showToast } from '../components/toast.js';
import { showConfirmModal, showFormModal } from '../components/modal.js';
import { escapeHtml, sanitizeUrl } from '../../utils/sanitize.js';

export async function renderDocuments(container) {

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Mandatory Disclosures & Official Documents</h2>
          <p class="text-xs sm:text-sm text-slate-500">Manage CBSE affiliation certificates, fee structures, academic calendars, and compliance PDFs</p>
        </div>
        <div>
          <button id="add-doc-btn" class="inline-flex items-center px-4 py-2.5 bg-school-blue hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add Document / Disclosure
          </button>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 text-xs">
        <label class="font-semibold text-slate-600">Category:</label>
        <select id="doc-category-filter" class="px-3 py-1.5 border rounded-lg focus:outline-none">
          <option value="">All Categories</option>
          <option value="mandatory_disclosure">Mandatory Public Disclosure</option>
          <option value="cbse_affiliation">CBSE Affiliation Certificate</option>
          <option value="fee_structure">Fee Structure</option>
          <option value="academic_calendar">Academic Calendar</option>
          <option value="transfer_certificate">Transfer Certificate</option>
          <option value="other">Other Official Document</option>
        </select>
      </div>

      <!-- Documents Table -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th class="px-4 py-3">Document Title</th>
                <th class="px-4 py-3">Category</th>
                <th class="px-4 py-3">Format & Size</th>
                <th class="px-4 py-3">Publish Date</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="documents-table-body" class="divide-y divide-slate-100">
              <tr><td colspan="6" class="px-4 py-8 text-center text-slate-400">Loading documents...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  let docsList = [];

  async function loadDocuments() {
    const tbody = container.querySelector('#documents-table-body');
    const category = container.querySelector('#doc-category-filter').value;

    try {
      const query = new URLSearchParams({ all: 'true' });
      if (category) query.set('category', category);

      const res = await AdminAuth.authFetch(`/api/documents?${query.toString()}`);
      const json = await res.json();

      docsList = json.data || [];
      if (docsList.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="px-4 py-12 text-center text-slate-400">
              No documents found. Add regulatory disclosures and circular PDFs to make them available.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = docsList.map((d) => `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="px-4 py-3 font-semibold text-slate-900">
            <a href="${sanitizeUrl(d.fileUrl)}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline flex items-center gap-1.5">
              ${escapeHtml(d.title)}
              <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          </td>
          <td class="px-4 py-3">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">${escapeHtml(String(d.category || '').replace(/_/g, ' '))}</span>
          </td>
          <td class="px-4 py-3 font-mono text-slate-600">${escapeHtml(d.fileFormat || 'PDF')} ${d.fileSize ? `(${escapeHtml(d.fileSize)})` : ''}</td>
          <td class="px-4 py-3 text-slate-500">${new Date(d.publishDate).toLocaleDateString()}</td>
          <td class="px-4 py-3">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${d.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}">
              ${d.isActive ? 'Active' : 'Hidden'}
            </span>
          </td>
          <td class="px-4 py-3 text-right space-x-2">
            <button data-id="${d._id}" data-action="edit" class="text-school-blue font-semibold hover:underline">Edit</button>
            <button data-id="${d._id}" data-action="delete" class="text-rose-600 font-semibold hover:underline">Delete</button>
          </td>
        </tr>
      `).join('');

    } catch (err) {
      showToast('Error loading documents: ' + err.message, 'error');
    }
  }

  // Add Document Modal
  container.querySelector('#add-doc-btn').addEventListener('click', () => {
    showFormModal({
      title: 'Add Document or Disclosure',
      submitText: 'Save Document',
      formHtml: `
        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Document Title *</label>
            <input type="text" name="title" placeholder="e.g. Annual Fee Structure 2026-27" required class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Category *</label>
              <select name="category" required class="w-full px-3 py-2 border rounded-lg">
                <option value="mandatory_disclosure">Mandatory Public Disclosure</option>
                <option value="cbse_affiliation">CBSE Affiliation Certificate</option>
                <option value="fee_structure">Fee Structure</option>
                <option value="academic_calendar">Academic Calendar</option>
                <option value="transfer_certificate">Transfer Certificate</option>
                <option value="other">Other Official Document</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">File Format</label>
              <input type="text" name="fileFormat" value="PDF" class="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Document File URL *</label>
            <input type="url" name="fileUrl" placeholder="https://..." required class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">File Size (e.g. 1.2 MB)</label>
              <input type="text" name="fileSize" placeholder="1.2 MB" class="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Display Order</label>
              <input type="number" name="displayOrder" value="0" class="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div class="pt-2">
            <label class="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
              <input type="checkbox" name="isActive" checked class="rounded text-blue-600" />
              Publish Document Immediately
            </label>
          </div>
        </div>
      `,
      onSubmit: async (form) => {
        const payload = {
          title: form.title.value.trim(),
          category: form.category.value,
          fileFormat: form.fileFormat.value.trim() || 'PDF',
          fileUrl: form.fileUrl.value.trim(),
          fileSize: form.fileSize.value.trim(),
          displayOrder: Number(form.displayOrder.value) || 0,
          isActive: form.isActive.checked,
        };

        const res = await AdminAuth.authFetch('/api/documents', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          showToast('Document recorded successfully');
          loadDocuments();
        } else {
          showToast(json.message || 'Error saving document', 'error');
        }
      },
    });
  });

  // Table Delegation (Edit, Delete)
  container.querySelector('#documents-table-body').addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;
    const item = docsList.find((d) => d._id === id);
    if (!item) return;

    if (action === 'delete') {
      showConfirmModal({
        title: 'Delete Document',
        message: `Are you sure you want to remove "${item.title}"?`,
        confirmText: 'Delete Document',
        isDanger: true,
        onConfirm: async () => {
          const res = await AdminAuth.authFetch(`/api/documents/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showToast('Document deleted');
            loadDocuments();
          }
        },
      });
    } else if (action === 'edit') {
      showFormModal({
        title: `Edit Document: ${item.title}`,
        submitText: 'Save Changes',
        formHtml: `
          <div class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Document Title *</label>
              <input type="text" name="title" value="${item.title}" required class="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Category *</label>
              <select name="category" class="w-full px-3 py-2 border rounded-lg">
                <option value="mandatory_disclosure" ${item.category === 'mandatory_disclosure' ? 'selected' : ''}>Mandatory Public Disclosure</option>
                <option value="cbse_affiliation" ${item.category === 'cbse_affiliation' ? 'selected' : ''}>CBSE Affiliation Certificate</option>
                <option value="fee_structure" ${item.category === 'fee_structure' ? 'selected' : ''}>Fee Structure</option>
                <option value="academic_calendar" ${item.category === 'academic_calendar' ? 'selected' : ''}>Academic Calendar</option>
                <option value="transfer_certificate" ${item.category === 'transfer_certificate' ? 'selected' : ''}>Transfer Certificate</option>
                <option value="other" ${item.category === 'other' ? 'selected' : ''}>Other Official Document</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">File URL *</label>
              <input type="url" name="fileUrl" value="${item.fileUrl}" required class="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">File Size</label>
                <input type="text" name="fileSize" value="${item.fileSize || ''}" class="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Display Order</label>
                <input type="number" name="displayOrder" value="${item.displayOrder || 0}" class="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
            <div class="pt-2">
              <label class="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                <input type="checkbox" name="isActive" ${item.isActive ? 'checked' : ''} class="rounded text-blue-600" />
                Active Document
              </label>
            </div>
          </div>
        `,
        onSubmit: async (form) => {
          const res = await AdminAuth.authFetch(`/api/documents/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
              title: form.title.value.trim(),
              category: form.category.value,
              fileUrl: form.fileUrl.value.trim(),
              fileSize: form.fileSize.value.trim(),
              displayOrder: Number(form.displayOrder.value) || 0,
              isActive: form.isActive.checked,
            }),
          });
          if (res.ok) {
            showToast('Document updated successfully');
            loadDocuments();
          }
        },
      });
    }
  });

  container.querySelector('#doc-category-filter').addEventListener('change', loadDocuments);
  loadDocuments();
}
