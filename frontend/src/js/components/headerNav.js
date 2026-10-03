/**
 * Header & Navigation Module
 * Handles Desktop Dropdowns, Mobile Drawer, Keyboard Navigation & Accessibility
 * L.K.S.K Convent School
 */

export function initHeaderNavigation() {
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileDrawerCloseBtn = document.getElementById('mobile-drawer-close');
  const mobileBackdrop = document.getElementById('mobile-drawer-backdrop');
  const headerElement = document.querySelector('header.site-header');

  // 1. Scroll-based Header Elevation
  if (headerElement) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        headerElement.classList.add('shadow-md', 'bg-opacity-95');
      } else {
        headerElement.classList.remove('shadow-md', 'bg-opacity-95');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Desktop Dropdowns with Keyboard & Hover Support
  const dropdownContainers = document.querySelectorAll('.nav-dropdown-container');
  
  dropdownContainers.forEach((container) => {
    const trigger = container.querySelector('.nav-dropdown-trigger');
    const menu = container.querySelector('.nav-dropdown-menu');

    if (!trigger || !menu) return;

    let timeoutId = null;

    const openMenu = () => {
      clearTimeout(timeoutId);
      trigger.setAttribute('aria-expanded', 'true');
      menu.classList.remove('hidden');
      menu.classList.add('block');
      const icon = trigger.querySelector('.dropdown-chevron');
      if (icon) icon.classList.add('rotate-180');
    };

    const closeMenu = () => {
      timeoutId = setTimeout(() => {
        trigger.setAttribute('aria-expanded', 'false');
        menu.classList.add('hidden');
        menu.classList.remove('block');
        const icon = trigger.querySelector('.dropdown-chevron');
        if (icon) icon.classList.remove('rotate-180');
      }, 150);
    };

    container.addEventListener('mouseenter', openMenu);
    container.addEventListener('mouseleave', closeMenu);

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Keyboard navigation within dropdown
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu();
        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      } else if (e.key === 'Escape') {
        closeMenu();
        trigger.focus();
      }
    });

    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
        trigger.focus();
      }
    });
  });

  // Close desktop dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    dropdownContainers.forEach((container) => {
      if (!container.contains(e.target)) {
        const trigger = container.querySelector('.nav-dropdown-trigger');
        const menu = container.querySelector('.nav-dropdown-menu');
        if (trigger && menu) {
          trigger.setAttribute('aria-expanded', 'false');
          menu.classList.add('hidden');
          menu.classList.remove('block');
          const icon = trigger.querySelector('.dropdown-chevron');
          if (icon) icon.classList.remove('rotate-180');
        }
      }
    });
  });

  // 3. Mobile Navigation Drawer
  if (mobileToggleBtn && mobileDrawer) {
    const openMobileDrawer = () => {
      mobileDrawer.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      mobileToggleBtn.setAttribute('aria-expanded', 'true');

      // Animate drawer in
      setTimeout(() => {
        if (mobileBackdrop) mobileBackdrop.classList.remove('opacity-0');
        const drawerPanel = mobileDrawer.querySelector('.mobile-drawer-panel');
        if (drawerPanel) drawerPanel.classList.remove('-translate-x-full');
      }, 10);

      // Focus first focusable item
      if (mobileDrawerCloseBtn) {
        mobileDrawerCloseBtn.focus();
      }
    };

    const closeMobileDrawer = () => {
      if (mobileBackdrop) mobileBackdrop.classList.add('opacity-0');
      const drawerPanel = mobileDrawer.querySelector('.mobile-drawer-panel');
      if (drawerPanel) drawerPanel.classList.add('-translate-x-full');

      mobileToggleBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('overflow-hidden');

      setTimeout(() => {
        mobileDrawer.classList.add('hidden');
        mobileToggleBtn.focus();
      }, 250);
    };

    mobileToggleBtn.addEventListener('click', openMobileDrawer);

    if (mobileDrawerCloseBtn) {
      mobileDrawerCloseBtn.addEventListener('click', closeMobileDrawer);
    }

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', closeMobileDrawer);
    }

    // Escape key closes mobile drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileDrawer.classList.contains('hidden')) {
        closeMobileDrawer();
      }
    });

    // Automatically close mobile drawer when any link or modal trigger inside is clicked
    const drawerActionElements = mobileDrawer.querySelectorAll('a, button[data-modal-target]');
    drawerActionElements.forEach((element) => {
      element.addEventListener('click', () => {
        closeMobileDrawer();
      });
    });

    // Mobile Accordion Dropdowns
    const mobileDropdownTriggers = mobileDrawer.querySelectorAll('.mobile-dropdown-trigger');
    mobileDropdownTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = trigger.getAttribute('data-target');
        const targetContent = document.getElementById(targetId);
        const icon = trigger.querySelector('.mobile-dropdown-icon');
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        if (targetContent) {
          if (isExpanded) {
            targetContent.classList.add('hidden');
            trigger.setAttribute('aria-expanded', 'false');
            if (icon) icon.classList.remove('rotate-180');
          } else {
            targetContent.classList.remove('hidden');
            trigger.setAttribute('aria-expanded', 'true');
            if (icon) icon.classList.add('rotate-180');
          }
        }
      });
    });
  }
}
