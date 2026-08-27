// ============================================================
//  UI CONTROLS & HELPERS
//  Handles DOM manipulation, utilities, and UI events
// ============================================================

// ============================================================
//  UTILITY FUNCTIONS
// ============================================================
function pad(n) {
  return String(n).padStart(2, '0');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function(c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]);
  });
}

function getLineDelay() {
  return parseFloat(document.getElementById('lineDelay').value) * 1000;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============================================================
//  WORD POPUP
// ============================================================
let popupAbortController = null;

function showWordPopup(wordEl) {
  const word = wordEl.dataset.word;
  if (!word) return;

  window.speechSynthesis.cancel();

  const wu = new SpeechSynthesisUtterance(word);
  wu.lang = 'en-US';
  wu.rate = Math.max(0.5, ttsRate - 0.15);
  window.speechSynthesis.speak(wu);

  const rect = wordEl.getBoundingClientRect();
  const popW = 220;
  const popup = document.getElementById('wordPopup');

  popup.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - popW - 8)) + 'px';
  popup.style.top = (rect.bottom + 8) + 'px';
  popup.innerHTML = '<div class="wp-word">' + escapeHtml(word) + '</div><div class="wp-def">កំពុងស្វែងរកន័យ...</div>';
  popup.classList.add('show');

  if (popupAbortController) popupAbortController.abort();
  popupAbortController = new AbortController();

  fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(word.toLowerCase()), {
      signal: popupAbortController.signal
    })
    .then(function(r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function(data) {
      const entry = data[0] || {};
      const phonetic = entry.phonetic || ((entry.phonetics || []).find(function(p) { return p.text; }) || {}).text || '';
      const meaning = (entry.meanings || [])[0] || {};
      const pos = meaning.partOfSpeech || '';
      const def = (meaning.definitions || [])[0]?.definition || '';

      popup.innerHTML = `
        <div class="wp-word">${escapeHtml(word)}${phonetic ? '<span class="wp-phon">' + escapeHtml(phonetic) + '</span>' : ''}</div>
        ${pos ? '<div class="wp-pos">' + escapeHtml(pos) + '</div>' : ''}
        <div class="wp-def">${def ? escapeHtml(def) : 'គ្មានន័យរកឃើញទេ'}</div>
      `;
    })
    .catch(function() {
      popup.innerHTML = '<div class="wp-word">' + escapeHtml(word) + '</div><div class="wp-def">មិនអាចរកន័យបានទេ</div>';
    });
}

// Close word popup on click outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.word') && !e.target.closest('.word-popup')) {
    document.getElementById('wordPopup').classList.remove('show');
  }
});

// ============================================================
//  WRAP WORDS FOR INTERACTIVITY
// ============================================================
function wrapWords(text) {
  return String(text).split(/(\s+)/).map(function(tok) {
    if (tok === '' || /^\s+$/.test(tok)) return escapeHtml(tok);

    const clean = tok.replace(/[^\w'-]/g, '');
    const safeTok = escapeHtml(tok);
    if (!clean) return safeTok;

    return '<span class="word" data-word="' + escapeHtml(clean) + '">' + safeTok + '</span>';
  }).join('');
}

// ============================================================
//  TOGGLE FUNCTIONS
// ============================================================
function toggleHeader() {
  headerHidden = !headerHidden;
  const header = document.getElementById('gamificationHeader');
  const badges = document.getElementById('badgeCollection');
  const btn = document.getElementById('hideHeaderBtn');

  if (headerHidden) {
    header.classList.add('hidden');
    badges.classList.add('hidden');
    btn.classList.add('active');
    btn.title = 'Show header';
  } else {
    header.classList.remove('hidden');
    badges.classList.remove('hidden');
    btn.classList.remove('active');
    btn.title = 'Hide header';
  }
}

function toggleCleanScreen() {
  cleanScreenMode = !cleanScreenMode;
  const body = document.body;

  if (cleanScreenMode) {
    body.classList.add('clean-screen');

    if (!settingsHidden) {
      settingsHidden = true;
      document.querySelector('.main-card').classList.add('focus-mode');
      document.getElementById('hideSettingsBtn').classList.add('active');
      document.getElementById('hideSettingsBtn').textContent = '👁';
      document.getElementById('hideSettingsBtn').title = 'Show settings';
    }

    if (!headerHidden) {
      toggleHeader();
    }

    document.getElementById('hideHeaderBtn').textContent = '🧹';
    document.getElementById('hideHeaderBtn').title = 'Exit clean screen';
  } else {
    body.classList.remove('clean-screen');

    settingsHidden = false;
    document.querySelector('.main-card').classList.remove('focus-mode');
    document.getElementById('hideSettingsBtn').classList.remove('active');
    document.getElementById('hideSettingsBtn').textContent = '⚙';
    document.getElementById('hideSettingsBtn').title = 'Hide settings';

    if (headerHidden) {
      toggleHeader();
    }

    document.getElementById('hideHeaderBtn').textContent = '👤';
    document.getElementById('hideHeaderBtn').title = 'Hide header';
  }
}