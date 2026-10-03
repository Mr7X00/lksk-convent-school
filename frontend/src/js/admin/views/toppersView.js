/**
 * Academic Toppers CMS Management View
 * Fields: photo, name, class, session, percentage/grade, achievement, displayOrder, isActive
 */

import { AdminAuth } from '../../adminAuth.js';
import { showToast } from '../components/toast.js';
import { showConfirmModal, showFormModal } from '../components/modal.js';
import { escapeHtml } from '../../utils/sanitize.js';

export async function renderToppers(container) {

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Academic Toppers &amp; Merits</h2>
          <p class="text-xs sm:text-sm text-slate-500">Record, celebrate, and showcase top performing board and class scholars</p>
        </div>
        <div>
          <button id="add-topper-btn" class="inline-flex items-center px-4 py-2.5 bg-school-blue hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add Topper Student
          </button>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-3">
          <label class="font-semibold text-slate-600">Session Filter:</label>
          <select id="topper-session-filter" class="px-3 py-1.5 border rounded-lg focus:outline-none">
            <option value="">All Sessions</option>
            <option value="2025-2026">2025–2026</option>
            <option value="2024-2025">2024–2025</option>
            <option value="2023-2024">2023–2024</option>
          </select>
        </div>
        <div id="toppers-count-label" class="text-slate-500 font-medium">Loading toppers...</div>
      </div>

      <!-- Toppers Grid -->
      <div id="toppers-grid-container" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div class="col-span-full py-12 text-center text-slate-400">Loading academic toppers...</div>
      </div>
    </div>
  `;

  let toppersList = [];

  async function loadToppers() {
    const grid = container.querySelector('#toppers-grid-container');
    const sessionFilter = container.querySelector('#topper-session-filter').value;
    const countLabel = container.querySelector('#toppers-count-label');

    try {
      const query = new URLSearchParams({ all: 'true' });
      if (sessionFilter) query.set('academicYear', sessionFilter);

      const res = await AdminAuth.authFetch(`/api/achievements/toppers?${query.toString()}`);
      const json = await res.json();
      toppersList = json.data || [];
      countLabel.textContent = `${toppersList.length} Topper Record${toppersList.length === 1 ? '' : 's'}`;

      if (toppersList.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full py-12 text-center">
            <div class="max-w-xs mx-auto text-slate-400">
              <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5z"></path></svg>
              <p class="font-semibold text-slate-700 text-sm">No topper records found</p>
              <p class="text-xs text-slate-400 mt-1">Add student board and annual toppers to showcase their merit.</p>
            </div>
          </div>
        `;
        return;
      }

      grid.innerHTML = toppersList.map((t) => `
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="flex items-center gap-3">
                <div class="w-14 h-16 rounded bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-400 font-bold text-sm shrink-0">
                  ${t.photoUrl ? `<img src="${escapeHtml(t.photoUrl)}" alt="${escapeHtml(t.studentName)}" class="w-full h-full object-cover">` : escapeHtml(t.studentName ? t.studentName.charAt(0) : 'T')}
                </div>
                <div class="min-w-0">
                  <h4 class="font-bold text-slate-900 text-sm truncate">${escapeHtml(t.studentName)}</h4>
                  <span class="text-xs font-semibold text-school-gold block truncate">${escapeHtml(t.classGrade || t.examType || 'Class 10')}</span>
                  <span class="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    ${escapeHtml(t.percentageOrScore)}
                  </span>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${t.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                ${t.isActive ? 'ACTIVE' : 'OFF'}
              </span>
            </div>

            <div class="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
              <p><span class="text-slate-400">Session:</span> <strong>${escapeHtml(t.academicYear)}</strong></p>
              <p><span class="text-slate-400">Achievement:</span> ${escapeHtml(t.achievement || (t.rank ? `Rank #${t.rank}` : 'Board Merit'))}</p>
              ${t.stream ? `<p><span class="text-slate-400">Stream:</span> ${escapeHtml(t.stream)}</p>` : ''}
              <p><span class="text-slate-400">Display Order:</span> <strong>${escapeHtml(String(t.displayOrder || 0))}</strong></p>
            </div>
          </div>


          <div class="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
            <button class="edit-topper-btn text-school-blue hover:text-blue-700 font-semibold" data-id="${t._id}">
              Edit Record
            </button>
            <button class="delete-topper-btn p-1 text-slate-400 hover:text-red-600 rounded" title="Delete Record" data-id="${t._id}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </div>
      `).join('');

      grid.querySelectorAll('.edit-topper-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const topper = toppersList.find((t) => t._id === id);
          if (topper) promptEditTopper(topper);
        });
      });

      grid.querySelectorAll('.delete-topper-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const topper = toppersList.find((t) => t._id === id);
          if (topper) promptDeleteTopper(topper);
        });
      });

    } catch (err) {
      grid.innerHTML = `<div class="col-span-full py-8 text-center text-red-500 text-xs">Error loading toppers: ${err.message}</div>`;
    }
  }

  function promptAddTopper() {
    showFormModal({
      title: 'Add Topper Student',
      fields: [
        { name: 'studentName', label: 'Student Name', required: true, placeholder: 'e.g. Priya Sharma' },
        { name: 'classGrade', label: 'Class / Grade', required: true, placeholder: 'e.g. Class 10 or Class 12' },
        { name: 'academicYear', label: 'Academic Session', required: true, defaultValue: '2025-2026', placeholder: 'e.g. 2025-2026' },
        { name: 'percentageOrScore', label: 'Percentage / Grade', required: true, placeholder: 'e.g. 96.8% or Grade A1' },
        { name: 'achievement', label: 'Achievement / Distinction', placeholder: 'e.g. District Rank 1 / School Board Topper' },
        { name: 'stream', label: 'Stream (Optional)', placeholder: 'e.g. Science / Commerce / General' },
        { name: 'photoUrl', label: 'Student Photo URL', placeholder: 'https://images.unsplash.com/...' },
        { name: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
        { name: 'isActive', label: 'Active (Publish on site)', type: 'checkbox', defaultValue: true },
      ],
      onSubmit: async (data) => {
        try {
          // Provide backward-compatible examType
          if (!data.examType) data.examType = data.classGrade;
          const res = await AdminAuth.authFetch('/api/achievements/toppers', {
            method: 'POST',
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (json.success) {
            showToast('Topper student recorded successfully', 'success');
            loadToppers();
          } else {
            showToast(json.message || 'Failed to add topper record', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  function promptEditTopper(topper) {
    showFormModal({
      title: 'Edit Topper Student',
      fields: [
        { name: 'studentName', label: 'Student Name', required: true, defaultValue: topper.studentName },
        { name: 'classGrade', label: 'Class / Grade', required: true, defaultValue: topper.classGrade || topper.examType || 'Class 10' },
        { name: 'academicYear', label: 'Session', required: true, defaultValue: topper.academicYear },
        { name: 'percentageOrScore', label: 'Percentage / Grade', required: true, defaultValue: topper.percentageOrScore },
        { name: 'achievement', label: 'Achievement', defaultValue: topper.achievement || '' },
        { name: 'stream', label: 'Stream', defaultValue: topper.stream || '' },
        { name: 'photoUrl', label: 'Photo URL', defaultValue: topper.photoUrl || '' },
        { name: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: topper.displayOrder || 0 },
        { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: topper.isActive },
      ],
      onSubmit: async (data) => {
        try {
          if (!data.examType) data.examType = data.classGrade;
          const res = await AdminAuth.authFetch(`/api/achievements/toppers/${topper._id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (json.success) {
            showToast('Topper student updated', 'success');
            loadToppers();
          } else {
            showToast(json.message || 'Failed to update record', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  function promptDeleteTopper(topper) {
    showConfirmModal({
      title: 'Delete Topper Record?',
      message: `Are you sure you want to delete ${topper.studentName}'s merit record?`,
      confirmText: 'Delete Record',
      confirmColor: 'bg-red-600 hover:bg-red-700',
      onConfirm: async () => {
        try {
          const res = await AdminAuth.authFetch(`/api/achievements/toppers/${topper._id}`, {
            method: 'DELETE',
          });
          const json = await res.json();
          if (json.success) {
            showToast('Topper record deleted', 'success');
            loadToppers();
          } else {
            showToast(json.message || 'Failed to delete record', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  container.querySelector('#add-topper-btn')?.addEventListener('click', promptAddTopper);
  container.querySelector('#topper-session-filter')?.addEventListener('change', loadToppers);

  loadToppers();
}
