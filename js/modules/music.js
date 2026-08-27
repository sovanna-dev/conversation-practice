/**
 * Background Music Module
 * Handles music playback, volume, and fading effects.
 */

let fadeInterval = null;

export function initMusic(audioElementId, controlsIds) {
  const bgMusic = document.getElementById(audioElementId);
  const { fileInputId, toggleBtnId, volumeInputId, volumeLabelId, hintId, controlsContainerId } = controlsIds;

  const fileInput = document.getElementById(fileInputId);
  const toggleBtn = document.getElementById(toggleBtnId);
  const volumeInput = document.getElementById(volumeInputId);
  const volumeLabel = document.getElementById(volumeLabelId);
  const hint = document.getElementById(hintId);
  const controlsContainer = document.getElementById(controlsContainerId);

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      bgMusic.src = url;
      if (controlsContainer) controlsContainer.style.display = 'flex';
      if (hint) hint.textContent = 'Loaded: ' + file.name;
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.volume = parseFloat(volumeInput.value);
        bgMusic.play();
        toggleBtn.textContent = '⏸ Pause';
        toggleBtn.classList.add('playing');
      } else {
        bgMusic.pause();
        toggleBtn.textContent = '▶ Play';
        toggleBtn.classList.remove('playing');
      }
    });
  }

  if (volumeInput) {
    volumeInput.addEventListener('input', () => {
      bgMusic.volume = parseFloat(volumeInput.value);
      if (volumeLabel) volumeLabel.textContent = Math.round(bgMusic.volume * 100) + '%';
    });
  }
}

export function fadeMusic(audioElementId, targetVol, duration) {
  const bgMusic = document.getElementById(audioElementId);
  if (!bgMusic || !bgMusic.src) return;

  clearInterval(fadeInterval);
  if (targetVol > 0 && bgMusic.paused) {
    bgMusic.play().catch(e => console.warn("Music play blocked by browser", e));
  }

  const startVol = bgMusic.volume;
  const steps = 20;
  const stepTime = duration / steps;
  let i = 0;

  fadeInterval = setInterval(() => {
    i++;
    bgMusic.volume = Math.max(0, Math.min(1, startVol + (targetVol - startVol) * (i / steps)));
    if (i >= steps) {
      clearInterval(fadeInterval);
      if (targetVol <= 0.001) bgMusic.pause();
    }
  }, stepTime);
}
