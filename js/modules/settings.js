export const THEME_DEFAULTS = {
  gold: '#b8863f',
  jade: '#3f6355',
  lac: '#a8412f',
  paper: '#f2ede2',
  panel: '#fffdf8',
  abg: '#e9e2d2',
  bbg: '#dfe8e2'
};

const COLOR_MAP = {
  gold: '--gold', jade: '--jade', lac: '--lac', paper: '--paper',
  panel: '--panel', abg: '--a-bg', bbg: '--b-bg'
};

let bgImageUrl = null;

export const applyDarkMode = (isDark) => {
  document.body.classList.toggle('dark-mode', isDark);
  localStorage.setItem('darkMode', isDark);
};

export const collectSettings = () => {
  const rootStyle = getComputedStyle(document.documentElement);
  return {
    ...Object.fromEntries(Object.entries(COLOR_MAP).map(([key, variable]) => [key, rootStyle.getPropertyValue(variable).trim()])),
    darkMode: document.body.classList.contains('dark-mode')
  };
};

export const applySettings = (settings) => {
  Object.entries(COLOR_MAP).forEach(([key, variable]) => {
    if (settings[key]) document.documentElement.style.setProperty(variable, settings[key]);
  });
  if (settings.darkMode !== undefined) applyDarkMode(Boolean(settings.darkMode));
};

export const importSettingsFromFile = (file, callback) => {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const settings = JSON.parse(reader.result);
      applySettings(settings);
      if (callback) callback(settings);
    } catch (err) {
      alert('⚠ ឯកសារ JSON មិនត្រឹមត្រូវ');
    }
  };
  reader.readAsText(file);
};

export const exportSettings = () => {
  const settings = collectSettings();
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'app-settings.json';
  a.click();
};

export const initThemeControls = () => {
  Object.keys(COLOR_MAP).forEach(key => {
    const input = document.getElementById(`color${key.charAt(0).toUpperCase()}${key.slice(1)}`);
    input?.addEventListener('input', event => {
      document.documentElement.style.setProperty(COLOR_MAP[key], event.target.value);
    });
  });

  document.getElementById('resetThemeBtn')?.addEventListener('click', () => {
    applySettings(THEME_DEFAULTS);
    Object.keys(COLOR_MAP).forEach(key => {
      const input = document.getElementById(`color${key.charAt(0).toUpperCase()}${key.slice(1)}`);
      if (input) input.value = THEME_DEFAULTS[key];
    });
  });
};

export const initBgImageSettings = (fileInputId, removeBtnId, controlsContainerId) => {
  const fileInput = document.getElementById(fileInputId);
  const removeBtn = document.getElementById(removeBtnId);
  const controlsContainer = document.getElementById(controlsContainerId);

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (bgImageUrl) URL.revokeObjectURL(bgImageUrl);
      bgImageUrl = URL.createObjectURL(file);
      document.documentElement.style.setProperty('--custom-bg-image', `url(${bgImageUrl})`);
      if (controlsContainer) controlsContainer.style.display = 'flex';
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      if (bgImageUrl) URL.revokeObjectURL(bgImageUrl);
      bgImageUrl = null;
      document.documentElement.style.setProperty('--custom-bg-image', 'none');
      if (controlsContainer) controlsContainer.style.display = 'none';
      if (fileInput) fileInput.value = '';
    });
  }
};
