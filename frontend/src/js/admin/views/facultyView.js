/**
 * Faculty & Staff CMS Management View
 * Categories: PGT, TGT, Other Teaching Staff, Administrative Staff, Support Staff
 * Display: passport-size photo, name, designation, subject, qualification, experience, order
 */

import { AdminAuth } from '../../adminAuth.js';
import { showToast } from '../components/toast.js';
import { showConfirmModal, showFormModal } from '../components/modal.js';
import { escapeHtml } from '../../utils/sanitize.js';

export async function renderFaculty(container) {

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Faculty &amp; Staff Directory</h2>
          <p class="text-xs sm:text-sm text-slate-500">Add, edit, reorder, and manage teaching personnel and administrative staff</p>
        </div>
        <div>
          <button id="add-faculty-btn" class="inline-flex items-center px-4 py-2.5 bg-school-blue hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add Faculty Member
          </button>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-3">
          <label class="font-semibold text-slate-600">Category Filter:</label>
          <select id="faculty-category-filter" class="px-3 py-1.5 border rounded-lg focus:outline-none">
            <option value="">All Faculty &amp; Staff</option>
            <option value="PGT">Post Graduate Teachers (PGT)</option>
            <option value="TGT">Trained Graduate Teachers (TGT)</option>
            <option value="Other Teaching Staff">Other Teaching Staff</option>
            <option value="Administrative Staff">Administrative Staff</option>
            <option value="Support Staff">Support Staff</option>
          </select>
        </div>
        <div id="faculty-count-badge" class="text-slate-500 font-medium">Loading staff...</div>
      </div>

      <!-- Faculty Grid -->
      <div id="faculty-cards-container" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div class="col-span-full py-12 text-center text-slate-400">Loading faculty directory...</div>
      </div>
    </div>
  `;

  let facultyList = [];

  async function loadFaculty() {
    const cardsContainer = container.querySelector('#faculty-cards-container');
    const categoryFilter = container.querySelector('#faculty-category-filter').value;
    const countBadge = container.querySelector('#faculty-count-badge');

    try {
      const query = new URLSearchParams({ all: 'true' });
      if (categoryFilter) query.set('category', categoryFilter);

      const res = await AdminAuth.authFetch(`/api/staff?${query.toString()}`);
      const json = await res.json();

      facultyList = json.data || [];
      countBadge.textContent = `${facultyList.length} Member${facultyList.length === 1 ? '' : 's'}`;

      if (facultyList.length === 0) {
        cardsContainer.innerHTML = `
          <div class="col-span-full py-12 text-center">
            <div class="max-w-xs mx-auto text-slate-400">
              <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <p class="font-semibold text-slate-700 text-sm">No faculty records found</p>
              <p class="text-xs text-slate-400 mt-1">Add staff profiles to publish on the school faculty directory.</p>
            </div>
          </div>
        `;
        return;
      }

      cardsContainer.innerHTML = facultyList.map((f) => `
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="flex items-center gap-3">
                <div class="w-14 h-16 rounded bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-400 font-bold text-sm shrink-0">
                  ${f.photoUrl ? `<img src="${escapeHtml(f.photoUrl)}" alt="${escapeHtml(f.name)}" class="w-full h-full object-cover">` : escapeHtml(f.name ? f.name.charAt(0) : 'F')}
                </div>
                <div class="min-w-0">
                  <h4 class="font-bold text-slate-900 text-sm truncate">${escapeHtml(f.name)}</h4>
                  <span class="text-xs font-semibold text-school-blue block truncate">${escapeHtml(f.designation)}</span>
                  <span class="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    ${escapeHtml(f.category || 'Teaching')}
                  </span>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${f.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                ${f.isActive ? 'ACTIVE' : 'OFF'}
              </span>
            </div>

            <div class="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
              ${f.subject ? `<p><span class="text-slate-400">Subject:</span> <strong>${escapeHtml(f.subject)}</strong></p>` : ''}
              <p><span class="text-slate-400">Qualification:</span> ${escapeHtml(f.qualification || 'Not Specified')}</p>
              <p><span class="text-slate-400">Experience:</span> ${escapeHtml(String(f.experienceYears || 0))} Years</p>
              <p><span class="text-slate-400">Display Order:</span> <strong>${escapeHtml(String(f.displayOrder || 0))}</strong></p>
            </div>
          </div>


          <div class="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
            <button class="edit-faculty-btn text-school-blue hover:text-blue-700 font-semibold" data-id="${f._id}">
              Edit Profile
            </button>
            <button class="delete-faculty-btn p-1 text-slate-400 hover:text-red-600 rounded" title="Delete Profile" data-id="${f._id}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </div>
      `).join('');

      cardsContainer.querySelectorAll('.edit-faculty-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const member = facultyList.find((f) => f._id === id);
          if (member) promptEditFaculty(member);
        });
      });

      cardsContainer.querySelectorAll('.delete-faculty-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const member = facultyList.find((f) => f._id === id);
          if (member) promptDeleteFaculty(member);
        });
      });
    } catch (err) {
      cardsContainer.innerHTML = `<div class="col-span-full py-8 text-center text-red-500 text-xs">Error loading faculty: ${err.message}</div>`;
    }
  }

  function promptAddFaculty() {
    showFormModal({
      title: 'Add New Faculty Member',
      fields: [
        { name: 'name', label: 'Full Name', required: true, placeholder: 'e.g. Dr. Rajesh Sharma' },
        {
          name: 'category',
          label: 'Faculty Category',
          type: 'select',
          options: [
            { value: 'PGT', label: 'Post Graduate Teacher (PGT)' },
            { value: 'TGT', label: 'Trained Graduate Teacher (TGT)' },
            { value: 'Other Teaching Staff', label: 'Other Teaching Staff' },
            { value: 'Administrative Staff', label: 'Administrative Staff' },
            { value: 'Support Staff', label: 'Support Staff' },
          ],
          defaultValue: 'PGT',
        },
        { name: 'designation', label: 'Designation', required: true, placeholder: 'e.g. Senior PGT Physics / Head of Dept' },
        { name: 'subject', label: 'Subject Taught (If applicable)', placeholder: 'e.g. Physics & Mechanics' },
        { name: 'qualification', label: 'Highest Qualification', placeholder: 'e.g. M.Sc. Physics, B.Ed.' },
        { name: 'experienceYears', label: 'Experience (in Years)', type: 'number', defaultValue: 5 },
        { name: 'photoUrl', label: 'Passport Photo URL', placeholder: 'https://images.unsplash.com/...' },
        { name: 'displayOrder', label: 'Display Order (Administrator-defined ordering)', type: 'number', defaultValue: 0 },
        { name: 'isActive', label: 'Active (Publish to public directory)', type: 'checkbox', defaultValue: true },
      ],
      onSubmit: async (data) => {
        try {
          const res = await AdminAuth.authFetch('/api/staff', {
            method: 'POST',
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (json.success) {
            showToast('Faculty member added successfully', 'success');
            loadFaculty();
          } else {
            showToast(json.message || 'Failed to add faculty member', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  function promptEditFaculty(member) {
    showFormModal({
      title: 'Edit Faculty Member',
      fields: [
        { name: 'name', label: 'Full Name', required: true, defaultValue: member.name },
        {
          name: 'category',
          label: 'Faculty Category',
          type: 'select',
          options: [
            { value: 'PGT', label: 'Post Graduate Teacher (PGT)' },
            { value: 'TGT', label: 'Trained Graduate Teacher (TGT)' },
            { value: 'Other Teaching Staff', label: 'Other Teaching Staff' },
            { value: 'Administrative Staff', label: 'Administrative Staff' },
            { value: 'Support Staff', label: 'Support Staff' },
          ],
          defaultValue: member.category || 'Other Teaching Staff',
        },
        { name: 'designation', label: 'Designation', required: true, defaultValue: member.designation },
        { name: 'subject', label: 'Subject', defaultValue: member.subject || '' },
        { name: 'qualification', label: 'Qualification', defaultValue: member.qualification || '' },
        { name: 'experienceYears', label: 'Experience (Years)', type: 'number', defaultValue: member.experienceYears || 0 },
        { name: 'photoUrl', label: 'Passport Photo URL', defaultValue: member.photoUrl || '' },
        { name: 'displayOrder', label: 'Display Order (Ordering)', type: 'number', defaultValue: member.displayOrder || 0 },
        { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: member.isActive },
      ],
      onSubmit: async (data) => {
        try {
          const res = await AdminAuth.authFetch(`/api/staff/${member._id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (json.success) {
            showToast('Faculty member updated', 'success');
            loadFaculty();
          } else {
            showToast(json.message || 'Failed to update faculty member', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  function promptDeleteFaculty(member) {
    showConfirmModal({
      title: 'Delete Faculty Member?',
      message: `Are you sure you want to delete ${member.name}? This record will be removed from the public website.`,
      confirmText: 'Delete Member',
      confirmColor: 'bg-red-600 hover:bg-red-700',
      onConfirm: async () => {
        try {
          const res = await AdminAuth.authFetch(`/api/staff/${member._id}`, {
            method: 'DELETE',
          });
          const json = await res.json();
          if (json.success) {
            showToast('Faculty member deleted', 'success');
            loadFaculty();
          } else {
            showToast(json.message || 'Failed to delete faculty member', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  container.querySelector('#add-faculty-btn')?.addEventListener('click', promptAddFaculty);
  container.querySelector('#faculty-category-filter')?.addEventListener('change', loadFaculty);

  loadFaculty();
}
