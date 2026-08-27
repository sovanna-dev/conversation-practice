// ============================================================
//  SPEECH & TTS SYSTEM
//  Handles voice selection, speech synthesis, and recording
// ============================================================

let voices = [];
let manualVoiceA = null;
let manualVoiceB = null;
let ttsRate = 0.9;

// ============================================================
//  VOICE SELECTION
// ============================================================
function getEnVoices() {
  return voices.filter(function(v) {
    return v.lang && v.lang.toLowerCase().startsWith('en');
  });
}

function populateVoiceSelects() {
  const enVoices = getEnVoices();
  const options = '<option value="">ស្វ័យប្រវត្តិ</option>' +
    enVoices.map(function(v, i) {
      return '<option value="' + i + '">' + escapeHtml(v.name) + ' (' + escapeHtml(v.lang) + ')</option>';
    }).join('');

  const prevA = document.getElementById('voiceSelectA').value;
  const prevB = document.getElementById('voiceSelectB').value;

  document.getElementById('voiceSelectA').innerHTML = options;
  document.getElementById('voiceSelectB').innerHTML = options;

  if (prevA) document.getElementById('voiceSelectA').value = prevA;
  if (prevB) document.getElementById('voiceSelectB').value = prevB;
}

function loadVoices() {
  voices = window.speechSynthesis.getVoices();
  populateVoiceSelects();
}

function pickVoice(gender) {
  if (gender === 'male' && manualVoiceA) return manualVoiceA;
  if (gender === 'female' && manualVoiceB) return manualVoiceB;

  const enVoices = getEnVoices();
  if (enVoices.length === 0) return null;

  const maleNames = ['male', 'david', 'daniel', 'mark', 'fred', 'alex', 'guy', 'tom', 'george', 'oliver'];
  const femaleNames = ['female', 'zira', 'samantha', 'victoria', 'susan', 'karen', 'moira', 'tessa', 'fiona', 'emma', 'ava', 'allison'];

  const names = gender === 'male' ? maleNames : femaleNames;
  const found = enVoices.find(function(v) {
    return names.some(function(n) {
      return v.name.toLowerCase().includes(n);
    });
  });

  if (found) return found;
  return gender === 'male' ? enVoices[0] : (enVoices[1] || enVoices[0]);
}

// ============================================================
//  SPEECH SYNTHESIS
// ============================================================
function speak(text, speaker, btnEl, onEnd) {
  if (!('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  document.querySelectorAll('.speak-btn.speaking').forEach(function(b) {
    b.classList.remove('speaking');
  });

  document.querySelectorAll('.line.is-speaking').forEach(function(l) {
    l.classList.remove('is-speaking');
  });

  const lineEl = btnEl ? btnEl.closest('.line') : null;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = ttsRate;

  const gender = speaker === 'B' ? 'female' : 'male';
  const voice = pickVoice(gender);
  if (voice) utter.voice = voice;
  utter.pitch = gender === 'male' ? 0.85 : 1.2;

  if (btnEl) btnEl.classList.add('speaking');
  if (lineEl) lineEl.classList.add('is-speaking');

  utter.onend = function() {
    if (btnEl) btnEl.classList.remove('speaking');
    if (lineEl) lineEl.classList.remove('is-speaking');
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utter);

  // Gamification tracking
  if (btnEl && !btnEl.classList.contains('mic-btn')) {
    GAME.totalSpeaks++;
    if (GAME.totalSpeaks % 3 === 0) addXP(2);
    checkBadges();
    saveGameState();
  }
}

function speakCurrentLine() {
  if (!autoSpeak || lineIdx < 0) return;

  const scene = scenes[sceneIdx];
  const line = scene.lines[lineIdx];
  const btn = document.getElementById('dialogue').querySelector('.speak-btn:not(.mic-btn)[data-line="' + lineIdx + '"]');

  speak(line.en, line.speaker, btn);
}

// ============================================================
//  MIC RECORDING
// ============================================================
let activeRecorder = null;
let activeMicBtn = null;
let micAutoStopTimer = null;

function stopMicRecording() {
  if (activeRecorder && activeRecorder.state === 'recording') {
    activeRecorder.stop();
  }

  if (activeMicBtn) {
    activeMicBtn.classList.remove('recording');
    activeMicBtn.textContent = '🎙️';
  }

  clearTimeout(micAutoStopTimer);
}

async function startMicRecording(btn) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('កម្មវិធីរុករកនេះមិនគាំទ្រការថតសំឡេងទេ');
    return;
  }

  if (activeRecorder && activeRecorder.state === 'recording') {
    stopMicRecording();
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const chunks = [];
    const recorder = new MediaRecorder(stream);

    activeRecorder = recorder;
    activeMicBtn = btn;

    recorder.ondataavailable = function(e) {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = function() {
      stream.getTracks().forEach(function(t) { t.stop(); });

      const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const idx = btn.dataset.line;
      const container = document.getElementById('micPlayback-' + idx);

      if (container) {
        const scene = scenes[sceneIdx];
        const line = scene.lines[idx];

        container.innerHTML = `
          <audio controls src="${url}"></audio>
          <button type="button" class="btn btn-ghost mp-btn mp-tts">🔊 TTS</button>
          <button type="button" class="btn btn-ghost mp-btn mp-clear">✕</button>
        `;

        container.style.display = 'flex';

        container.querySelector('.mp-tts').addEventListener('click', function() {
          speak(line.en, line.speaker, null);
        });

        container.querySelector('.mp-clear').addEventListener('click', function() {
          URL.revokeObjectURL(url);
          container.innerHTML = '';
          container.style.display = 'none';
        });
      }

      activeRecorder = null;
      activeMicBtn = null;

      GAME.totalMics++;
      if (GAME.totalMics % 2 === 0) addXP(3);
      checkBadges();
      saveGameState();
    };

    recorder.start();
    btn.classList.add('recording');
    btn.textContent = '⏹';
    micAutoStopTimer = setTimeout(stopMicRecording, 6000);

  } catch (err) {
    alert('មិនអាចចូលប្រើមីក្រូហ្វូនបានទេ');
  }
}

function toggleMicRecording(btn) {
  if (btn.classList.contains('recording')) {
    stopMicRecording();
  } else {
    startMicRecording(btn);
  }
}

// ============================================================
//  INIT VOICE SYSTEM
// ============================================================
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
  setTimeout(loadVoices, 100);
}

// Voice select event listeners
document.getElementById('voiceSelectA').addEventListener('change', function() {
  const enVoices = getEnVoices();
  manualVoiceA = this.value === '' ? null : enVoices[parseInt(this.value, 10)];
});

document.getElementById('voiceSelectB').addEventListener('change', function() {
  const enVoices = getEnVoices();
  manualVoiceB = this.value === '' ? null : enVoices[parseInt(this.value, 10)];
});

document.getElementById('ttsRate').addEventListener('input', function() {
  ttsRate = parseFloat(this.value);
  document.getElementById('ttsRateLabel').textContent = ttsRate.toFixed(2) + 'x';
});