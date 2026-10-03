/**
 * Academic Pages Controller
 * Coordinates Toppers, Achievements, Notices, Documents, and Admission Inquiries
 * Connects with /api/achievements, /api/notices, /api/documents, and /api/admissions
 * L.K.S.K Convent School
 */

import { UIStates } from '../components/uiStates.js';
import { openLightboxWithImages } from '../components/lightbox.js';
import { escapeHtml, sanitizeUrl } from '../utils/sanitize.js';

export const AcademicController = {

  /**
   * Initializes Notices Board page
   */
  async initNoticesPage() {
    const listContainer = document.getElementById('notices-list-container');
    const searchInput = document.getElementById('notice-search-input');
    const categorySelect = document.getElementById('notice-category-filter');

    if (!listContainer) return;

    listContainer.innerHTML = UIStates.loading('notice', { count: 4 });

    try {
      const response = await fetch('/api/notices');
      const data = await response.json();
      const notices = (response.ok && data.success && Array.isArray(data.data?.notices)) ? data.data.notices : [];

      if (notices.length === 0) {
        listContainer.innerHTML = UIStates.empty({
          title: 'No Circulars Currently Published',
          message: 'Official academic notices for this term will be posted here as soon as released by the principal desk.',
        });
        return;
      }

      const renderNotices = (items) => {
        if (items.length === 0) {
          listContainer.innerHTML = UIStates.empty({
            title: 'No Matching Circulars',
            message: 'No notices matched your keyword or category filter.',
          });
          return;
        }

        listContainer.innerHTML = items.map((n) => `
          <article class="academic-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-transform duration-200 hover:-translate-y-0.5">
            <div class="space-y-1.5 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-school-blue border border-blue-200">
                  ${escapeHtml(n.category || 'General Notice')}
                </span>
                ${n.isUrgent ? `
                  <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                    Urgent
                  </span>
                ` : ''}
                <time class="text-xs text-school-slate-500" datetime="${n.createdAt || new Date().toISOString()}">
                  ${new Date(n.publishDate || n.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </time>
              </div>
              <h3 class="text-base font-bold text-school-navy">${escapeHtml(n.title)}</h3>
              <p class="text-xs text-school-slate-600 leading-relaxed">${escapeHtml(n.content || '')}</p>
            </div>
            ${n.attachmentUrl ? `
              <div class="shrink-0">
                <a href="${sanitizeUrl(n.attachmentUrl)}" target="_blank" rel="noopener noreferrer" class="btn-academic-secondary btn-academic-sm">
                  <span>Download PDF</span>
                  <svg class="w-3.5 h-3.5 ml-1.5 text-school-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </a>
              </div>
            ` : ''}
          </article>
        `).join('');

      };

      renderNotices(notices);

      const applyFilters = () => {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const category = categorySelect ? categorySelect.value : '';

        const filtered = notices.filter(n => {
          const matchQuery = !query || n.title.toLowerCase().includes(query) || (n.content && n.content.toLowerCase().includes(query));
          const matchCategory = !category || n.category === category;
          return matchQuery && matchCategory;
        });

        renderNotices(filtered);
      };

      if (searchInput) searchInput.addEventListener('input', applyFilters);
      if (categorySelect) categorySelect.addEventListener('change', applyFilters);

    } catch (err) {
      listContainer.innerHTML = UIStates.empty({
        title: 'Notice Board Synchronization Pending',
        message: 'Administrative circulars will be displayed here once connected to live server.',
      });
    }
  },

  /**
   * Initializes Toppers & Merit Hall page
   */
  async initToppersPage() {
    const container = document.getElementById('toppers-grid');
    const filterButtons = document.querySelectorAll('.topper-filter-btn');

    if (!container) return;

    container.innerHTML = `
      <div class="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${UIStates.loading('topper', { count: 4 })}
      </div>
    `;

    try {
      const response = await fetch('/api/achievements/toppers');
      const data = await response.json();
      const toppers = (response.ok && data.success && Array.isArray(data.data))
        ? data.data
        : [];

      // Administrator-defined ordering
      toppers.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      this.renderToppers(container, toppers);

      // Session filter
      filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          filterButtons.forEach(b => {
            b.classList.remove('bg-school-navy', 'text-white');
            b.classList.add('bg-white', 'text-school-slate-700');
          });
          btn.classList.remove('bg-white', 'text-school-slate-700');
          btn.classList.add('bg-school-navy', 'text-white');

          const session = btn.getAttribute('data-session-filter');
          const cards = container.querySelectorAll('[data-topper-session]');
          let visibleCount = 0;

          cards.forEach(card => {
            const cardSession = card.getAttribute('data-topper-session');
            if (session === 'all' || cardSession === session) {
              card.classList.remove('hidden');
              visibleCount++;
            } else {
              card.classList.add('hidden');
            }
          });

          const emptyNotice = document.getElementById('toppers-empty-notice');
          if (visibleCount === 0) {
            if (!emptyNotice) {
              const notice = document.createElement('div');
              notice.id = 'toppers-empty-notice';
              notice.className = 'col-span-full py-12';
              notice.innerHTML = UIStates.empty({
                title: 'No Topper Records in Selected Session',
                message: 'Records for this session will be uploaded upon official board marksheet verification.',
              });
              container.appendChild(notice);
            }
          } else if (emptyNotice) {
            emptyNotice.remove();
          }
        });
      });

    } catch {
      this.renderToppers(container, []);
    }
  },

  renderToppers(container, items) {
    if (!items || items.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12">
          ${UIStates.empty({
            title: 'Topper Records Under Verification',
            message: 'Board examination merit rankings are updated annually upon declaration of official results.',
          })}
        </div>
      `;
      return;
    }

    container.innerHTML = items.map((topper) => {
      const session = topper.academicYear || topper.academicSession || '2025–2026';
      const grade = topper.classGrade || topper.examType || topper.examName || 'Class 10';
      const score = topper.percentageOrScore || (topper.percentage ? `${topper.percentage}%` : 'Distinction');
      const honor = topper.achievement || (topper.rank ? `Rank #${topper.rank} in Board` : 'School First Position');

      return `
        <div data-topper-session="${escapeHtml(session)}" class="academic-card p-5 sm:p-6 flex flex-col justify-between items-center text-center transition-transform duration-200 hover:-translate-y-1">
          <div class="flex flex-col items-center w-full">
            <!-- Photograph -->
            <div class="w-20 h-24 rounded-md bg-school-slate-100 border border-school-slate-300 overflow-hidden flex items-center justify-center text-school-navy font-bold text-lg mb-3 shadow-subtle">
              ${topper.photoUrl ? `
                <img src="${escapeHtml(topper.photoUrl)}" alt="${escapeHtml(topper.studentName)}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<span class=\\'text-school-slate-400 font-bold\\'>${escapeHtml(topper.studentName ? topper.studentName.charAt(0) : 'T')}</span>'" />
              ` : `
                <span class="text-school-slate-400 font-bold text-xl">${topper.studentName ? escapeHtml(topper.studentName.charAt(0)) : 'T'}</span>
              `}
            </div>

            <!-- Percentage / Grade Badge -->
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
              ${escapeHtml(score)}
            </span>

            <!-- Name, Class & Session -->
            <h3 class="text-base font-bold text-school-navy font-serif">${escapeHtml(topper.studentName)}</h3>
            <p class="text-xs font-semibold text-school-gold mt-0.5">${escapeHtml(grade)} ${topper.stream ? `(${escapeHtml(topper.stream)})` : ''}</p>
            <p class="text-xs text-school-slate-500 mt-1">Session ${escapeHtml(session)}</p>
          </div>

          <!-- Achievement -->
          <div class="mt-4 pt-3 border-t border-school-slate-100 w-full text-xs text-school-slate-700">
            <span class="text-school-slate-400 block text-[11px]">Achievement:</span>
            <strong class="text-school-navy">${escapeHtml(honor)}</strong>
          </div>
        </div>
      `;
    }).join('');

  },

  getDefaultToppers() {
    return [];
  },

  /**
   * Initializes Achievements page
   */
  async initAchievementsPage() {
    const container = document.getElementById('achievements-grid');
    const filterButtons = document.querySelectorAll('.achievement-filter-btn');

    if (!container) return;

    container.innerHTML = `
      <div class="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${UIStates.skeletonCard(3)}
      </div>
    `;

    try {
      const response = await fetch('/api/achievements');
      const data = await response.json();
      const achievements = (response.ok && data.success && Array.isArray(data.data))
        ? data.data
        : [];

      achievements.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      this.renderAchievements(container, achievements);

      // Category Filtering
      filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          filterButtons.forEach(b => {
            b.classList.remove('bg-school-navy', 'text-white');
            b.classList.add('bg-white', 'text-school-slate-700');
          });
          btn.classList.remove('bg-white', 'text-school-slate-700');
          btn.classList.add('bg-school-navy', 'text-white');

          const category = btn.getAttribute('data-achievement-cat');
          const cards = container.querySelectorAll('[data-ach-cat]');
          let visibleCount = 0;

          cards.forEach(card => {
            const cardCat = card.getAttribute('data-ach-cat');
            if (category === 'all' || cardCat.toLowerCase() === category.toLowerCase()) {
              card.classList.remove('hidden');
              visibleCount++;
            } else {
              card.classList.add('hidden');
            }
          });

          const emptyNotice = document.getElementById('achievements-empty-notice');
          if (visibleCount === 0) {
            if (!emptyNotice) {
              const notice = document.createElement('div');
              notice.id = 'achievements-empty-notice';
              notice.className = 'col-span-full py-12';
              notice.innerHTML = UIStates.empty({
                title: 'No Achievements in Selected Category',
                message: 'Distinctions for this category will be updated as competitions conclude.',
              });
              container.appendChild(notice);
            }
          } else if (emptyNotice) {
            emptyNotice.remove();
          }
        });
      });    } catch {
      this.renderAchievements(container, []);
    }
  },

  renderAchievements(container, items) {
    if (!items || items.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12">
          ${UIStates.empty({
            title: 'Achievements Record',
            message: 'Institutional honors, inter-school awards, and athletic medals are compiled here.',
          })}
        </div>
      `;
      return;
    }

    const lightboxImages = items
      .filter(item => item.photoUrl || item.imageUrl)
      .map(item => ({
        src: item.photoUrl || item.imageUrl,
        caption: `${item.achievement || item.title} — ${item.student || item.studentName || item.recipient || 'Student'}`,
      }));

    container.innerHTML = items.map((item, idx) => {
      const student = item.student || item.studentName || item.recipient || 'Student';
      const studentClass = item.studentClass || '';
      const honor = item.achievement || item.title;
      const eventName = item.event || item.level || 'Inter-School Championship';
      const year = item.year || new Date(item.date || Date.now()).getFullYear();
      const photo = item.photoUrl || item.imageUrl;
      const category = item.category || 'Academic';

      return `
        <article data-ach-cat="${escapeHtml(category.toLowerCase())}" class="academic-card overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1">
          <div>
            ${photo ? `
              <div class="relative aspect-video bg-school-slate-100 overflow-hidden cursor-pointer ach-photo-preview" data-photo="${escapeHtml(photo)}" data-title="${escapeHtml(honor)}">
                <img src="${escapeHtml(photo)}" alt="${escapeHtml(honor)}" loading="lazy" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" onerror="this.src='/assets/branding/new%20logo%20transparent.png'" />
                <span class="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-school-gold text-white">
                  ${escapeHtml(category)}
                </span>
                <div class="absolute inset-0 bg-school-navy-950/20 hover:bg-transparent transition-colors"></div>
              </div>
            ` : `
              <div class="p-3 bg-school-slate-50 border-b border-school-slate-100 flex items-center justify-between">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-school-navy-50 text-school-navy border border-school-navy-200">
                  ${escapeHtml(category)}
                </span>
                <span class="text-xs text-school-slate-400 font-medium">${escapeHtml(year)}</span>
              </div>
            `}

            <div class="p-5 space-y-2">
              <div class="flex items-center justify-between text-xs text-school-slate-500">
                <span class="font-medium text-school-blue">${escapeHtml(eventName)}</span>
                <span>${escapeHtml(year)}</span>
              </div>
              <h3 class="text-base font-bold text-school-navy font-serif leading-snug">${escapeHtml(honor)}</h3>
              <p class="text-xs text-school-slate-600 leading-relaxed">${escapeHtml(item.description || '')}</p>
            </div>
          </div>

          <!-- Student & Class Footer -->
          <div class="px-5 py-3 bg-school-surface-parchment border-t border-school-slate-100 flex items-center justify-between text-xs text-school-slate-600">
            <span>Student: <strong class="text-school-navy">${escapeHtml(student)}</strong></span>
            ${studentClass ? `<span class="text-school-slate-500 font-medium">${escapeHtml(studentClass)}</span>` : ''}
          </div>
        </article>
      `;
    }).join('');

    // Wire lightbox on achievement photos
    container.querySelectorAll('.ach-photo-preview').forEach(el => {
      el.addEventListener('click', () => {
        const src = el.dataset.photo;
        const caption = el.dataset.title;
        openLightboxWithImages([{ src, caption }], 0);
      });
    });
  },

  getDefaultAchievements() {
    return [];
  },

  /**
   * Initializes Admission Inquiry Page & Form
   */
  initAdmissionInquiryPage() {
    const form = document.getElementById('page-admission-inquiry-form');
    const responseBox = document.getElementById('page-inquiry-response');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit Inquiry';

      const studentName = form.querySelector('#inq-student-name')?.value.trim();
      const dob = form.querySelector('#inq-dob')?.value;
      const gender = form.querySelector('#inq-gender')?.value || 'unspecified';
      const classSeeking = form.querySelector('#inq-class')?.value;
      const parentName = form.querySelector('#inq-parent-name')?.value.trim();
      const phone = form.querySelector('#inq-phone')?.value.trim();
      const email = form.querySelector('#inq-email')?.value.trim();
      const address = form.querySelector('#inq-address')?.value.trim() || '';
      const message = form.querySelector('#inq-message')?.value.trim() || '';
      const hpWebsite = form.querySelector('input[name="hp_website"]')?.value.trim() || '';

      // Reset response box
      if (responseBox) {
        responseBox.className = 'hidden';
        responseBox.innerHTML = '';
      }

      // Quick Client Checks
      if (!studentName || studentName.length < 2) {
        showError('Please provide the student\'s full name (at least 2 characters).');
        form.querySelector('#inq-student-name')?.focus();
        return;
      }

      if (!parentName || parentName.length < 2) {
        showError('Please provide the parent or guardian\'s name (at least 2 characters).');
        form.querySelector('#inq-parent-name')?.focus();
        return;
      }

      const phoneRegex = /^[0-9+\-\s()]{8,18}$/;
      if (!phone || !phoneRegex.test(phone)) {
        showError('Please enter a valid 10-digit mobile or contact phone number.');
        form.querySelector('#inq-phone')?.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showError('Please provide a valid email address.');
        form.querySelector('#inq-email')?.focus();
        return;
      }

      if (!classSeeking) {
        showError('Please select the grade or class seeking admission.');
        form.querySelector('#inq-class')?.focus();
        return;
      }

      const payload = {
        studentName,
        dateOfBirth: dob || null,
        dob: dob || null,
        gender,
        classSeeking,
        gradeApplying: classSeeking,
        parentName,
        phone,
        email,
        address,
        message,
        hp_website: hpWebsite,
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting Inquiry...
        `;
      }

      try {
        const response = await fetch('/api/admissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          form.reset();
          if (responseBox) {
            responseBox.className = 'p-6 rounded-academic bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-medium space-y-2 block';
            responseBox.innerHTML = `
              <div class="flex items-start space-x-3">
                <svg class="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="space-y-1">
                  <p class="text-base font-bold text-emerald-950 font-serif">Admission Inquiry Submitted Successfully!</p>
                  <p class="text-xs text-emerald-800">
                    Thank you, <strong>${escapeHtml(payload.parentName)}</strong>. We have received the admission inquiry for <strong>${escapeHtml(payload.studentName)}</strong> (${escapeHtml(payload.classSeeking)}).
                  </p>
                  <p class="text-[11px] text-emerald-700 pt-1">
                    Application Reference: <span class="font-mono font-bold">${data.data?.referenceId || data.data?.id || 'SUB-' + Date.now().toString().slice(-6)}</span>
                  </p>
                  <p class="text-xs text-emerald-800 pt-1">
                    Our admissions office at Panditpur, Sohawal, Ayodhya will review the details and reach out to you directly via phone or email.
                  </p>
                </div>
              </div>
            `;
            responseBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else {
          const errMsg = data.errors && data.errors.length > 0
            ? data.errors.map(e => e.message || e.msg).join(' ')
            : (data.message || 'Submission failed. Please verify the information entered.');
          showError(errMsg);
        }
      } catch (err) {
        showError(err.message || 'Unable to submit your application. Please check your internet connection or call our office directly.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });

    function showError(msg) {
      if (responseBox) {
        responseBox.className = 'p-4 rounded-academic bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm font-medium space-y-1 block';
        responseBox.innerHTML = `
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>${msg}</span>
          </div>
        `;
        responseBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
  },
};

