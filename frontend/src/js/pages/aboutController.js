/**
 * About Pages Controller
 * Handles About Overview, Manager's Desk, Principal's Message, Mission & Vision, and Faculty Directory
 * Connects with /api/staff and /api/settings
 * L.K.S.K Convent School
 */

import { UIStates } from '../components/uiStates.js';
import { escapeHtml } from '../utils/sanitize.js';

export const AboutController = {

  /**
   * Initializes Faculty Directory page
   */
  async initFacultyPage() {
    const container = document.getElementById('faculty-grid');
    const filterButtons = document.querySelectorAll('.faculty-filter-btn');

    if (!container) return;

    // 1. Show Loading Skeleton
    container.innerHTML = `
      <div class="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${UIStates.loading('profile', { count: 4 })}
      </div>
    `;

    try {
      const response = await fetch('/api/staff?all=false');
      const data = await response.json();

      let staffList = [];
      if (response.ok && data.success && Array.isArray(data.data)) {
        staffList = data.data;
      }

      // Administrator-defined ordering
      staffList.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      this.renderFacultyCards(container, staffList);

      // Category Filtering
      filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          filterButtons.forEach(b => {
            b.classList.remove('bg-school-navy', 'text-white');
            b.classList.add('bg-white', 'text-school-slate-700');
          });
          btn.classList.remove('bg-white', 'text-school-slate-700');
          btn.classList.add('bg-school-navy', 'text-white');

          const category = btn.getAttribute('data-category-filter');
          const cards = container.querySelectorAll('[data-faculty-cat]');
          let visibleCount = 0;

          cards.forEach((card) => {
            const cardCat = card.getAttribute('data-faculty-cat');
            if (category === 'all' || cardCat.toLowerCase() === category.toLowerCase()) {
              card.classList.remove('hidden');
              visibleCount++;
            } else {
              card.classList.add('hidden');
            }
          });

          const emptyNotice = document.getElementById('faculty-empty-notice');
          if (visibleCount === 0) {
            if (!emptyNotice) {
              const notice = document.createElement('div');
              notice.id = 'faculty-empty-notice';
              notice.className = 'col-span-full py-12';
              notice.innerHTML = UIStates.empty({
                title: 'No Faculty Records in Selected Category',
                message: 'Faculty profiles for this specific staff category will be published soon.',
              });
              container.appendChild(notice);
            }
          } else if (emptyNotice) {
            emptyNotice.remove();
          }
        });
      });

    } catch (err) {
      console.warn('Faculty loading notice:', err);
      this.renderFacultyCards(container, []);
    }
  },

  renderFacultyCards(container, staffList) {
    if (!staffList || staffList.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12">
          ${UIStates.empty({
            title: 'Faculty Profiles Being Updated',
            message: 'Official faculty and teaching staff records are currently being compiled for Academic Session 2026–27.',
          })}
        </div>
      `;
      return;
    }

    container.innerHTML = staffList.map((member) => {
      const category = member.category || 'Other Teaching Staff';
      return `
        <div data-faculty-cat="${escapeHtml(category.toLowerCase())}" class="academic-card overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1">
          <div class="p-5 flex flex-col items-center text-center">
            <!-- Passport-size Photo -->
            <div class="w-24 h-28 rounded-md bg-school-slate-100 border border-school-slate-300 overflow-hidden flex items-center justify-center text-school-navy font-bold text-lg mb-3 shadow-subtle">
              ${member.photoUrl ? `
                <img src="${escapeHtml(member.photoUrl)}" alt="${escapeHtml(member.name)}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<span class=\\'text-school-slate-400 font-bold\\'>${escapeHtml(member.name.charAt(0))}</span>'" />
              ` : `
                <span class="text-school-slate-400 font-bold text-xl">${member.name ? escapeHtml(member.name.charAt(0)) : 'F'}</span>
              `}
            </div>

            <!-- Category Badge -->
            <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-school-navy-50 text-school-navy border border-school-navy-200 mb-2">
              ${escapeHtml(category)}
            </span>

            <!-- Name & Designation -->
            <h3 class="text-base font-bold text-school-navy font-serif">${escapeHtml(member.name)}</h3>
            <p class="text-xs font-semibold text-school-blue mt-0.5">${escapeHtml(member.designation || 'Staff Member')}</p>

            <!-- Subject (if teaching) -->
            ${member.subject ? `
              <p class="text-xs font-medium text-school-gold mt-1">Subject: <strong>${escapeHtml(member.subject)}</strong></p>
            ` : ''}

            <!-- Qualification -->
            <p class="text-[11px] text-school-slate-500 mt-1.5">${escapeHtml(member.qualification || member.qualifications || 'M.A., B.Ed.')}</p>
          </div>

          <!-- Experience Footer -->
          <div class="px-5 py-3 bg-school-surface-parchment border-t border-school-slate-100 text-[11px] text-school-slate-600 flex items-center justify-between">
            <span>Experience: <strong>${escapeHtml(member.experienceYears || '5+')} Years</strong></span>
            <span class="text-school-slate-400 text-[10px]">L.K.S.K Convent</span>
          </div>
        </div>
      `;
    }).join('');

  },

  getDefaultFaculty() {
    return [];
  }
};
