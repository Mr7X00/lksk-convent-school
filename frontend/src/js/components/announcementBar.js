/**
 * Announcement Bar Module
 * Dismissible, accessible notice banner for urgent school broadcasts
 * L.K.S.K Convent School
 */

export function initAnnouncementBar() {
  const bar = document.getElementById('announcement-bar');
  const dismissBtn = document.getElementById('dismiss-announcement-btn');

  if (!bar) return;

  const storageKey = 'lksk_announcement_dismissed_v1';
  const isDismissed = sessionStorage.getItem(storageKey);

  if (isDismissed === 'true') {
    bar.classList.add('hidden');
    return;
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      bar.classList.add('transition-all', 'duration-200', 'opacity-0', '-translate-y-full');
      setTimeout(() => {
        bar.classList.add('hidden');
        sessionStorage.setItem(storageKey, 'true');
      }, 200);
    });
  }
}
