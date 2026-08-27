/**
 * Dictionary Module
 * Handles word lookup and definition display.
 */

let popupAbortController = null;

export function initDictionary(popupId) {
  const popup = document.getElementById(popupId);
  if (!popup) return;

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.word') && !e.target.closest(`#${popupId}`)) {
      popup.classList.remove('show');
    }
  });
}

export function showWordPopup(word, element, popupId, ttsRate = 1.0) {
  const popup = document.getElementById(popupId);
  if (!popup || !word) return;

  // Speak the word
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  utterance.rate = Math.max(0.5, ttsRate - 0.15);
  window.speechSynthesis.speak(utterance);

  // Position the popup
  const rect = element.getBoundingClientRect();
  const popW = 210;
  popup.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - popW - 8)) + 'px';
  popup.style.top = (rect.bottom + window.scrollY + 8) + 'px';
  popup.innerHTML = `<div class="wp-word">${escapeHtml(word)}</div><div class="wp-def">Searching definition...</div>`;
  popup.classList.add('show');

  if (popupAbortController) popupAbortController.abort();
  popupAbortController = new AbortController();

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`, { signal: popupAbortController.signal })
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
      const entry = data[0] || {};
      const phonetic = entry.phonetic || ((entry.phonetics || []).find(p => p.text) || {}).text || '';
      const meaning = (entry.meanings || [])[0] || {};
      const pos = meaning.partOfSpeech || '';
      const def = (meaning.definitions || [])[0]?.definition || '';

      popup.innerHTML = `
        <div class="wp-word">${escapeHtml(word)}${phonetic ? `<span class="wp-phon">${escapeHtml(phonetic)}</span>` : ''}</div>
        ${pos ? `<div class="wp-pos">${escapeHtml(pos)}</div>` : ''}
        <div class="wp-def">${def ? escapeHtml(def) : 'No definition found'}</div>
      `;
    })
    .catch(() => {
      popup.innerHTML = `<div class="wp-word">${escapeHtml(word)}</div><div class="wp-def">Definition not available</div>`;
    });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
