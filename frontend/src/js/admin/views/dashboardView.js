/**
 * Admin Dashboard Overview View
 * Displays real database statistics & recent inquiry activity
 */

import { AdminAuth } from '../../adminAuth.js';
import { showToast } from '../components/toast.js';

export async function renderDashboard(container) {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Top Title & Refresh -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Institutional Dashboard</h2>
          <p class="text-xs sm:text-sm text-slate-500">Live operational telemetry and institutional data overview</p>
        </div>
        <div>
          <button id="refresh-stats-btn" class="inline-flex items-center px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-sm transition-colors">
            <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh Data
          </button>
        </div>
      </div>

      <!-- Loading Placeholder -->
      <div id="stats-loading" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        ${[1, 2, 3, 4, 5, 6, 7, 8].map(() => `
          <div class="bg-white p-5 rounded-xl border border-slate-200 animate-pulse">
            <div class="h-3 w-20 bg-slate-200 rounded mb-2"></div>
            <div class="h-7 w-12 bg-slate-300 rounded"></div>
          </div>
        `).join('')}
      </div>

      <!-- Stats Grid -->
      <div id="stats-cards-grid" class="hidden grid grid-cols-2 sm:grid-cols-4 gap-4"></div>

      <!-- Recent Activity Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Recent Admission Inquiries -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                Recent Admission Enquiries
              </h3>
              <a href="#/admissions" class="text-xs text-school-blue font-semibold hover:underline">View All &rarr;</a>
            </div>
            <div id="recent-admissions-list" class="divide-y divide-slate-100 text-xs">
              <div class="py-4 text-center text-slate-400">Loading inquiries...</div>
            </div>
          </div>
        </div>

        <!-- Recent Contact Inquiries -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                Recent Contact Messages
              </h3>
              <a href="#/inquiries" class="text-xs text-school-blue font-semibold hover:underline">View All &rarr;</a>
            </div>
            <div id="recent-contacts-list" class="divide-y divide-slate-100 text-xs">
              <div class="py-4 text-center text-slate-400">Loading messages...</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Recent Notices & Circulars -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            Active Circulars & Notifications
          </h3>
          <a href="#/notices" class="text-xs text-school-blue font-semibold hover:underline">Manage Notices &rarr;</a>
        </div>
        <div id="recent-notices-list" class="divide-y divide-slate-100 text-xs">
          <div class="py-4 text-center text-slate-400">Loading circulars...</div>
        </div>
      </div>

    </div>
  `;

  async function loadData() {
    const loadingEl = container.querySelector('#stats-loading');
    const cardsGrid = container.querySelector('#stats-cards-grid');
    const admissionsList = container.querySelector('#recent-admissions-list');
    const contactsList = container.querySelector('#recent-contacts-list');
    const noticesList = container.querySelector('#recent-notices-list');

    try {
      const res = await AdminAuth.authFetch('/api/admin/stats');
      const json = await res.json();

      if (json.success && json.data) {
        const counts = json.data.counts || {};

        const statMetrics = [
          { label: 'Admission Inquiries', value: counts.admissionInquiries, pending: counts.pendingAdmissions, href: '#/admissions' },
          { label: 'Contact Messages', value: counts.contactInquiries, pending: counts.unreadContacts, href: '#/inquiries' },
          { label: 'Faculty & Staff', value: counts.staff, href: '#/faculty' },
          { label: 'Gallery Images', value: counts.galleryImages, href: '#/gallery' },
          { label: 'Notices Published', value: counts.notices, href: '#/notices' },
          { label: 'Official Documents', value: counts.documents, href: '#/documents' },
          { label: 'Testimonials', value: counts.testimonials, href: '#/testimonials' },
          { label: 'Achievements', value: counts.achievements, href: '#/achievements' },
        ];

        cardsGrid.innerHTML = statMetrics.map((m) => `
          <a href="${m.href}" class="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group">
            <span class="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 group-hover:text-school-blue">
              ${m.label}
            </span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl sm:text-3xl font-extrabold text-slate-900">${m.value ?? 0}</span>
              ${m.pending !== undefined ? `
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${m.pending > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}">
                  ${m.pending} new
                </span>
              ` : ''}
            </div>
          </a>
        `).join('');

        loadingEl.classList.add('hidden');
        cardsGrid.classList.remove('hidden');

        // Render Recent Admissions
        if (json.data.recentAdmissions && json.data.recentAdmissions.length > 0) {
          admissionsList.innerHTML = json.data.recentAdmissions.map((adm) => `
            <div class="py-2.5 flex items-center justify-between gap-3">
              <div>
                <span class="font-semibold text-slate-900 block">${escapeHtml(adm.studentName)}</span>
                <span class="text-slate-500 text-[11px]">Grade: ${escapeHtml(adm.gradeApplying || adm.classSeeking || '')} &bull; ${new Date(adm.createdAt).toLocaleDateString()}</span>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                adm.status === 'pending' || adm.status === 'New' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }">${escapeHtml(adm.status)}</span>
            </div>
          `).join('');
        } else {
          admissionsList.innerHTML = `<div class="py-6 text-center text-slate-400">No admission inquiries registered yet.</div>`;
        }

        // Render Recent Contacts
        if (json.data.recentContacts && json.data.recentContacts.length > 0) {
          contactsList.innerHTML = json.data.recentContacts.map((c) => `
            <div class="py-2.5 flex items-center justify-between gap-3">
              <div>
                <span class="font-semibold text-slate-900 block">${escapeHtml(c.name)}</span>
                <span class="text-slate-500 text-[11px]">${escapeHtml(c.subject)} &bull; ${new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                c.status === 'unread' || c.status === 'New' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
              }">${escapeHtml(c.status)}</span>
            </div>
          `).join('');
        } else {
          contactsList.innerHTML = `<div class="py-6 text-center text-slate-400">No contact inquiries received yet.</div>`;
        }

        // Render Recent Notices
        if (json.data.recentNotices && json.data.recentNotices.length > 0) {
          noticesList.innerHTML = json.data.recentNotices.map((n) => `
            <div class="py-2.5 flex items-center justify-between gap-3">
              <div>
                <span class="font-semibold text-slate-900 block">${escapeHtml(n.title)}</span>
                <span class="text-slate-500 text-[11px]">Category: ${escapeHtml(n.category)} &bull; Published: ${new Date(n.publishDate).toLocaleDateString()}</span>
              </div>
              ${n.isPinned ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">PINNED</span>` : ''}
            </div>
          `).join('');
        } else {
          noticesList.innerHTML = `<div class="py-6 text-center text-slate-400">No circulars published yet.</div>`;
        }
      }
    } catch (err) {
      showToast('Error loading dashboard statistics: ' + err.message, 'error');
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


  container.querySelector('#refresh-stats-btn')?.addEventListener('click', () => {
    loadData();
    showToast('Dashboard metrics refreshed');
  });

  loadData();
}
