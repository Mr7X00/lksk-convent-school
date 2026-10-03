/**
 * Notices & Circulars CMS Management View
 */

import { AdminAuth } from '../../adminAuth.js';
import { showToast } from '../components/toast.js';
import { showConfirmModal, showFormModal } from '../components/modal.js';

export async function renderNotices(container) {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Notices & Circulars</h2>
          <p class="text-xs sm:text-sm text-slate-500">Publish, pin, and manage official notifications and student circulars</p>
        </div>
        <div>
          <button id="add-notice-btn" class="inline-flex items-center px-4 py-2.5 bg-school-blue hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Publish New Notice
          </button>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <label class="font-semibold text-slate-600">Category:</label>
          <select id="notice-category-filter" class="px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="examination">Examination</option>
            <option value="holiday">Holiday</option>
            <option value="sports">Sports</option>
            <option value="admission">Admission</option>
          </select>
        </div>

        <div class="relative w-full sm:w-64">
          <input type="text" id="notice-search-input" placeholder="Search notices..." class="w-full pl-8 pr-3 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" />
          <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      <!-- Notices Table Container -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th class="px-4 py-3">Notice Title</th>
                <th class="px-4 py-3">Category</th>
                <th class="px-4 py-3">Publish Date</th>
                <th class="px-4 py-3">Pinned</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="notices-table-body" class="divide-y divide-slate-100">
              <tr>
                <td colspan="6" class="px-4 py-8 text-center text-slate-400">Loading notices...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  let noticesList = [];

  async function loadNotices() {
    const tbody = container.querySelector('#notices-table-body');
    const category = container.querySelector('#notice-category-filter').value;
    const search = container.querySelector('#notice-search-input').value.trim();

    try {
      const queryParams = new URLSearchParams({ all: 'true' });
      if (category) queryParams.set('category', category);
      if (search) queryParams.set('search', search);

      const res = await AdminAuth.authFetch(`/api/notices/all?${queryParams.toString()}`);
      const json = await res.json();

      if (json.success && json.data) {
        noticesList = json.data.notices || [];

        if (noticesList.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="6" class="px-4 py-12 text-center">
                <div class="max-w-xs mx-auto text-center">
                  <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path></svg>
                  </div>
                  <p class="font-semibold text-slate-700 text-sm">No notices found</p>
                  <p class="text-xs text-slate-400 mt-1">Publish a notice to make it visible on the school portal.</p>
                </div>
              </td>
            </tr>
          `;
          return;
        }

        tbody.innerHTML = noticesList.map((n) => `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">${escapeHtml(n.title)}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">${escapeHtml(n.category)}</span>
            </td>
            <td class="px-4 py-3 text-slate-500">${new Date(n.publishDate).toLocaleDateString()}</td>
            <td class="px-4 py-3">
              <button data-id="${n._id}" data-action="toggle-pin" class="text-xs font-semibold px-2 py-0.5 rounded transition-colors ${
                n.isPinned ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }">
                ${n.isPinned ? 'Pinned' : 'Regular'}
              </button>
            </td>
            <td class="px-4 py-3">
              <button data-id="${n._id}" data-action="toggle-active" class="text-xs font-semibold px-2 py-0.5 rounded transition-colors ${
                n.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
              }">
                ${n.isActive ? 'Active' : 'Draft'}
              </button>
            </td>
            <td class="px-4 py-3 text-right space-x-2">
              <button data-id="${n._id}" data-action="edit" class="text-school-blue hover:underline font-semibold">Edit</button>
              <button data-id="${n._id}" data-action="delete" class="text-rose-600 hover:underline font-semibold">Delete</button>
            </td>
          </tr>
        `).join('');
      }
    } catch (err) {
      showToast('Error loading notices: ' + err.message, 'error');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }


  // Add Notice Form
  container.querySelector('#add-notice-btn').addEventListener('click', () => {
    showFormModal({
      title: 'Publish New Notice',
      submitText: 'Publish Notice',
      formHtml: `
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Notice Title *</label>
          <input type="text" name="title" required class="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
            <select name="category" required class="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="general">General</option>
              <option value="examination">Examination</option>
              <option value="holiday">Holiday</option>
              <option value="sports">Sports</option>
              <option value="admission">Admission</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Attachment File URL (Optional)</label>
            <input type="url" name="fileUrl" placeholder="https://..." class="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Notice Content / Body *</label>
          <textarea name="content" rows="4" required class="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
        </div>
        <div class="flex items-center gap-6 pt-2">
          <label class="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
            <input type="checkbox" name="isPinned" class="rounded text-blue-600 focus:ring-blue-500" />
            Pin this notice to top of announcements
          </label>
          <label class="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
            <input type="checkbox" name="isActive" checked class="rounded text-blue-600 focus:ring-blue-500" />
            Publish immediately (Active)
          </label>
        </div>
      `,
      onSubmit: async (form) => {
        const payload = {
          title: form.title.value.trim(),
          category: form.category.value,
          fileUrl: form.fileUrl.value.trim(),
          content: form.content.value.trim(),
          isPinned: form.isPinned.checked,
          isActive: form.isActive.checked,
        };

        const res = await AdminAuth.authFetch('/api/notices', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          showToast('Notice published successfully!');
          loadNotices();
        } else {
          showToast(json.message || 'Error publishing notice', 'error');
        }
      },
    });
  });

  // Table actions delegation (Edit, Delete, Toggle Pin, Toggle Active)
  container.querySelector('#notices-table-body').addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;
    const notice = noticesList.find((n) => n._id === id);

    if (action === 'delete') {
      showConfirmModal({
        title: 'Delete Notice',
        message: `Are you sure you want to permanently remove "${notice?.title}"?`,
        confirmText: 'Delete Permanently',
        isDanger: true,
        onConfirm: async () => {
          const res = await AdminAuth.authFetch(`/api/notices/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showToast('Notice deleted');
            loadNotices();
          } else {
            showToast('Failed to delete notice', 'error');
          }
        },
      });
    } else if (action === 'toggle-pin') {
      const res = await AdminAuth.authFetch(`/api/notices/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isPinned: !notice.isPinned }),
      });
      if (res.ok) {
        showToast(notice.isPinned ? 'Notice unpinned' : 'Notice pinned to top');
        loadNotices();
      }
    } else if (action === 'toggle-active') {
      const res = await AdminAuth.authFetch(`/api/notices/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !notice.isActive }),
      });
      if (res.ok) {
        showToast(notice.isActive ? 'Notice marked as draft' : 'Notice published active');
        loadNotices();
      }
    } else if (action === 'edit') {
      showFormModal({
        title: 'Edit Notice',
        submitText: 'Save Changes',
        formHtml: `
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Notice Title *</label>
            <input type="text" name="title" value="${notice.title}" required class="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
              <select name="category" class="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="general" ${notice.category === 'general' ? 'selected' : ''}>General</option>
                <option value="examination" ${notice.category === 'examination' ? 'selected' : ''}>Examination</option>
                <option value="holiday" ${notice.category === 'holiday' ? 'selected' : ''}>Holiday</option>
                <option value="sports" ${notice.category === 'sports' ? 'selected' : ''}>Sports</option>
                <option value="admission" ${notice.category === 'admission' ? 'selected' : ''}>Admission</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Attachment File URL</label>
              <input type="url" name="fileUrl" value="${notice.fileUrl || ''}" class="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Notice Content *</label>
            <textarea name="content" rows="4" required class="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none">${notice.content}</textarea>
          </div>
        `,
        onSubmit: async (form) => {
          const res = await AdminAuth.authFetch(`/api/notices/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
              title: form.title.value.trim(),
              category: form.category.value,
              fileUrl: form.fileUrl.value.trim(),
              content: form.content.value.trim(),
            }),
          });
          if (res.ok) {
            showToast('Notice updated successfully');
            loadNotices();
          }
        },
      });
    }
  });

  // Filter change handlers
  container.querySelector('#notice-category-filter').addEventListener('change', loadNotices);
  container.querySelector('#notice-search-input').addEventListener('input', loadNotices);

  loadNotices();
}
