/**
 * Floating Actions & External Communication Integrations
 * Dynamically configures WhatsApp floating trigger and social links from /api/settings
 * Fallback to official school WhatsApp: 8127746334
 * L.K.S.K Convent School
 */

export async function initFloatingActions() {
  const whatsappFloatingBtn = document.getElementById('whatsapp-floating-btn');
  const defaultNumber = '918127746334';
  const defaultMsg = 'Hello, I would like to inquire about admission at L.K.S.K Convent School for session 2026–27.';

  let activeNumber = defaultNumber;
  let activeMsg = defaultMsg;

  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const json = await res.json();
      const settings = json.data || {};
      const contact = settings.contactDetails || {};
      const whatsAppConfig = settings.whatsApp || {};
      const social = settings.socialLinks || {};

      const rawNumber = whatsAppConfig.number || contact.phone || '';
      if (rawNumber && !rawNumber.toLowerCase().includes('todo') && rawNumber.replace(/\D/g, '').length >= 10) {
        let clean = rawNumber.replace(/\D/g, '');
        if (clean.length === 10) clean = '91' + clean;
        activeNumber = clean;
      }

      if (whatsAppConfig.defaultMessage) {
        activeMsg = whatsAppConfig.defaultMessage;
      }

      syncSocialLinks(social);
    } else {
      syncSocialLinks({});
    }
  } catch (err) {
    console.debug('Floating actions sync notice:', err.message);
    syncSocialLinks({});
  }

  // Always ensure WhatsApp floating button is active & visible the whole time (8127746334)
  if (whatsappFloatingBtn) {
    const encodedMsg = encodeURIComponent(activeMsg);
    const waUrl = `https://wa.me/${activeNumber}?text=${encodedMsg}`;

    whatsappFloatingBtn.href = waUrl;
    whatsappFloatingBtn.setAttribute('aria-label', 'Chat with L.K.S.K Convent School on WhatsApp');
    whatsappFloatingBtn.setAttribute('target', '_blank');
    whatsappFloatingBtn.setAttribute('rel', 'noopener noreferrer');
    whatsappFloatingBtn.classList.remove('hidden');
    whatsappFloatingBtn.parentElement?.classList.remove('hidden');
  }

  // Update any page-level WhatsApp action triggers
  document.querySelectorAll('[data-whatsapp-action]').forEach((el) => {
    const encodedMsg = encodeURIComponent(activeMsg);
    el.href = `https://wa.me/${activeNumber}?text=${encodedMsg}`;
    el.classList.remove('hidden');
  });

  // Scroll-triggered visibility for Social Rail (Show only after scrolling to Facilities Section)
  const socialRail = document.getElementById('floating-social-rail');
  const facilitiesSection = document.getElementById('facilities-section');

  if (socialRail) {
    const updateRailVisibility = () => {
      if (facilitiesSection) {
        const rect = facilitiesSection.getBoundingClientRect();
        // Show once the top of facilities section reaches 80% of viewport height
        if (rect.top <= window.innerHeight * 0.8) {
          socialRail.classList.remove('opacity-0', 'pointer-events-none', 'translate-x-full');
          socialRail.classList.add('opacity-100', 'pointer-events-auto', 'translate-x-0');
        } else {
          socialRail.classList.add('opacity-0', 'pointer-events-none', 'translate-x-full');
          socialRail.classList.remove('opacity-100', 'pointer-events-auto', 'translate-x-0');
        }
      } else {
        // Fallback for subpages without facilities section
        if (window.scrollY > 450) {
          socialRail.classList.remove('opacity-0', 'pointer-events-none', 'translate-x-full');
          socialRail.classList.add('opacity-100', 'pointer-events-auto', 'translate-x-0');
        } else {
          socialRail.classList.add('opacity-0', 'pointer-events-none', 'translate-x-full');
          socialRail.classList.remove('opacity-100', 'pointer-events-auto', 'translate-x-0');
        }
      }
    };

    window.addEventListener('scroll', updateRailVisibility, { passive: true });
    updateRailVisibility();
  }
}

function syncSocialLinks(social = {}) {
  const defaults = {
    facebook: 'https://facebook.com/lkskconventschool',
    instagram: 'https://instagram.com/lkskconventschool',
    youtube: 'https://youtube.com/@lkskconventschool',
    whatsapp: 'https://wa.me/918127746334?text=Hello%20L.K.S.K%20Convent%20School',
  };

  const networks = [
    { key: 'facebook', selector: '[data-social="facebook"]' },
    { key: 'instagram', selector: '[data-social="instagram"]' },
    { key: 'youtube', selector: '[data-social="youtube"]' },
    { key: 'whatsapp', selector: '[data-social="whatsapp"]' },
  ];

  networks.forEach(({ key, selector }) => {
    const url = social[key]?.trim() || defaults[key];
    document.querySelectorAll(selector).forEach((el) => {
      el.href = url;
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
      el.classList.remove('hidden');
    });
  });
}
