/**
 * Achievements CMS Management View
 * Categories: Academic, Sports, Cultural, Competitions, Creative, Other
 * Display: student, class, achievement, event, year, photo, description
 */

import { AdminAuth } from '../../adminAuth.js';
import { showToast } from '../components/toast.js';
import { showConfirmModal, showFormModal } from '../components/modal.js';
import { escapeHtml, sanitizeUrl } from '../../utils/sanitize.js';

export async function renderAchievements(container) {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Student Achievements &amp; Distinctions</h2>
          <p class="text-xs sm:text-sm text-slate-500">Record athletic, academic, cultural, and inter-school championship awards</p>
        </div>
        <div>
          <button id="add-achievement-btn" class="inline-flex items-center px-4 py-2.5 bg-school-blue hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add Achievement Record
          </button>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-3">
          <label class="font-semibold text-slate-600">Category Filter:</label>
          <select id="achievement-category-filter" class="px-3 py-1.5 border rounded-lg focus:outline-none">
            <option value="">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Sports">Sports</option>
            <option value="Cultural">Cultural</option>
            <option value="Competitions">Competitions</option>
            <option value="Creative">Creative</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div id="achievements-count-label" class="text-slate-500 font-medium">Loading achievements...</div>
      </div>

      <!-- Achievements Grid -->
      <div id="achievements-grid-container" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div class="col-span-full py-12 text-center text-slate-400">Loading achievements...</div>
      </div>
    </div>
  `;

  let achievementsList = [];

  async function loadAchievements() {
    const grid = container.querySelector('#achievements-grid-container');
    const category = container.querySelector('#achievement-category-filter').value;
    const countLabel = container.querySelector('#achievements-count-label');

    try {
      const query = new URLSearchParams({ all: 'true' });
      if (category) query.set('category', category);

      const res = await AdminAuth.authFetch(`/api/achievements?${query.toString()}`);
      const json = await res.json();
      achievementsList = json.data || [];
      countLabel.textContent = `${achievementsList.length} Record${achievementsList.length === 1 ? '' : 's'}`;

      if (achievementsList.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full py-12 text-center">
            <div class="max-w-xs mx-auto text-slate-400">
              <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              <p class="font-semibold text-slate-700 text-sm">No achievement records found</p>
              <p class="text-xs text-slate-400 mt-1">Add student awards to celebrate their laurels on the portal.</p>
            </div>
          </div>
        `;
        return;
      }

      grid.innerHTML = achievementsList.map((a) => {
        const photo = sanitizeUrl(a.photoUrl || a.imageUrl);
        const student = escapeHtml(a.student || a.recipient || 'Student');
        const honor = escapeHtml(a.achievement || a.title || '');
        const category = escapeHtml(a.category || 'Academic');
        const studentClass = escapeHtml(a.studentClass || '');
        const eventName = escapeHtml(a.event || '');
        const description = escapeHtml(a.description || '');
        const year = escapeHtml(String(a.year || new Date(a.date).getFullYear() || ''));

        return `
          <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            ${photo ? `
              <div class="relative aspect-video bg-slate-100 overflow-hidden">
                <img src="${photo}" alt="${honor}" class="w-full h-full object-cover" onerror="this.src='/assets/branding/new%20logo%20transparent.png'" />
                <span class="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${a.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                  ${a.isActive ? 'ACTIVE' : 'OFF'}
                </span>
                <span class="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-school-navy/80 text-white">
                  ${category}
                </span>
              </div>
            ` : `
              <div class="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-school-navy/10 text-school-navy">
                  ${category}
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${a.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                  ${a.isActive ? 'ACTIVE' : 'OFF'}
                </span>
              </div>
            `}

            <div class="p-4 flex-1 flex flex-col justify-between text-xs space-y-3">
              <div>
                <h4 class="font-bold text-slate-900 text-sm">${honor}</h4>
                <p class="font-medium text-school-blue text-xs mt-0.5">${student} ${studentClass ? `<span class="text-slate-400">(${studentClass})</span>` : ''}</p>
                <div class="space-y-0.5 text-slate-500 text-[11px] mt-2">
                  ${eventName ? `<p><span class="text-slate-400">Event:</span> ${eventName}</p>` : ''}
                  <p><span class="text-slate-400">Year:</span> ${year}</p>
                </div>
                <p class="text-slate-600 text-xs mt-2 line-clamp-2">${description}</p>
              </div>

              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button class="edit-achievement-btn text-school-blue hover:text-blue-700 font-semibold" data-id="${a._id}">
                  Edit Record
                </button>
                <button class="delete-achievement-btn p-1 text-slate-400 hover:text-red-600 rounded" title="Delete Achievement" data-id="${a._id}">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      grid.querySelectorAll('.edit-achievement-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const item = achievementsList.find((a) => a._id === id);
          if (item) promptEditAchievement(item);
        });
      });

      grid.querySelectorAll('.delete-achievement-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const item = achievementsList.find((a) => a._id === id);
          if (item) promptDeleteAchievement(item);
        });
      });

    } catch (err) {
      grid.innerHTML = `<div class="col-span-full py-8 text-center text-red-500 text-xs">Error loading achievements: ${err.message}</div>`;
    }
  }

  function promptAddAchievement() {
    showFormModal({
      title: 'Add Student Achievement',
      fields: [
        { name: 'student', label: 'Student Name', required: true, placeholder: 'e.g. Aman Verma' },
        { name: 'studentClass', label: 'Class / Grade', placeholder: 'e.g. Class 9A' },
        { name: 'achievement', label: 'Achievement / Award Title', required: true, placeholder: 'e.g. Gold Medal in District 100m Sprint' },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          options: [
            { value: 'Academic', label: 'Academic' },
            { value: 'Sports', label: 'Sports' },
            { value: 'Cultural', label: 'Cultural' },
            { value: 'Competitions', label: 'Competitions' },
            { value: 'Creative', label: 'Creative' },
            { value: 'Other', label: 'Other' },
          ],
          defaultValue: 'Academic',
        },
        { name: 'event', label: 'Event / Championship Name', placeholder: 'e.g. Ayodhya District Athletic Meet 2026' },
        { name: 'year', label: 'Year', defaultValue: '2026', placeholder: 'e.g. 2026' },
        { name: 'photoUrl', label: 'Photo URL', placeholder: 'https://images.unsplash.com/...' },
        { name: 'description', label: 'Detailed Description', type: 'textarea', required: true, placeholder: 'Summary of the distinction or achievement' },
        { name: 'isFeatured', label: 'Feature on Homepage', type: 'checkbox' },
        { name: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
        { name: 'isActive', label: 'Active (Visible on public portal)', type: 'checkbox', defaultValue: true },
      ],
      onSubmit: async (data) => {
        try {
          if (!data.title) data.title = data.achievement;
          if (!data.recipient) data.recipient = data.student;
          if (!data.imageUrl) data.imageUrl = data.photoUrl;

          const res = await AdminAuth.authFetch('/api/achievements', {
            method: 'POST',
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (json.success) {
            showToast('Achievement recorded successfully', 'success');
            loadAchievements();
          } else {
            showToast(json.message || 'Failed to add achievement', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  function promptEditAchievement(item) {
    showFormModal({
      title: 'Edit Student Achievement',
      fields: [
        { name: 'student', label: 'Student Name', required: true, defaultValue: item.student || item.recipient || '' },
        { name: 'studentClass', label: 'Class / Grade', defaultValue: item.studentClass || '' },
        { name: 'achievement', label: 'Achievement Title', required: true, defaultValue: item.achievement || item.title || '' },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          options: [
            { value: 'Academic', label: 'Academic' },
            { value: 'Sports', label: 'Sports' },
            { value: 'Cultural', label: 'Cultural' },
            { value: 'Competitions', label: 'Competitions' },
            { value: 'Creative', label: 'Creative' },
            { value: 'Other', label: 'Other' },
          ],
          defaultValue: item.category || 'Academic',
        },
        { name: 'event', label: 'Event', defaultValue: item.event || '' },
        { name: 'year', label: 'Year', defaultValue: item.year || '2026' },
        { name: 'photoUrl', label: 'Photo URL', defaultValue: item.photoUrl || item.imageUrl || '' },
        { name: 'description', label: 'Description', type: 'textarea', required: true, defaultValue: item.description || '' },
        { name: 'isFeatured', label: 'Feature on Homepage', type: 'checkbox', defaultValue: item.isFeatured },
        { name: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: item.displayOrder || 0 },
        { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: item.isActive },
      ],
      onSubmit: async (data) => {
        try {
          data.title = data.achievement;
          data.recipient = data.student;
          data.imageUrl = data.photoUrl;

          const res = await AdminAuth.authFetch(`/api/achievements/${item._id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (json.success) {
            showToast('Achievement updated', 'success');
            loadAchievements();
          } else {
            showToast(json.message || 'Failed to update achievement', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  function promptDeleteAchievement(item) {
    showConfirmModal({
      title: 'Delete Achievement Record?',
      message: `Are you sure you want to delete the achievement record for ${item.student || item.recipient || item.title}?`,
      confirmText: 'Delete Record',
      confirmColor: 'bg-red-600 hover:bg-red-700',
      onConfirm: async () => {
        try {
          const res = await AdminAuth.authFetch(`/api/achievements/${item._id}`, {
            method: 'DELETE',
          });
          const json = await res.json();
          if (json.success) {
            showToast('Achievement deleted', 'success');
            loadAchievements();
          } else {
            showToast(json.message || 'Failed to delete achievement', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  container.querySelector('#add-achievement-btn')?.addEventListener('click', promptAddAchievement);
  container.querySelector('#achievement-category-filter')?.addEventListener('change', loadAchievements);

  loadAchievements();
}
