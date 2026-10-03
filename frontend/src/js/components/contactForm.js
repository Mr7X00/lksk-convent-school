/**
 * Public Contact Form Module
 * Handles client validation, honeypot spam protection, and asynchronous inquiry submission to /api/contact
 * L.K.S.K Convent School
 */

export function initContactForm() {
  const form = document.getElementById('public-contact-form');
  const responseBox = document.getElementById('contact-form-response');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';

    // Extract form fields
    const nameInput = form.querySelector('#contact-name');
    const emailInput = form.querySelector('#contact-email');
    const phoneInput = form.querySelector('#contact-phone');
    const subjectInput = form.querySelector('#contact-subject');
    const messageInput = form.querySelector('#contact-message');
    const hpInput = form.querySelector('input[name="hp_website"]');

    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const phone = phoneInput?.value.trim() || '';
    const subject = subjectInput?.value.trim();
    const message = messageInput?.value.trim();
    const hpWebsite = hpInput?.value.trim() || '';

    // Clear previous feedback
    if (responseBox) {
      responseBox.classList.add('hidden');
      responseBox.innerHTML = '';
    }

    // Client-side quick checks
    if (!name || name.length < 2) {
      displayError('Please enter your full name (minimum 2 characters).');
      nameInput?.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      displayError('Please enter a valid email address.');
      emailInput?.focus();
      return;
    }

    if (!subject || subject.length < 3) {
      displayError('Please enter a subject (minimum 3 characters).');
      subjectInput?.focus();
      return;
    }

    if (!message || message.length < 10) {
      displayError('Please enter your inquiry message (minimum 10 characters).');
      messageInput?.focus();
      return;
    }

    // Payload with honeypot field
    const payload = {
      name,
      email,
      phone,
      subject,
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
        Sending Message...
      `;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        form.reset();
        if (responseBox) {
          responseBox.classList.remove('hidden');
          responseBox.className = 'p-4 rounded-academic bg-emerald-50 text-emerald-900 text-xs sm:text-sm border border-emerald-200 space-y-1 block';
          responseBox.innerHTML = `
            <div class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <p class="font-bold">Thank you for contacting L.K.S.K Convent School.</p>
                <p class="text-xs text-emerald-800">We have received your message and will get back to you as soon as possible.</p>
              </div>
            </div>
          `;
          responseBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        const errorMsg = data.errors && data.errors.length > 0
          ? data.errors.map((e) => e.message || e.msg).join(' ')
          : (data.message || 'Unable to process your request right now. Please try again later.');
        displayError(errorMsg);
      }
    } catch {
      displayError('Unable to connect to the school server. Please verify your internet connection or reach our office directly.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });

  function displayError(msg) {
    if (responseBox) {
      responseBox.classList.remove('hidden');
      responseBox.className = 'p-4 rounded-academic bg-rose-50 text-rose-900 text-xs sm:text-sm border border-rose-200 block';
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
}
