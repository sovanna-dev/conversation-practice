export const renderDialogue = (lines, container) => {
  if (!container) return;
  container.innerHTML = '';

  lines.forEach((line, i) => {
    const lineEl = document.createElement('div');
    lineEl.className = `line speaker-${line.speaker?.toLowerCase() || 'a'} active`;

    const enText = line.text || line.en || '';
    const wrappedEn = wrapWords(enText);

    lineEl.innerHTML = `
      <div class="avatar">${line.speaker || '👤'}</div>
      <div class="bubble">
        <div class="en">${wrappedEn}</div>
        <div class="km">${line.khmer || line.km || ''}</div>
      </div>
    `;

    // Add Mic button for the last line if not already there
    if (i === lines.length - 1) {
      const micBtn = document.createElement('button');
      micBtn.className = 'mic-btn';
      micBtn.innerHTML = '🎤';
      micBtn.title = 'Record yourself';
      micBtn.dataset.lineIdx = i;
      lineEl.querySelector('.bubble').appendChild(micBtn);
    }

    container.appendChild(lineEl);
  });

  // Auto-scroll to bottom
  container.scrollTop = container.scrollHeight;
};

export const updateProgressBar = (progressBar, currentIdx, total) => {
  if (!progressBar) return;
  const percentage = total > 0 ? ((currentIdx + 1) / total) * 100 : 0;
  progressBar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
};

function wrapWords(text) {
  return String(text).split(/(\s+)/).map(tok => {
    if (tok === '' || /^\s+$/.test(tok)) return escapeHtml(tok);
    const clean = tok.replace(/[^\w'-]/g, '');
    const safeTok = escapeHtml(tok);
    if (!clean) return safeTok;
    return `<span class="word" data-word="${escapeHtml(clean)}">${safeTok}</span>`;
  }).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export const toggleFocusMode = (isHidden) => {
  const card = document.querySelector('.card');
  const btn = document.getElementById('hideSettingsBtn');
  if (!card || !btn) return;

  card.classList.toggle('focus-mode', isHidden);
  btn.classList.toggle('active', isHidden);
  btn.textContent = isHidden ? '👁' : '⚙';
  btn.title = isHidden ? 'Show Settings' : 'Hide Settings';
};

export const toggleWatermark = (isOn) => {
  const watermark = document.getElementById('watermark');
  if (watermark) {
    watermark.classList.toggle('hidden', !isOn);
  }
};

export const setWatermarkPosition = (position) => {
  const watermark = document.getElementById('watermark');
  if (!watermark) return;

  const positions = {
    br: { bottom: '20px', right: '20px', top: 'auto', left: 'auto' },
    bl: { bottom: '20px', left: '20px', top: 'auto', right: 'auto' },
    tr: { top: '20px', right: '20px', bottom: 'auto', left: 'auto' },
    tl: { top: '20px', left: '20px', bottom: 'auto', right: 'auto' }
  };

  const style = positions[position] || positions.br;
  Object.assign(watermark.style, style);
};

export const showCountdown = (seconds, label, onComplete) => {
  const overlay = document.getElementById('countdownOverlay');
  const numEl = document.getElementById('countdownNum');
  const labelEl = document.getElementById('countdownLabel');

  if (!overlay || !numEl) return;

  labelEl.textContent = label;
  numEl.textContent = seconds;
  overlay.style.display = 'flex';

  let current = seconds;
  const interval = setInterval(() => {
    current--;
    if (current > 0) {
      numEl.textContent = current;
    } else {
      clearInterval(interval);
      overlay.style.display = 'none';
      if (onComplete) onComplete();
    }
  }, 1000);
};
