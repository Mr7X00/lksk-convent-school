/**
 * Responsive School Video Module
 * Accessible video player with custom poster, play trigger, and sound-safe playback
 * L.K.S.K Convent School
 */

export function initVideoSection() {
  const videoWrapper = document.getElementById('school-video-wrapper');
  if (!videoWrapper) return;

  const video = videoWrapper.querySelector('video');
  const soundToggleBtn = document.getElementById('video-sound-toggle');
  const soundMutedIcon = document.getElementById('sound-icon-muted');
  const soundUnmutedIcon = document.getElementById('sound-icon-unmuted');
  const soundToggleText = document.getElementById('sound-toggle-text');

  if (!video) return;

  // Ensure autoplay starts (muted)
  const ensureAutoplay = () => {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback, retry on first interaction
        const startOnUserInteraction = () => {
          video.play().catch(() => {});
          document.removeEventListener('click', startOnUserInteraction);
          document.removeEventListener('touchstart', startOnUserInteraction);
        };
        document.addEventListener('click', startOnUserInteraction, { once: true });
        document.addEventListener('touchstart', startOnUserInteraction, { once: true });
      });
    }
  };

  ensureAutoplay();

  // Sound Toggle Handler
  if (soundToggleBtn) {
    const updateSoundUI = () => {
      const isMuted = video.muted;
      if (soundMutedIcon && soundUnmutedIcon) {
        if (isMuted) {
          soundMutedIcon.classList.remove('hidden');
          soundUnmutedIcon.classList.add('hidden');
          if (soundToggleText) soundToggleText.textContent = 'Unmute';
        } else {
          soundMutedIcon.classList.add('hidden');
          soundUnmutedIcon.classList.remove('hidden');
          if (soundToggleText) soundToggleText.textContent = 'Mute';
        }
      }
    };

    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      if (!video.muted && video.paused) {
        video.play().catch(() => {});
      }
      updateSoundUI();
    });

    updateSoundUI();
  }

  // Click on video to toggle play/pause
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}
