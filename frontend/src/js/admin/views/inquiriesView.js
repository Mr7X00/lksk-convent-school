/**
 * Communication Inquiries (Admission & General Contact) CRM View
 * Full-featured lightweight inbox with search, filtering, pagination, details, notes, delete, and CSV export.
 * L.K.S.K Convent School
 */

import { AdminAuth } from '../../adminAuth.js';
import { showToast } from '../components/toast.js';
import { showFormModal, showConfirmModal } from '../components/modal.js';

export async function renderInquiries(container, defaultTab = 'admissions') {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Communication &amp; Inquiries CRM</h2>
          <p class="text-xs sm:text-sm text-slate-500">Track and respond to prospective student applications and general communications</p>
        </div>

        <div class="flex items-center gap-2">
          <button id="export-csv-btn" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-xs font-semibold shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span>Export CSV</span>
          </button>
          <button id="refresh-inquiries-btn" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-xs font-medium focus:outline-none">
            Refresh
          </button>
        </div>
      </div>

      <!-- Tab Switcher -->
      <div class="flex border-b border-slate-200 text-xs font-semibold">
        <button id="tab-admissions" class="py-2.5 px-5 border-b-2 transition-colors ${
          defaultTab === 'admissions'
            ? 'border-school-blue text-school-blue'
            : 'border-transparent text-slate-500 hover:text-slate-800'
        }">
          Admission Applications
        </button>
        <button id="tab-contacts" class="py-2.5 px-5 border-b-2 transition-colors ${
          defaultTab === 'contacts'
            ? 'border-school-blue text-school-blue'
            : 'border-transparent text-slate-500 hover:text-slate-800'
        }">
          General Contact Messages
        </button>
      </div>

      <!-- Filter & Search Bar -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        
        <div class="flex-1 flex flex-wrap items-center gap-3">
          <!-- Keyword Search -->
          <div class="relative flex-1 min-w-[200px]">
            <input
              type="text"
              id="inquiry-search-input"
              placeholder="Search by name, email, or phone..."
              class="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          <!-- Status Filter -->
          <div class="flex items-center gap-1.5">
            <label for="inquiry-status-filter" class="font-semibold text-slate-600">Status:</label>
            <select id="inquiry-status-filter" class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs">
              <option value="">All Statuses</option>
            </select>
          </div>

          <!-- Grade Filter (Only on admissions) -->
          <div id="grade-filter-container" class="flex items-center gap-1.5">
            <label for="inquiry-grade-filter" class="font-semibold text-slate-600">Class:</label>
            <select id="inquiry-grade-filter" class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs">
              <option value="">All Classes</option>
              <option value="Nursery">Nursery / Pre-Primary</option>
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
              <option value="Class 4">Class 4</option>
              <option value="Class 5">Class 5</option>
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
            </select>
          </div>
        </div>

        <!-- Sorting -->
        <div class="flex items-center gap-2">
          <label for="inquiry-sort-select" class="font-semibold text-slate-600">Sort:</label>
          <select id="inquiry-sort-select" class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs">
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
          </select>
        </div>

      </div>

      <!-- Inquiries Content Container -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        <!-- Desktop Table View -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead id="inquiries-table-head" class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold"></thead>
            <tbody id="inquiries-table-body" class="divide-y divide-slate-100">
              <tr>
                <td colspan="7" class="px-4 py-8 text-center text-slate-400">Loading inquiries...</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div id="inquiries-pagination" class="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50">
          <span id="pagination-summary">Showing records</span>
          <div class="flex items-center space-x-2">
            <button id="prev-page-btn" disabled class="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-50 font-medium">Previous</button>
            <span id="pagination-page-label" class="font-bold px-2 text-slate-800">Page 1</span>
            <button id="next-page-btn" disabled class="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-50 font-medium">Next</button>
          </div>
        </div>

      </div>

    </div>
  `;

  let currentTab = defaultTab;
  let itemsList = [];
  let currentPage = 1;
  const limit = 20;

  const tabAdmissionsBtn = container.querySelector('#tab-admissions');
  const tabContactsBtn = container.querySelector('#tab-contacts');
  const statusFilter = container.querySelector('#inquiry-status-filter');
  const gradeFilter = container.querySelector('#inquiry-grade-filter');
  const gradeFilterContainer = container.querySelector('#grade-filter-container');
  const searchInput = container.querySelector('#inquiry-search-input');
  const sortSelect = container.querySelector('#inquiry-sort-select');
  const exportCsvBtn = container.querySelector('#export-csv-btn');
  const thead = container.querySelector('#inquiries-table-head');
  const tbody = container.querySelector('#inquiries-table-body');
  const paginationSummary = container.querySelector('#pagination-summary');
  const paginationPageLabel = container.querySelector('#pagination-page-label');
  const prevPageBtn = container.querySelector('#prev-page-btn');
  const nextPageBtn = container.querySelector('#next-page-btn');

  function updateStatusFilterOptions() {
    if (currentTab === 'admissions') {
      statusFilter.innerHTML = `
        <option value="">All Statuses</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Archived">Archived</option>
      `;
      gradeFilterContainer.classList.remove('hidden');
    } else {
      statusFilter.innerHTML = `
        <option value="">All Statuses</option>
        <option value="New">New</option>
        <option value="Read">Read</option>
        <option value="Replied">Replied</option>
        <option value="Resolved">Resolved</option>
        <option value="Archived">Archived</option>
      `;
      gradeFilterContainer.classList.add('hidden');
    }
  }

  function getStatusBadge(status) {
    const s = String(status || '').toLowerCase();
    if (s === 'new' || s === 'unread' || s === 'pending') {
      return `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">New</span>`;
    }
    if (s === 'contacted' || s === 'read') {
      return `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">${status}</span>`;
    }
    if (s === 'in progress' || s === 'reviewed') {
      return `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">${status}</span>`;
    }
    if (s === 'completed' || s === 'admitted' || s === 'resolved' || s === 'replied') {
      return `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">${status}</span>`;
    }
    return `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">${status || 'General'}</span>`;
  }

  async function loadData() {
    tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center text-slate-400">Loading records...</td></tr>`;

    const selectedStatus = statusFilter.value;
    const selectedGrade = gradeFilter ? gradeFilter.value : '';
    const searchQuery = searchInput ? searchInput.value.trim() : '';
    const sortOrder = sortSelect ? sortSelect.value : '-createdAt';

    const query = new URLSearchParams({
      page: currentPage,
      limit,
      sort: sortOrder,
    });

    if (selectedStatus) query.set('status', selectedStatus);
    if (searchQuery) query.set('search', searchQuery);

    if (currentTab === 'admissions') {
      if (selectedGrade) query.set('classSeeking', selectedGrade);

      thead.innerHTML = `
        <tr>
          <th class="px-4 py-3">Student Name</th>
          <th class="px-4 py-3">Class Seeking</th>
          <th class="px-4 py-3">Parent / Guardian</th>
          <th class="px-4 py-3">Contact Details</th>
          <th class="px-4 py-3">Submission Date</th>
          <th class="px-4 py-3">Status</th>
          <th class="px-4 py-3 text-right">Actions</th>
        </tr>
      `;

      try {
        const res = await AdminAuth.authFetch(`/api/admissions?${query.toString()}`);
        const json = await res.json();

        itemsList = json.data?.inquiries || [];
        const pagination = json.data?.pagination || { total: 0, totalPages: 1 };

        if (itemsList.length === 0) {
          tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center text-slate-400">No admission applications match your filter criteria.</td></tr>`;
          paginationSummary.textContent = '0 applications found';
          prevPageBtn.disabled = true;
          nextPageBtn.disabled = true;
          return;
        }

        tbody.innerHTML = itemsList.map((item) => {
          const cls = item.classSeeking || item.gradeApplying || 'Not specified';
          const dateStr = new Date(item.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });

          return `
            <tr class="hover:bg-slate-50 transition-colors">
              <td class="px-4 py-3">
                <span class="font-bold text-slate-900 block">${escapeHtml(item.studentName)}</span>
                ${item.gender ? `<span class="text-[10px] text-slate-400 capitalize">${escapeHtml(item.gender)}</span>` : ''}
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-school-blue border border-blue-100">${escapeHtml(cls)}</span>
              </td>
              <td class="px-4 py-3 text-slate-700">${escapeHtml(item.parentName)}</td>
              <td class="px-4 py-3 text-slate-600">
                <span class="font-medium">${escapeHtml(item.phone)}</span>
                <span class="block text-[11px] text-slate-400 truncate max-w-[150px]">${escapeHtml(item.email)}</span>
              </td>
              <td class="px-4 py-3 text-slate-500 whitespace-nowrap">${dateStr}</td>
              <td class="px-4 py-3">${getStatusBadge(item.status)}</td>
              <td class="px-4 py-3 text-right whitespace-nowrap space-x-2">
                <button data-id="${item._id}" data-action="view-admission" class="text-school-blue hover:underline font-semibold">Review</button>
                <button data-id="${item._id}" data-action="delete-admission" class="text-rose-600 hover:underline">Delete</button>
              </td>
            </tr>
          `;
        }).join('');

        paginationSummary.textContent = `Showing ${itemsList.length} of ${pagination.total} applications`;
        paginationPageLabel.textContent = `Page ${pagination.page} of ${pagination.totalPages}`;
        prevPageBtn.disabled = pagination.page <= 1;
        nextPageBtn.disabled = pagination.page >= pagination.totalPages;

      } catch (err) {
        showToast('Error loading admissions: ' + err.message, 'error');
      }

    } else {
      // General Contact Messages
      thead.innerHTML = `
        <tr>
          <th class="px-4 py-3">Sender Name</th>
          <th class="px-4 py-3">Subject</th>
          <th class="px-4 py-3">Contact</th>
          <th class="px-4 py-3">Received Date</th>
          <th class="px-4 py-3">Status</th>
          <th class="px-4 py-3 text-right">Actions</th>
        </tr>
      `;

      try {
        const res = await AdminAuth.authFetch(`/api/contact?${query.toString()}`);
        const json = await res.json();

        itemsList = json.data?.inquiries || [];
        const pagination = json.data?.pagination || { total: 0, totalPages: 1 };

        if (itemsList.length === 0) {
          tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-slate-400">No contact messages match your filter criteria.</td></tr>`;
          paginationSummary.textContent = '0 messages found';
          prevPageBtn.disabled = true;
          nextPageBtn.disabled = true;
          return;
        }

        tbody.innerHTML = itemsList.map((item) => {
          const dateStr = new Date(item.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });

          return `
            <tr class="hover:bg-slate-50 transition-colors">
              <td class="px-4 py-3 font-semibold text-slate-900">${escapeHtml(item.name)}</td>
              <td class="px-4 py-3 text-slate-800 font-medium max-w-xs truncate">${escapeHtml(item.subject)}</td>
              <td class="px-4 py-3 text-slate-600">
                <span class="block">${escapeHtml(item.email)}</span>
                ${item.phone ? `<span class="text-[11px] text-slate-400">${escapeHtml(item.phone)}</span>` : ''}
              </td>
              <td class="px-4 py-3 text-slate-500 whitespace-nowrap">${dateStr}</td>
              <td class="px-4 py-3">${getStatusBadge(item.status)}</td>
              <td class="px-4 py-3 text-right whitespace-nowrap space-x-2">
                <button data-id="${item._id}" data-action="view-contact" class="text-school-blue hover:underline font-semibold">View</button>
                <button data-id="${item._id}" data-action="delete-contact" class="text-rose-600 hover:underline">Delete</button>
              </td>
            </tr>
          `;
        }).join('');

        paginationSummary.textContent = `Showing ${itemsList.length} of ${pagination.total} messages`;
        paginationPageLabel.textContent = `Page ${pagination.page} of ${pagination.totalPages}`;
        prevPageBtn.disabled = pagination.page <= 1;
        nextPageBtn.disabled = pagination.page >= pagination.totalPages;

      } catch (err) {
        showToast('Error loading contact messages: ' + err.message, 'error');
      }
    }
  }

  // Handle Tab Switch
  tabAdmissionsBtn.addEventListener('click', () => {
    currentTab = 'admissions';
    currentPage = 1;
    tabAdmissionsBtn.className = 'py-2.5 px-5 border-b-2 transition-colors border-school-blue text-school-blue';
    tabContactsBtn.className = 'py-2.5 px-5 border-b-2 transition-colors border-transparent text-slate-500 hover:text-slate-800';
    updateStatusFilterOptions();
    loadData();
  });

  tabContactsBtn.addEventListener('click', () => {
    currentTab = 'contacts';
    currentPage = 1;
    tabContactsBtn.className = 'py-2.5 px-5 border-b-2 transition-colors border-school-blue text-school-blue';
    tabAdmissionsBtn.className = 'py-2.5 px-5 border-b-2 transition-colors border-transparent text-slate-500 hover:text-slate-800';
    updateStatusFilterOptions();
    loadData();
  });

  // Filter change handlers
  statusFilter.addEventListener('change', () => { currentPage = 1; loadData(); });
  gradeFilter?.addEventListener('change', () => { currentPage = 1; loadData(); });
  sortSelect?.addEventListener('change', () => { currentPage = 1; loadData(); });
  container.querySelector('#refresh-inquiries-btn')?.addEventListener('click', loadData);

  // Debounced Search Input
  let searchTimeout;
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentPage = 1;
      loadData();
    }, 350);
  });

  // Pagination Handlers
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadData();
    }
  });

  nextPageBtn.addEventListener('click', () => {
    currentPage++;
    loadData();
  });

  // Export CSV Handler
  exportCsvBtn.addEventListener('click', async () => {
    const endpoint = currentTab === 'admissions' ? '/api/admissions/export/csv' : '/api/contact/export/csv';
    const filenamePrefix = currentTab === 'admissions' ? 'admissions_inquiries' : 'contact_inquiries';

    try {
      showToast('Preparing CSV export...', 'info');
      const res = await AdminAuth.authFetch(endpoint);
      if (!res.ok) {
        throw new Error('Export failed. Status: ' + res.status);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast('CSV export downloaded successfully!');
    } catch (err) {
      showToast('Export failed: ' + err.message, 'error');
    }
  });

  // Table Review / Update modal delegation
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;
    const item = itemsList.find((i) => i._id === id);
    if (!item) return;

    if (action === 'view-admission') {
      const cls = item.classSeeking || item.gradeApplying || 'Not specified';
      const cleanPhone = (item.phone || '').replace(/\D/g, '');
      const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : '';

      showFormModal({
        title: `Admission Application: ${item.studentName}`,
        submitText: 'Save Changes',
        formHtml: `
          <div class="space-y-4 text-xs">
            
            <!-- Quick Action Bar -->
            <div class="flex items-center gap-2 p-2.5 bg-slate-100 rounded-lg">
              <span class="font-semibold text-slate-700 mr-1">Direct Contact:</span>
              <a href="tel:${escapeHtml(item.phone)}" class="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border text-slate-700 font-medium">Call Parent</a>
              <a href="mailto:${escapeHtml(item.email)}" class="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border text-slate-700 font-medium">Send Email</a>
              ${waLink ? `<a href="${waLink}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium">WhatsApp</a>` : ''}
            </div>

            <!-- Full Details Card -->
            <div class="bg-slate-50 p-4 rounded-lg border space-y-2">
              <div class="grid grid-cols-2 gap-2">
                <div><span class="text-slate-400 block">Student Name:</span> <strong>${escapeHtml(item.studentName)}</strong></div>
                <div><span class="text-slate-400 block">Grade / Wing:</span> <span class="font-bold text-school-blue">${escapeHtml(cls)}</span></div>
                <div><span class="text-slate-400 block">Parent / Guardian:</span> <strong>${escapeHtml(item.parentName)}</strong></div>
                <div><span class="text-slate-400 block">Contact Phone:</span> <strong>${escapeHtml(item.phone)}</strong></div>
                <div><span class="text-slate-400 block">Email Address:</span> <strong>${escapeHtml(item.email)}</strong></div>
                <div><span class="text-slate-400 block">Academic Session:</span> <strong>${escapeHtml(item.academicYear || '2026-27')}</strong></div>
                <div><span class="text-slate-400 block">Gender:</span> <span class="capitalize">${escapeHtml(item.gender || 'Not specified')}</span></div>
                <div><span class="text-slate-400 block">Date of Birth:</span> <span>${item.dateOfBirth ? new Date(item.dateOfBirth).toLocaleDateString('en-IN') : 'Not specified'}</span></div>
              </div>

              ${item.address ? `<div class="mt-2 pt-2 border-t text-slate-700"><span class="text-slate-400 block">Address:</span> ${escapeHtml(item.address)}</div>` : ''}
              ${item.message ? `<div class="mt-2 pt-2 border-t text-slate-700"><span class="text-slate-400 block">Parent Remarks / Queries:</span> ${escapeHtml(item.message)}</div>` : ''}
              
              <div class="mt-2 pt-2 border-t text-[11px] text-slate-400">
                Submitted on: ${new Date(item.createdAt).toLocaleString('en-IN')}
              </div>
            </div>

            <!-- Workflow Status -->
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Workflow Status</label>
              <select name="status" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="New" ${item.status === 'New' || item.status === 'pending' ? 'selected' : ''}>New</option>
                <option value="Contacted" ${item.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                <option value="In Progress" ${item.status === 'In Progress' || item.status === 'reviewed' ? 'selected' : ''}>In Progress</option>
                <option value="Completed" ${item.status === 'Completed' || item.status === 'admitted' ? 'selected' : ''}>Completed (Admitted)</option>
                <option value="Archived" ${item.status === 'Archived' || item.status === 'rejected' ? 'selected' : ''}>Archived</option>
              </select>
            </div>

            <!-- Internal Admin Notes -->
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Internal Administrative Notes (Private)</label>
              <textarea name="adminNotes" rows="3" placeholder="Enter follow-up logs, fee quotation, document verification notes..." class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">${escapeHtml(item.adminNotes || item.notes || '')}</textarea>
            </div>

          </div>
        `,
        onSubmit: async (form) => {
          const res = await AdminAuth.authFetch(`/api/admissions/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              status: form.status.value,
              adminNotes: form.adminNotes.value.trim(),
            }),
          });
          if (res.ok) {
            showToast('Admission application updated successfully!');
            loadData();
          } else {
            showToast('Failed to update status', 'error');
          }
        },
      });

    } else if (action === 'delete-admission') {
      showConfirmModal({
        title: 'Delete Admission Application',
        message: `Are you sure you want to permanently delete the inquiry for student "${item.studentName}"? This action cannot be undone.`,
        confirmText: 'Delete Record',
        onConfirm: async () => {
          const res = await AdminAuth.authFetch(`/api/admissions/${id}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            showToast('Application deleted successfully');
            loadData();
          } else {
            showToast('Failed to delete application', 'error');
          }
        },
      });

    } else if (action === 'view-contact') {
      const cleanPhone = (item.phone || '').replace(/\D/g, '');
      const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : '';

      showFormModal({
        title: `Message from ${item.name}`,
        submitText: 'Save Status',
        formHtml: `
          <div class="space-y-4 text-xs">
            
            <!-- Quick Action Bar -->
            <div class="flex items-center gap-2 p-2.5 bg-slate-100 rounded-lg">
              <span class="font-semibold text-slate-700 mr-1">Direct Action:</span>
              <a href="mailto:${escapeHtml(item.email)}" class="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border text-slate-700 font-medium">Reply via Email</a>
              ${item.phone ? `<a href="tel:${escapeHtml(item.phone)}" class="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border text-slate-700 font-medium">Call</a>` : ''}
              ${waLink ? `<a href="${waLink}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium">WhatsApp</a>` : ''}
            </div>

            <div class="bg-slate-50 p-4 rounded-lg border space-y-2">
              <div class="grid grid-cols-2 gap-2">
                <div><span class="text-slate-400 block">Sender Name:</span> <strong>${escapeHtml(item.name)}</strong></div>
                <div><span class="text-slate-400 block">Email Address:</span> <strong>${escapeHtml(item.email)}</strong></div>
                <div><span class="text-slate-400 block">Phone:</span> <strong>${escapeHtml(item.phone || 'Not provided')}</strong></div>
                <div><span class="text-slate-400 block">Subject:</span> <strong>${escapeHtml(item.subject)}</strong></div>
              </div>
              <div class="mt-2 pt-2 border-t">
                <span class="text-slate-400 block mb-1 font-semibold">Message Body:</span>
                <p class="text-slate-800 leading-relaxed font-sans whitespace-pre-wrap bg-white p-3 rounded border">${escapeHtml(item.message)}</p>
              </div>
              <div class="text-[11px] text-slate-400 pt-1">
                Received: ${new Date(item.createdAt).toLocaleString('en-IN')}
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Status</label>
              <select name="status" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="New" ${item.status === 'New' || item.status === 'unread' ? 'selected' : ''}>New</option>
                <option value="Read" ${item.status === 'Read' || item.status === 'read' ? 'selected' : ''}>Read</option>
                <option value="Replied" ${item.status === 'Replied' || item.status === 'replied' ? 'selected' : ''}>Replied</option>
                <option value="Resolved" ${item.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                <option value="Archived" ${item.status === 'Archived' ? 'selected' : ''}>Archived</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Internal Notes</label>
              <textarea name="adminNotes" rows="2" placeholder="Record date of reply or phone conversation..." class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">${escapeHtml(item.adminNotes || item.notes || '')}</textarea>
            </div>

          </div>
        `,
        onSubmit: async (form) => {
          const res = await AdminAuth.authFetch(`/api/contact/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              status: form.status.value,
              adminNotes: form.adminNotes.value.trim(),
            }),
          });
          if (res.ok) {
            showToast('Message status updated successfully!');
            loadData();
          } else {
            showToast('Failed to update status', 'error');
          }
        },
      });

    } else if (action === 'delete-contact') {
      showConfirmModal({
        title: 'Delete Contact Message',
        message: `Are you sure you want to delete this message from "${item.name}"? This action cannot be undone.`,
        confirmText: 'Delete Message',
        onConfirm: async () => {
          const res = await AdminAuth.authFetch(`/api/contact/${id}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            showToast('Message deleted successfully');
            loadData();
          } else {
            showToast('Failed to delete message', 'error');
          }
        },
      });
    }
  });

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  updateStatusFilterOptions();
  loadData();
}
