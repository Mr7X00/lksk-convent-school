/**
 * Website Institutional & Communication Settings CMS View
 * Controls School Master Records, Contact Channels, WhatsApp, Google Maps, Social Links, and Admission Popup
 * L.K.S.K Convent School
 */

import { AdminAuth } from '../../adminAuth.js';
import { showToast } from '../components/toast.js';

export async function renderSettings(container) {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in max-w-4xl">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Institutional &amp; Communication Settings</h2>
          <p class="text-xs sm:text-sm text-slate-500">Manage school master data, contact channels, WhatsApp, Google Maps, and admission popups</p>
        </div>
      </div>

      <form id="settings-cms-form" class="space-y-6 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
        
        <!-- 1. General Identity -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <svg class="w-4 h-4 text-school-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            Institutional Identity
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">School Name *</label>
              <input type="text" name="schoolName" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Motto / Tagline</label>
              <input type="text" name="tagline" placeholder="e.g. Excellence in Character & Learning" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Affiliation Number</label>
              <input type="text" name="affiliationNumber" placeholder="State / National Board Affiliation Code" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">School Code</label>
              <input type="text" name="schoolCode" placeholder="State / District Registration Code" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Established Year</label>
              <input type="number" name="establishedYear" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <!-- 2. Official Contact Records & Maps -->
        <div class="space-y-4 pt-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            Official Contact Records &amp; Location
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Primary Contact Phone</label>
              <input type="text" name="phone" placeholder="e.g. +91 94523 00000" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Alternate / Landline Phone</label>
              <input type="text" name="alternatePhone" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">Official Email Address *</label>
              <input type="email" name="email" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">Postal Address *</label>
              <input type="text" name="address" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Postal PIN Code</label>
              <input type="text" name="pinCode" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Google Maps Direct URL</label>
              <input type="url" name="googleMapsUrl" placeholder="https://maps.google.com/..." class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">Google Maps Embed URL (iframe src)</label>
              <input type="url" name="googleMapsEmbedUrl" placeholder="https://www.google.com/maps/embed?pb=..." class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              <p class="text-[11px] text-slate-400 mt-1">Paste the iframe embed URL from Google Maps to display an interactive map on the contact page.</p>
            </div>
          </div>
        </div>

        <!-- 3. WhatsApp Integration -->
        <div class="space-y-4 pt-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.199.534 1.286.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.177.181-.076.355.101.173.449.741.963 1.199.662.59 1.221.774 1.394.86.173.086.274.072.375-.043s.433-.505.549-.679c.116-.174.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.434 5.177L2 22l4.97-1.303C8.423 21.522 10.153 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"></path></svg>
            WhatsApp Live Support &amp; Floating Button
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">WhatsApp Business Number</label>
              <input type="text" name="whatsAppNumber" placeholder="e.g. 918127746334" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              <p class="text-[11px] text-slate-400 mt-1">Leave blank to gracefully hide the floating WhatsApp button until a number is assigned.</p>
            </div>
            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">WhatsApp Default Greeting Message</label>
              <textarea name="whatsAppDefaultMessage" rows="2" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
            </div>
          </div>
        </div>

        <!-- 4. Social Media Channels -->
        <div class="space-y-4 pt-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            Social Channels
          </h3>
          <p class="text-[11px] text-slate-400">Empty URLs will be hidden automatically on public pages.</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Facebook URL</label>
              <input type="url" name="facebook" placeholder="https://facebook.com/..." class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">YouTube URL</label>
              <input type="url" name="youtube" placeholder="https://youtube.com/..." class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Instagram URL</label>
              <input type="url" name="instagram" placeholder="https://instagram.com/..." class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Twitter / X URL</label>
              <input type="url" name="twitter" placeholder="https://twitter.com/..." class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <!-- 5. Admission Popup / Banner Settings -->
        <div class="space-y-4 pt-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
              Admission Open Popup / Banner Campaign
            </h3>
            <label class="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input type="checkbox" name="popupEnabled" class="rounded text-school-blue focus:ring-blue-500 h-4 w-4" />
              <span>Enable Popup on Site</span>
            </label>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Campaign Title *</label>
              <input type="text" name="popupTitle" placeholder="Admission Open — 2026–27" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Admission Session</label>
              <input type="text" name="popupSession" placeholder="2026–27" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>

            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">Subtitle / Campaign Message</label>
              <textarea name="popupSubtitle" rows="2" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Primary CTA Button Text</label>
              <input type="text" name="popupCtaText" placeholder="Apply for Admission" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Primary CTA Target Link</label>
              <input type="text" name="popupCtaUrl" placeholder="/academic/admission-inquiry" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Secondary Button Text</label>
              <input type="text" name="popupSecondaryCtaText" placeholder="Admission Process" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Secondary Target Link</label>
              <input type="text" name="popupSecondaryCtaUrl" placeholder="/academic/admission-process" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Campaign Start Date</label>
              <input type="date" name="popupStartDate" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Campaign End Date</label>
              <input type="date" name="popupEndDate" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Display Frequency</label>
              <select name="popupFrequency" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="once_per_day">Once per Day (Recommended)</option>
                <option value="once_per_session">Once per Browser Session</option>
                <option value="once_per_week">Once per Week</option>
                <option value="always">Always on Every Page Load</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Banner Image URL (Optional)</label>
              <input type="text" name="popupImageUrl" placeholder="/assets/hero/banner.jpg" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <!-- 6. SEO Metadata -->
        <div class="space-y-4 pt-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            Search Engine Optimization (SEO)
          </h3>
          <div class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Homepage Meta Title</label>
              <input type="text" name="metaTitle" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Homepage Meta Description</label>
              <textarea name="metaDescription" rows="2" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
            </div>
          </div>
        </div>

        <div class="pt-4 flex justify-end">
          <button type="submit" id="save-settings-btn" class="px-5 py-2.5 bg-school-blue hover:bg-blue-600 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  `;

  const form = container.querySelector('#settings-cms-form');

  // Load existing settings
  try {
    const res = await fetch('/api/settings');
    const json = await res.json();
    if (json.success && json.data) {
      const d = json.data;
      form.schoolName.value = d.schoolName || '';
      form.tagline.value = d.tagline || '';
      form.affiliationNumber.value = d.affiliationNumber || '';
      form.schoolCode.value = d.schoolCode || '';
      form.establishedYear.value = d.establishedYear || 2017;

      const c = d.contactDetails || {};
      form.phone.value = c.phone || '';
      form.alternatePhone.value = c.alternatePhone || '';
      form.email.value = c.email || '';
      form.address.value = c.address || '';
      form.pinCode.value = c.pinCode || '';
      form.googleMapsUrl.value = c.googleMapsUrl || '';
      form.googleMapsEmbedUrl.value = c.googleMapsEmbedUrl || '';

      const wa = d.whatsApp || {};
      form.whatsAppNumber.value = wa.number || '';
      form.whatsAppDefaultMessage.value = wa.defaultMessage || 'Hello, welcome to L.K.S.K Convent School. Thank you for contacting us. How may we help you with admissions, academics, school information, or any other query?';

      const s = d.socialLinks || {};
      form.facebook.value = s.facebook || '';
      form.youtube.value = s.youtube || '';
      form.instagram.value = s.instagram || '';
      form.twitter.value = s.twitter || '';

      const pop = d.admissionPopup || {};
      form.popupEnabled.checked = pop.enabled !== false;
      form.popupTitle.value = pop.title || 'Admission Open — 2026–27';
      form.popupSession.value = pop.session || '2026–27';
      form.popupSubtitle.value = pop.subtitle || 'Registrations are open for Nursery to Class XII. Secure your child\'s academic journey with excellence at L.K.S.K Convent School.';
      form.popupCtaText.value = pop.ctaText || 'Apply for Admission';
      form.popupCtaUrl.value = pop.ctaUrl || '/academic/admission-inquiry';
      form.popupSecondaryCtaText.value = pop.secondaryCtaText || 'Admission Process';
      form.popupSecondaryCtaUrl.value = pop.secondaryCtaUrl || '/academic/admission-process';
      form.popupStartDate.value = pop.startDate ? new Date(pop.startDate).toISOString().slice(0, 10) : '';
      form.popupEndDate.value = pop.endDate ? new Date(pop.endDate).toISOString().slice(0, 10) : '';
      form.popupFrequency.value = pop.displayFrequency || 'once_per_day';
      form.popupImageUrl.value = pop.imageUrl || '';

      form.metaTitle.value = d.metaTitle || '';
      form.metaDescription.value = d.metaDescription || '';
    }
  } catch (err) {
    showToast('Failed to load current settings: ' + err.message, 'error');
  }

  // Handle Save
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('#save-settings-btn');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    const payload = {
      schoolName: form.schoolName.value.trim(),
      tagline: form.tagline.value.trim(),
      affiliationNumber: form.affiliationNumber.value.trim(),
      schoolCode: form.schoolCode.value.trim(),
      establishedYear: Number(form.establishedYear.value),
      contactDetails: {
        phone: form.phone.value.trim(),
        alternatePhone: form.alternatePhone.value.trim(),
        email: form.email.value.trim(),
        address: form.address.value.trim(),
        pinCode: form.pinCode.value.trim(),
        googleMapsUrl: form.googleMapsUrl.value.trim(),
        googleMapsEmbedUrl: form.googleMapsEmbedUrl.value.trim(),
      },
      whatsApp: {
        number: form.whatsAppNumber.value.trim(),
        defaultMessage: form.whatsAppDefaultMessage.value.trim(),
      },
      socialLinks: {
        facebook: form.facebook.value.trim(),
        youtube: form.youtube.value.trim(),
        instagram: form.instagram.value.trim(),
        twitter: form.twitter.value.trim(),
      },
      admissionPopup: {
        enabled: form.popupEnabled.checked,
        title: form.popupTitle.value.trim(),
        session: form.popupSession.value.trim(),
        subtitle: form.popupSubtitle.value.trim(),
        ctaText: form.popupCtaText.value.trim(),
        ctaUrl: form.popupCtaUrl.value.trim(),
        secondaryCtaText: form.popupSecondaryCtaText.value.trim(),
        secondaryCtaUrl: form.popupSecondaryCtaUrl.value.trim(),
        startDate: form.popupStartDate.value ? new Date(form.popupStartDate.value) : null,
        endDate: form.popupEndDate.value ? new Date(form.popupEndDate.value) : null,
        displayFrequency: form.popupFrequency.value,
        imageUrl: form.popupImageUrl.value.trim(),
      },
      metaTitle: form.metaTitle.value.trim(),
      metaDescription: form.metaDescription.value.trim(),
    };

    try {
      const res = await AdminAuth.authFetch('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Website and communication settings saved successfully!');
      } else {
        showToast(json.message || 'Error updating settings', 'error');
      }
    } catch (err) {
      showToast('Network error: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<svg class="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Save All Settings';
    }
  });
}
