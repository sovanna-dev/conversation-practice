// ============================================================
//  SETTINGS SYSTEM
//  Handles theme colors, display settings, and import/export
// ============================================================

// ============================================================
//  THEME DEFAULTS
// ============================================================
const THEME_DEFAULTS = {
  colorGold: '#b8863f',
  colorJade: '#3f6355',
  colorLac: '#a8412f',
  colorPaper: '#f2ede2',
  colorPanel: '#fffdf8',
  colorAbg: '#e9e2d2',
  colorBbg: '#dfe8e2',
};

const COLOR_VAR_MAP = {
  colorGold: '--gold',
  colorJade: '--jade',
  colorLac: '--lac',
  colorPaper: '--paper',
  colorPanel: '--panel',
  colorAbg: '--a-bg',
  colorBbg: '--b-bg',
};

const LIGHT_EXTRAS = {
  '--ink': '#2b2320',
  '--muted': '#7a6c60',
  '--line': 'rgba(43,35,32,0.14)'
};

const DARK_EXTRAS = {
  '--ink': '#f2ede2',
  '--muted': '#b8ab9d',
  '--line': 'rgba(255,253,248,0.16)'
};

const DARK_COLORS = {
  colorGold: '#d9a75c',
  colorJade: '#5a9484',
  colorLac: '#e2725a',
  colorPaper: '#1b1815',
  colorPanel: '#242019',
  colorAbg: '#2f2a24',
  colorBbg: '#233029',
};

let darkMode = false;
let bgImageUrl = null;

// ============================================================
//  DISPLAY SETTINGS
// ============================================================
function applyDisplaySettings() {
  const fontSize = document.getElementById('fontSizeSlider').value;
  const lineSpacing = document.getElementById('lineSpacingSlider').value;

  document.documentElement.style.setProperty('--font-size-base', fontSize + 'px');
  document.documentElement.style.setProperty('--line-spacing', lineSpacing + 'px');

  document.getElementById('fontSizeLabel').textContent = fontSize + 'px';
  document.getElementById('lineSpacingLabel').textContent = lineSpacing + 'px';
}

function initDisplayControls() {
  const fontSizeSlider = document.getElementById('fontSizeSlider');
  const lineSpacingSlider = document.getElementById('lineSpacingSlider');
  const autoScrollToggle = document.getElementById('autoScrollToggle');

  if (!fontSizeSlider || !lineSpacingSlider || !autoScrollToggle) return;
  if (autoScrollToggle.dataset.controlsBound === 'true') return;
  autoScrollToggle.dataset.controlsBound = 'true';

  [fontSizeSlider, lineSpacingSlider].forEach(function(control) {
    control.addEventListener('input', applyDisplaySettings);
    control.addEventListener('change', applyDisplaySettings);
  });

  autoScrollToggle.addEventListener('click', function() {
    autoScrollEnabled = !autoScrollEnabled;
    this.textContent = autoScrollEnabled ? 'បើក' : 'បិទ';
    this.classList.toggle('active', autoScrollEnabled);
    if (typeof dialogueContainer !== 'undefined' && dialogueContainer) {
      dialogueContainer.classList.toggle('manual-scroll', !autoScrollEnabled);
    }
  });

  applyDisplaySettings();
}

// ============================================================
//  THEME FUNCTIONS
// ============================================================
function applyDarkMode(on) {
  darkMode = on;
  const colors = on ? DARK_COLORS : THEME_DEFAULTS;
  const extras = on ? DARK_EXTRAS : LIGHT_EXTRAS;

  Object.keys(COLOR_VAR_MAP).forEach(function(id) {
    document.getElementById(id).value = colors[id];
    document.documentElement.style.setProperty(COLOR_VAR_MAP[id], colors[id]);
  });

  Object.entries(extras).forEach(function(entry) {
    document.documentElement.style.setProperty(entry[0], entry[1]);
  });

  document.getElementById('darkModeBtn').textContent = on ? '☀️ Light' : '🌙 Dark';
}

function removeBgImage() {
  if (bgImageUrl) URL.revokeObjectURL(bgImageUrl);
  bgImageUrl = null;
  document.body.classList.remove('has-bg-image');
  document.getElementById('bgImageControls').style.display = 'none';
  document.getElementById('bgImageFile').value = '';
}

// ============================================================
//  COLLECT & APPLY SETTINGS
// ============================================================
function collectSettings() {
  const colors = {};
  Object.keys(COLOR_VAR_MAP).forEach(function(id) {
    colors[id] = document.getElementById(id).value;
  });

  return {
    darkMode: darkMode,
    colors: colors,
    ink: getComputedStyle(document.documentElement).getPropertyValue('--ink').trim(),
    muted: getComputedStyle(document.documentElement).getPropertyValue('--muted').trim(),
    line: getComputedStyle(document.documentElement).getPropertyValue('--line').trim(),
    lineDelay: parseFloat(document.getElementById('lineDelay').value),
    ttsRate: parseFloat(document.getElementById('ttsRate').value),
    autoSpeak: document.getElementById('autoSpeakBtn').textContent.includes('បើក'),
    watermarkOn: document.getElementById('watermarkToggleBtn').textContent.includes('បើក'),
    watermarkPos: document.getElementById('watermarkPosSelect').value,
    fontSize: document.getElementById('fontSizeSlider').value,
    lineSpacing: document.getElementById('lineSpacingSlider').value,
        targetLang: document.getElementById('translateLangSelect').value,
    autoScroll: autoScrollEnabled,

  };
}

function applySettings(s) {
  if (!s || typeof s !== 'object') return;

  if (typeof s.darkMode === 'boolean') applyDarkMode(s.darkMode);

  if (s.colors) {
    Object.keys(COLOR_VAR_MAP).forEach(function(id) {
      if (s.colors[id]) {
        document.getElementById(id).value = s.colors[id];
        document.documentElement.style.setProperty(COLOR_VAR_MAP[id], s.colors[id]);
      }
    });
  }

  if (s.ink) document.documentElement.style.setProperty('--ink', s.ink);
  if (s.muted) document.documentElement.style.setProperty('--muted', s.muted);
  if (s.line) document.documentElement.style.setProperty('--line', s.line);

  if (typeof s.lineDelay === 'number') {
    document.getElementById('lineDelay').value = s.lineDelay;
    document.getElementById('lineDelayLabel').textContent = s.lineDelay.toFixed(2) + 's';
  }

  if (typeof s.ttsRate === 'number') {
    document.getElementById('ttsRate').value = s.ttsRate;
    document.getElementById('ttsRateLabel').textContent = s.ttsRate.toFixed(2) + 'x';
  }

  if (typeof s.fontSize === 'string' || typeof s.fontSize === 'number') {
    document.getElementById('fontSizeSlider').value = s.fontSize;
    applyDisplaySettings();
  }

  if (typeof s.lineSpacing === 'string' || typeof s.lineSpacing === 'number') {
    document.getElementById('lineSpacingSlider').value = s.lineSpacing;
    applyDisplaySettings();
  }

  if (typeof s.watermarkOn === 'boolean') {
    const wmOn = s.watermarkOn;
    const btn = document.getElementById('watermarkToggleBtn');
    btn.textContent = wmOn ? '🏷 Watermark: បើក' : '🏷 Watermark: បិទ';
    btn.classList.toggle('active', wmOn);
    document.getElementById('watermark').classList.toggle('hidden', !wmOn);
  }

  if (s.watermarkPos && watermarkPositions[s.watermarkPos]) {
    document.getElementById('watermarkPosSelect').value = s.watermarkPos;
    Object.assign(document.getElementById('watermark').style, watermarkPositions[s.watermarkPos]);
  }

  if (typeof s.targetLang === 'string') {
    const select = document.getElementById('translateLangSelect');
    if (select.querySelector('option[value="' + s.targetLang + '"]')) {
      select.value = s.targetLang;
      targetLang = s.targetLang;
    }
  }

  if (typeof s.autoScroll === 'boolean') {
    autoScrollEnabled = s.autoScroll;
    const toggle = document.getElementById('autoScrollToggle');
    toggle.textContent = autoScrollEnabled ? 'បើក' : 'បិទ';
    toggle.classList.toggle('active', autoScrollEnabled);
    if (typeof dialogueContainer !== 'undefined' && dialogueContainer) {
      dialogueContainer.classList.toggle('manual-scroll', !autoScrollEnabled);
    }
  }
}


// Bind independently as a safety net: this file is loaded before app.js,
// while the DOM is complete when the DOMContentLoaded callback runs.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDisplayControls, { once: true });
} else {
  setTimeout(initDisplayControls, 0);
}
