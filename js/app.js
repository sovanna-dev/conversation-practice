// ============================================================
//  MAIN APPLICATION
//  Handles conversation data, rendering, auto-play, etc.
// ============================================================

// ============================================================
//  CONVERSATION DATA
// ============================================================
const scenes = [{
  topic: "At a Coffee Shop",
  lines: [
    { speaker: "A", en: "Hi! What would you like to order?", km: "សួស្តី! តើអ្នកចង់បញ្ជាទិញអ្វី?" },
    { speaker: "B", en: "Can I get a small latte, please?", km: "សុំកាហ្វេឡាតេមួយកែវតូចបានទេ?" },
    { speaker: "A", en: "Sure! For here or to go?", km: "បាទ/ចាស! ញ៉ាំនៅទីនេះ ឬយកទៅ?" },
    { speaker: "B", en: "To go, thanks.", km: "យកទៅ សូមអរគុណ។" },
    { speaker: "A", en: "That will be $4.50, please.", km: "តម្លៃ ៤.៥០ ដុល្លារ។" },
    { speaker: "B", en: "Here you go. Keep the change.", km: "នេះសូម។ រក្សាលុយអាប់អោយអ្នកចុះ។" },
    { speaker: "A", en: "Thank you! Have a great day!", km: "អរគុណ! សូមជូនពរថ្ងៃល្អ!" },
  ]
}, {
  topic: "Asking for Directions",
  lines: [
    { speaker: "A", en: "Excuse me, how do I get to the station?", km: "សុំទោស តើទៅស្ថានីយ៍ធ្វើដូចម្តេច?" },
    { speaker: "B", en: "Go straight for two blocks, then turn left.", km: "ដើរត្រង់ទៅពីរប្លុក រួចបត់ឆ្វេង។" },
    { speaker: "A", en: "Is it far from here?", km: "តើវាឆ្ងាយពីទីនេះទេ?" },
    { speaker: "B", en: "No, it's about five minutes on foot.", km: "ទេ ដើរប្រហែលប្រាំនាទីប៉ុណ្ណោះ។" },
    { speaker: "A", en: "Is there a bus that goes there?", km: "មានឡានក្រុងទៅទីនោះទេ?" },
    { speaker: "B", en: "Yes, bus number 12 stops right in front.", km: "មាន ឡានក្រុងលេខ ១២ ឈប់នៅមុខវា។" },
    { speaker: "A", en: "Thank you so much for your help!", km: "អរគុណច្រើនសម្រាប់ជំនួយ!" },
  ]
}, {
  topic: "First Day at Work",
  lines: [
    { speaker: "A", en: "Welcome to the team! I'm Sarah.", km: "ស្វាគមន៍ចូលក្រុម! ខ្ញុំឈ្មោះ Sarah។" },
    { speaker: "B", en: "Nice to meet you. I'm a bit nervous.", km: "រីករាយដែលបានស្គាល់អ្នក។ ខ្ញុំមានអារម្មណ៍ភ័យបន្តិច។" },
    { speaker: "A", en: "Don't worry, everyone is friendly here.", km: "កុំបារម្ភ អ្នកគ្រប់គ្នានៅទីនេះមានភាពរាក់ទាក់។" },
    { speaker: "B", en: "That's good to hear. What should I do first?", km: "ល្អណាស់ដែលបានឮដូច្នេះ។ តើខ្ញុំគួរធ្វើអ្វីមុន?" },
    { speaker: "A", en: "I'll show you around the office and introduce you to everyone.", km: "ខ្ញុំនឹងនាំអ្នកទៅមើលការិយាល័យ និងណែនាំអ្នកឱ្យស្គាល់អ្នកគ្រប់គ្នា។" },
    { speaker: "B", en: "Thank you, Sarah. I really appreciate it.", km: "អរគុណ Sarah។ ខ្ញុំពិតជាដឹងគុណណាស់។" },
  ]
}, {
  topic: "At the Restaurant",
  lines: [
    { speaker: "A", en: "Welcome to our restaurant! Table for two?", km: "ស្វាគមន៍មកកាន់ភោជនីយដ្ឋានយើងខ្ញុំ! តុសម្រាប់ពីរនាក់?" },
    { speaker: "B", en: "Yes, please. Could we sit by the window?", km: "បាទ/ចាស។ តើយើងអាចអង្គុយក្បែរបង្អួចបានទេ?" },
    { speaker: "A", en: "Of course! Right this way.", km: "បាន! សូមអញ្ជើញតាមផ្លូវនេះ។" },
    { speaker: "B", en: "Could I see the menu, please?", km: "តើខ្ញុំអាចមើលម៉ឺនុយបានទេ?" },
    { speaker: "A", en: "Here you go. I'll be back in a moment.", km: "នេះសូម។ ខ្ញុំនឹងត្រឡប់មកវិញក្នុងពេលឆាប់ៗ។" },
    { speaker: "B", en: "I think I'll have the grilled salmon.", km: "ខ្ញុំគិតថាខ្ញុំនឹងយកសាម៉ុនអាំង។" },
    { speaker: "A", en: "Excellent choice! Would you like a drink with that?", km: "ជម្រើសល្អណាស់! តើអ្នកចង់បានភេសជ្ជៈអ្វី?" },
  ]
}, {
  topic: "Making a Phone Call",
  lines: [
    { speaker: "A", en: "Hello, this is John speaking.", km: "សួស្តី ខ្ញុំឈ្មោះ John។" },
    { speaker: "B", en: "Hi John, it's Mary. How are you?", km: "សួស្តី John, ខ្ញុំ Mary។ អ្នកសុខសប្បាយទេ?" },
    { speaker: "A", en: "I'm doing well, thanks! How about you?", km: "ខ្ញុំសុខសប្បាយទេ អរគុណ! ឯអ្នកវិញ?" },
    { speaker: "B", en: "I'm good. I'm calling about the meeting tomorrow.", km: "ខ្ញុំសុខសប្បាយទេ។ ខ្ញុំទូរស័ព្ទមកនិយាយអំពីកិច្ចប្រជុំថ្ងៃស្អែក។" },
    { speaker: "A", en: "Sure, what about it?", km: "បាទ មានអ្វី?" },
    { speaker: "B", en: "It's been moved to 3 PM instead of 10 AM.", km: "វាត្រូវបានផ្លាស់ប្តូរទៅម៉ោង ៣ រសៀលជំនួសឱ្យម៉ោង ១០ ព្រឹក។" },
    { speaker: "A", en: "Thanks for letting me know. I'll update my schedule.", km: "អរគុណដែលបានប្រាប់ខ្ញុំ។ ខ្ញុំនឹងកែតម្រូវកាលវិភាគរបស់ខ្ញុំ។" },
  ]
}, {
  topic: "Travel & Directions",
  lines: [
    { speaker: "A", en: "Excuse me, how can I get to the museum?", km: "សុំទោស តើខ្ញុំអាចទៅសារមន្ទីរបានដោយរបៀបណា?" },
    { speaker: "B", en: "Go straight and turn right at the second street.", km: "ដើរត្រង់ ហើយបត់ស្តាំនៅផ្លូវទីពីរ។" },
    { speaker: "A", en: "Is it within walking distance?", km: "តើអាចដើរទៅបានទេ?" },
    { speaker: "B", en: "Yes, it takes about ten minutes.", km: "បាន វាចំណាយពេលប្រហែលដប់នាទី។" },
    { speaker: "A", en: "Thank you for your help.", km: "អរគុណសម្រាប់ជំនួយរបស់អ្នក។" },
    { speaker: "B", en: "You are welcome. Have a nice day!", km: "មិនអីទេ។ សូមឲ្យអ្នកមានថ្ងៃល្អ!" }
  ]
}, {
  topic: "Job Interview",
  lines: [
    { speaker: "A", en: "Good morning. Please tell me about yourself.", km: "អរុណសួស្តី។ សូមប្រាប់ខ្ញុំអំពីខ្លួនអ្នក។" },
    { speaker: "B", en: "I am a friendly person who enjoys helping customers.", km: "ខ្ញុំជាមនុស្សរួសរាយដែលចូលចិត្តជួយអតិថិជន។" },
    { speaker: "A", en: "What is your strongest skill?", km: "តើជំនាញខ្លាំងបំផុតរបស់អ្នកគឺអ្វី?" },
    { speaker: "B", en: "I communicate clearly and learn quickly.", km: "ខ្ញុំទំនាក់ទំនងបានច្បាស់ និងរៀនបានលឿន។" },
    { speaker: "A", en: "Why would you like to work with us?", km: "ហេតុអ្វីអ្នកចង់ធ្វើការជាមួយយើង?" },
    { speaker: "B", en: "I like your team and I want to grow with the company.", km: "ខ្ញុំចូលចិត្តក្រុមការងាររបស់អ្នក ហើយចង់រីកចម្រើនជាមួយក្រុមហ៊ុន។" }
  ]
}, {
  topic: "Doctor Visit",
  lines: [
    { speaker: "A", en: "What brings you to the clinic today?", km: "តើអ្វីនាំអ្នកមកគ្លីនិកថ្ងៃនេះ?" },
    { speaker: "B", en: "I have had a sore throat since yesterday.", km: "ខ្ញុំឈឺបំពង់កតាំងពីម្សិលមិញ។" },
    { speaker: "A", en: "Do you have a fever or a cough?", km: "តើអ្នកក្តៅខ្លួន ឬក្អកទេ?" },
    { speaker: "B", en: "I have a small cough, but no fever.", km: "ខ្ញុំក្អកបន្តិច ប៉ុន្តែមិនក្តៅខ្លួនទេ។" },
    { speaker: "A", en: "Please drink water and rest today.", km: "សូមផឹកទឹក និងសម្រាកថ្ងៃនេះ។" },
    { speaker: "B", en: "Thank you, doctor. I will follow your advice.", km: "អរគុណលោកគ្រូពេទ្យ។ ខ្ញុំនឹងធ្វើតាមដំបូន្មាន។" }
  ]
}, {
  topic: "Shopping & Payment",
  lines: [
    { speaker: "A", en: "Can I help you find something?", km: "តើខ្ញុំអាចជួយអ្នករកអ្វីមួយបានទេ?" },
    { speaker: "B", en: "Yes, I am looking for a blue shirt.", km: "បាន ខ្ញុំកំពុងរកអាវពណ៌ខៀវមួយ។" },
    { speaker: "A", en: "What size would you like?", km: "តើអ្នកចង់បានទំហំអ្វី?" },
    { speaker: "B", en: "Medium, please. How much is it?", km: "ទំហំមធ្យម សូម។ តើវាតម្លៃប៉ុន្មាន?" },
    { speaker: "A", en: "It is twenty dollars, and it is on sale today.", km: "វាតម្លៃម្ភៃដុល្លារ ហើយថ្ងៃនេះមានបញ្ចុះតម្លៃ។" },
    { speaker: "B", en: "Great. I will pay by card.", km: "ល្អណាស់។ ខ្ញុំនឹងបង់ដោយកាត។" }
  ]
}, {
  topic: "Daily Small Talk",
  lines: [
    { speaker: "A", en: "How was your morning?", km: "តើព្រឹករបស់អ្នកយ៉ាងម៉េចដែរ?" },
    { speaker: "B", en: "It was busy, but I finished my important work.", km: "វារវល់ ប៉ុន្តែខ្ញុំបានបញ្ចប់ការងារសំខាន់របស់ខ្ញុំ។" },
    { speaker: "A", en: "What are you doing after work?", km: "តើអ្នកនឹងធ្វើអ្វីបន្ទាប់ពីការងារ?" },
    { speaker: "B", en: "I am going to meet a friend for dinner.", km: "ខ្ញុំនឹងជួបមិត្តម្នាក់ញ៉ាំអាហារពេលល្ងាច។" },
    { speaker: "A", en: "That sounds nice. Do you have plans for the weekend?", km: "ស្តាប់ទៅល្អណាស់។ តើអ្នកមានគម្រោងសម្រាប់ចុងសប្តាហ៍ទេ?" },
    { speaker: "B", en: "I plan to relax and practice my English.", km: "ខ្ញុំមានគម្រោងសម្រាក និងហាត់ភាសាអង់គ្លេស។" }
  ]
}];

// ============================================================
//  APP STATE
// ============================================================
let sceneIdx = 0;
let lineIdx = -1;
let autoSpeak = true;
let autoPlaying = false;
let autoScrollEnabled = true;
let forceAutoScroll = false;
let settingsHidden = false;
let headerHidden = false;
let cleanScreenMode = false;
let targetLang = 'km';
let translationCache = {};
let fadeInterval = null;
let bgMusicUrl = null;

// ============================================================
//  DOM REFERENCES
// ============================================================
const dialogueEl = document.getElementById('dialogue');
const dialogueContainer = document.getElementById('dialogueContainer');
const topicTag = document.getElementById('topicTag');
const sceneNum = document.getElementById('sceneNum');
const progressBar = document.getElementById('progressBar');
const appRoot = document.getElementById('appRoot');
const sceneSelect = document.getElementById('sceneSelect');
const autoPlayBtn = document.getElementById('autoPlayBtn');
const countdownOverlay = document.getElementById('countdownOverlay');
const countdownNum = document.getElementById('countdownNum');
const countdownLabel = document.getElementById('countdownLabel');
const lineDelaySlider = document.getElementById('lineDelay');
const lineDelayLabel = document.getElementById('lineDelayLabel');
const quizOverlay = document.getElementById('quizOverlay');
const quizPrompt = document.getElementById('quizPrompt');
const quizOptions = document.getElementById('quizOptions');
const quizSkipBtn = document.getElementById('quizSkipBtn');
const bgMusic = document.getElementById('bgMusic');
const musicFileInput = document.getElementById('musicFile');
const musicControls = document.getElementById('musicControls');
const musicHint = document.getElementById('musicHint');
const musicToggle = document.getElementById('musicToggle');
const musicVolume = document.getElementById('musicVolume');
const musicVolLabel = document.getElementById('musicVolLabel');

// ============================================================
//  TRANSLATION
// ============================================================
async function translateText(text, langCode) {
  if (langCode === 'km') return text;

  const cacheKey = langCode + '::' + text;
  if (translationCache[cacheKey]) return translationCache[cacheKey];

  try {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' +
      encodeURIComponent(langCode) + '&dt=t&q=' + encodeURIComponent(text);

    const res = await fetch(url);
    if (!res.ok) throw new Error('translate failed');

    const data = await res.json();
    const translated = (data[0] || []).map(function(part) { return part[0]; }).join('');

    translationCache[cacheKey] = translated;
    return translated;
  } catch (e) {
    return text + ' (មិនអាចបកប្រែបានទេ)';
  }
}

// ============================================================
//  RENDER FUNCTIONS
// ============================================================
function refreshSceneSelect() {
  sceneSelect.innerHTML = scenes.map(function(s, i) {
    return '<option value="' + i + '">' + pad(i + 1) + '. ' + escapeHtml(s.topic) + '</option>';
  }).join('');
  sceneSelect.value = sceneIdx;
}

function updateReveal() {
  const els = dialogueEl.querySelectorAll('.line');

  els.forEach(function(el, idx) {
    el.classList.toggle('active', idx <= lineIdx);
  });

  const total = scenes[sceneIdx].lines.length;
  progressBar.style.width = ((lineIdx + 1) / total * 100) + '%';

  if (lineIdx >= 0) {
    keepActiveLineVisible(autoPlaying);
  }
}

function renderScene() {
  const renderSceneIndex = sceneIdx;
  const scene = scenes[renderSceneIndex];
  topicTag.textContent = scene.topic;
  sceneNum.textContent = 'Scene ' + pad(renderSceneIndex + 1) + ' / ' + pad(scenes.length);

  // Render the original Khmer text immediately. Translation must never block
  // the dialogue canvas or leave it visually empty while the network responds.
  const html = scene.lines.map(function(l, idx) {
    return `
      <div class="line speaker-${l.speaker.toLowerCase()}" data-idx="${idx}">
        <div class="avatar">${escapeHtml(l.speaker)}</div>
        <div class="bubble-row">
          <div class="bubble">
            <p class="en">${wrapWords(l.en)}</p>
            <p class="km" id="km-${idx}">${escapeHtml(l.km)}</p>
          </div>
          <button class="speak-btn" data-line="${idx}" title="អាន">🔊</button>
          <button class="speak-btn mic-btn" data-line="${idx}" title="ថត">🎙️</button>
        </div>
        <div class="mic-playback" id="micPlayback-${idx}" style="display:none;"></div>
      </div>
    `;
  }).join('');

  dialogueEl.innerHTML = html;

  dialogueEl.querySelectorAll('.speak-btn:not(.mic-btn)').forEach(function(btn) {
    btn.addEventListener('click', function() {
      stopAutoPlay();
      const idx = parseInt(btn.dataset.line, 10);
      speak(scene.lines[idx].en, scene.lines[idx].speaker, btn);
    });
  });

  dialogueEl.querySelectorAll('.mic-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleMicRecording(btn);
    });
  });

  dialogueEl.querySelectorAll('.word').forEach(function(w) {
    w.addEventListener('click', function(e) {
      e.stopPropagation();
      showWordPopup(w);
    });
  });

  refreshSceneSelect();
  updateReveal();

  // Translate after the dialogue is visible, without replacing the whole DOM.
  if (targetLang !== 'km') {
    scene.lines.forEach(function(line, idx) {
      translateText(line.en, targetLang).then(function(translatedText) {
        if (sceneIdx === renderSceneIndex) {
          const target = document.getElementById('km-' + idx);
          if (target) target.textContent = translatedText;
        }
      });
    });
  }
}

// ============================================================
//  AUTO-SCROLL
// ============================================================
function keepActiveLineVisible(force) {
  if (!autoScrollEnabled && !force) return;

  requestAnimationFrame(function() {
    if (!dialogueContainer) return;

    const activeLine = dialogueEl.querySelector('.line[data-idx="' + lineIdx + '"]');
    if (!activeLine) return;

    const containerRect = dialogueContainer.getBoundingClientRect();
    const lineRect = activeLine.getBoundingClientRect();
    const topInset = 28;
    const bottomInset = 34;
    let nextScroll = dialogueContainer.scrollTop;

    if (lineRect.bottom > containerRect.bottom - bottomInset) {
      nextScroll += lineRect.bottom - (containerRect.bottom - bottomInset);
    } else if (lineRect.top < containerRect.top + topInset) {
      nextScroll -= (containerRect.top + topInset) - lineRect.top;
    } else if (!force) {
      return;
    }

    const maxScroll = Math.max(0, dialogueContainer.scrollHeight - dialogueContainer.clientHeight);
    dialogueContainer.scrollTo({
      top: Math.max(0, Math.min(nextScroll, maxScroll)),
      behavior: 'smooth'
    });
  });
}

function scrollToBottom() {
  keepActiveLineVisible(false);
}

function forceScrollToBottom() {
  forceAutoScroll = true;
  keepActiveLineVisible(true);
  setTimeout(function() {
    forceAutoScroll = false;
  }, 500);
}

// ============================================================
//  AUTO-PLAY
// ============================================================
function stopAutoPlay() {
  if (!autoPlaying) return;

  autoPlaying = false;
  document.body.classList.remove('auto-playing');
  window.speechSynthesis.cancel();

  autoPlayBtn.textContent = '▶ លេងស្វ័យប្រវត្តិ';

  if (bgMusic.src) fadeMusic(0, 500);
}

function autoPlayStep() {
  if (!autoPlaying) return;

  const scene = scenes[sceneIdx];
  const delay = getLineDelay();

  if (lineIdx < scene.lines.length - 1) {
    lineIdx++;
    updateReveal();

    GAME.totalLinesRevealed++;
    if (GAME.totalLinesRevealed % 5 === 0) addXP(2);

    checkBadges();
    saveGameState();

    setTimeout(function() { forceScrollToBottom(); }, 50);

    const line = scene.lines[lineIdx];
    const btn = dialogueEl.querySelector('.speak-btn:not(.mic-btn)[data-line="' + lineIdx + '"]');

    speak(line.en, line.speaker, btn, function() {
      if (!autoPlaying) return;
      setTimeout(autoPlayStep, delay);
    });
  } else {
    GAME.totalScenesCompleted++;
    if (GAME.totalScenesCompleted % 2 === 0) addXP(5);

    checkBadges();
    saveGameState();

    const target = parseFloat(musicVolume.value);
    if (bgMusic.src) fadeMusic(target * 0.3, 400);

    setTimeout(function() {
      if (!autoPlaying) return;

      sceneIdx = (sceneIdx + 1) % scenes.length;
      lineIdx = -1;
      renderScene();

      if (bgMusic.src) fadeMusic(target, 600);

      setTimeout(autoPlayStep, delay * 1.27);
    }, delay * 2.4);
  }
}

function startAutoPlay() {
  if (autoPlaying) return;

  autoPlayBtn.disabled = true;
  document.body.classList.add('auto-playing');

  let count = 3;
  countdownOverlay.style.display = 'flex';
  countdownNum.textContent = count;
  countdownLabel.textContent = 'រៀបចំ...';

  const tick = setInterval(function() {
    count--;

    if (count > 0) {
      countdownNum.textContent = count;
    } else {
      clearInterval(tick);
      countdownOverlay.style.display = 'none';

      autoPlayBtn.disabled = false;
      autoPlaying = true;
      autoPlayBtn.textContent = '⏸ ឈប់';

      if (bgMusic.src) fadeMusic(parseFloat(musicVolume.value), 700);

      autoPlayStep();
    }
  }, 800);
}

// ============================================================
//  QUIZ
// ============================================================
let pendingAfterQuiz = null;

function closeQuiz() {
  quizOverlay.classList.remove('show');

  const fn = pendingAfterQuiz;
  pendingAfterQuiz = null;

  if (fn) fn();
}

function maybeShowQuiz(afterFn) {
  const scene = scenes[sceneIdx];

  if (!scene.lines || scene.lines.length < 2) {
    afterFn();
    return;
  }

  const qIdx = Math.floor(Math.random() * scene.lines.length);
  const correct = scene.lines[qIdx];

  let pool = scene.lines.filter(function(_, i) { return i !== qIdx; }).map(function(l) { return l.en; });

  if (pool.length < 3) {
    const others = scenes.flatMap(function(s) {
      return s.lines.map(function(l) { return l.en; });
    }).filter(function(en) {
      return en !== correct.en && !pool.includes(en);
    });

    while (pool.length < 3 && others.length) {
      pool.push(others.splice(Math.floor(Math.random() * others.length), 1)[0]);
    }
  }

  const options = shuffle([correct.en, ...pool.slice(0, 3)]);

  quizPrompt.textContent = correct.km;
  quizOptions.innerHTML = '';
  pendingAfterQuiz = afterFn;

  options.forEach(function(optText) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost quiz-opt';
    btn.textContent = optText;

    btn.addEventListener('click', function() {
      const isCorrect = optText === correct.en;

      btn.classList.add(isCorrect ? 'correct' : 'wrong');

      if (!isCorrect) {
        [...quizOptions.children].forEach(function(b) {
          if (b.textContent === correct.en) b.classList.add('correct');
        });
      }

      quizOptions.querySelectorAll('button').forEach(function(b) {
        b.disabled = true;
      });

      if (isCorrect) {
        GAME.totalQuizzesCorrect++;
        addXP(5);
        addPoints(3);
        checkBadges();
        saveGameState();
      }

      setTimeout(closeQuiz, 1100);
    });

    quizOptions.appendChild(btn);
  });

  quizOverlay.classList.add('show');
}

quizSkipBtn.addEventListener('click', closeQuiz);

// ============================================================
//  BACKGROUND MUSIC
// ============================================================
function fadeMusic(targetVol, duration) {
  if (!bgMusic.src) return;

  clearInterval(fadeInterval);

  if (targetVol > 0 && bgMusic.paused) bgMusic.play();

  const startVol = bgMusic.volume;
  const steps = 20;
  const stepTime = duration / steps;
  let i = 0;

  fadeInterval = setInterval(function() {
    i++;
    bgMusic.volume = Math.max(0, Math.min(1, startVol + (targetVol - startVol) * (i / steps)));

    if (i >= steps) {
      clearInterval(fadeInterval);
      if (targetVol <= 0.001) bgMusic.pause();
    }
  }, stepTime);
}

musicFileInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|webm)$/i.test(file.name);
  if (!isAudio) {
    musicHint.textContent = '⚠ សូមជ្រើសរើស audio file ដូចជា MP3, WAV, OGG ឬ M4A';
    musicHint.className = 'music-hint error';
    musicFileInput.value = '';
    return;
  }

  if (bgMusicUrl) URL.revokeObjectURL(bgMusicUrl);
  bgMusic.pause();
  bgMusicUrl = URL.createObjectURL(file);
  bgMusic.src = bgMusicUrl;
  bgMusic.load();
  bgMusic.volume = parseFloat(musicVolume.value) || 0.15;

  musicControls.style.display = 'flex';
  musicToggle.textContent = '▶ ចាក់';
  musicToggle.classList.remove('playing');
  musicHint.textContent = 'បានផ្ទុក៖ ' + file.name + ' — ចុច "ចាក់" ដើម្បីចាប់ផ្តើម';
  musicHint.className = 'music-hint loaded';
});

bgMusic.addEventListener('error', function() {
  musicHint.textContent = '⚠ មិនអាចអាន audio file នេះបានទេ។ សូមសាកល្បង MP3 ឬ WAV ផ្សេងទៀត។';
  musicHint.className = 'music-hint error';
  musicToggle.classList.remove('playing');
  musicToggle.textContent = '▶ ចាក់';
});

musicToggle.addEventListener('click', function() {
  if (!bgMusic.src) {
    musicHint.textContent = 'សូមជ្រើសរើសភ្លេងជាមុនសិន';
    musicHint.className = 'music-hint error';
    return;
  }

  if (bgMusic.paused) {
    bgMusic.volume = parseFloat(musicVolume.value) || 0.15;
    bgMusic.play().then(function() {
      musicToggle.textContent = '⏸ ផ្អាក';
      musicToggle.classList.add('playing');
    }).catch(function() {
      musicHint.textContent = '⚠ Browser មិនអនុញ្ញាតឲ្យចាក់ភ្លេងទេ។ សូមចុចប៊ូតុងចាក់ម្ដងទៀត។';
      musicHint.className = 'music-hint error';
    });
  } else {
    bgMusic.pause();
    musicToggle.textContent = '▶ ចាក់';
    musicToggle.classList.remove('playing');
  }
});

musicVolume.addEventListener('input', function() {
  bgMusic.volume = parseFloat(musicVolume.value);
  musicVolLabel.textContent = Math.round(bgMusic.volume * 100) + '%';
});

// ============================================================
//  EVENT LISTENERS
// ============================================================
sceneSelect.addEventListener('change', function() {
  stopAutoPlay();
  window.speechSynthesis.cancel();

  sceneIdx = parseInt(this.value, 10);
  lineIdx = -1;
  renderScene();
});

document.getElementById('autoPlayBtn').addEventListener('click', function() {
  if (autoPlaying) stopAutoPlay();
  else startAutoPlay();
});

document.getElementById('autoSpeakBtn').addEventListener('click', function(e) {
  autoSpeak = !autoSpeak;
  e.target.textContent = autoSpeak ? '🔊 អាន: បើក' : '🔇 អាន: បិទ';
  e.target.classList.toggle('active', autoSpeak);

  if (!autoSpeak) window.speechSynthesis.cancel();
});

document.getElementById('nextLineBtn').addEventListener('click', function() {
  stopAutoPlay();

  if (!dialogueEl.children.length) renderScene();
  const total = scenes[sceneIdx].lines.length;

  if (lineIdx < total - 1) {
    lineIdx++;
    updateReveal();

    GAME.totalLinesRevealed++;
    if (GAME.totalLinesRevealed % 5 === 0) addXP(2);

    checkBadges();
    saveGameState();

    setTimeout(function() { forceScrollToBottom(); }, 50);
    speakCurrentLine();
  } else {
    maybeShowQuiz(function() {
      sceneIdx = (sceneIdx + 1) % scenes.length;
      lineIdx = -1;
      renderScene();
    });
  }
});

document.getElementById('nextSceneBtn').addEventListener('click', function() {
  stopAutoPlay();
  window.speechSynthesis.cancel();

  sceneIdx = (sceneIdx + 1) % scenes.length;
  lineIdx = -1;
  renderScene();
});

document.getElementById('prevBtn').addEventListener('click', function() {
  stopAutoPlay();
  window.speechSynthesis.cancel();

  if (lineIdx > -1) {
    lineIdx--;
    updateReveal();
  } else {
    sceneIdx = (sceneIdx - 1 + scenes.length) % scenes.length;
    lineIdx = scenes[sceneIdx].lines.length - 1;
    renderScene();
  }
});

lineDelaySlider.addEventListener('input', function() {
  lineDelayLabel.textContent = parseFloat(this.value).toFixed(2) + 's';
});

document.getElementById('translateLangSelect').addEventListener('change', function() {
  targetLang = this.value;
  renderScene();
});

// ============================================================
//  FULLSCREEN
// ============================================================
document.getElementById('fsBtn').addEventListener('click', function() {
  if (!document.fullscreenElement) {
    (appRoot.requestFullscreen || appRoot.webkitRequestFullscreen)?.call(appRoot);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
  }
});

document.addEventListener('fullscreenchange', function() {
  document.getElementById('fsBtn').textContent = document.fullscreenElement ? '⤢' : '⛶';
});

// ============================================================
//  THEME PANEL
// ============================================================
document.getElementById('themeBtn').addEventListener('click', function() {
  const panel = document.getElementById('themePanel');
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
});

// Color inputs
Object.keys(COLOR_VAR_MAP).forEach(function(id) {
  document.getElementById(id).addEventListener('input', function() {
    document.documentElement.style.setProperty(COLOR_VAR_MAP[id], this.value);
  });
});

document.getElementById('resetThemeBtn').addEventListener('click', function() {
  Object.keys(COLOR_VAR_MAP).forEach(function(id) {
    document.getElementById(id).value = THEME_DEFAULTS[id];
    document.documentElement.style.setProperty(COLOR_VAR_MAP[id], THEME_DEFAULTS[id]);
  });

  applyDarkMode(false);
  removeBgImage();
});

document.getElementById('darkModeBtn').addEventListener('click', function() {
  applyDarkMode(!darkMode);
});

// ============================================================
//  BACKGROUND IMAGE
// ============================================================
document.getElementById('bgImageFile').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (bgImageUrl) URL.revokeObjectURL(bgImageUrl);

  bgImageUrl = URL.createObjectURL(file);
  document.documentElement.style.setProperty('--custom-bg-image', 'url(' + bgImageUrl + ')');
  document.body.classList.add('has-bg-image');

  document.getElementById('bgImageControls').style.display = 'flex';
});

document.getElementById('removeBgImageBtn').addEventListener('click', removeBgImage);

// ============================================================
//  SETTINGS IMPORT/EXPORT
// ============================================================
document.getElementById('exportSettingsBtn').addEventListener('click', function() {
  const blob = new Blob([JSON.stringify(collectSettings(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'english-share-settings.json';

  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
});

document.getElementById('importSettingsBtn').addEventListener('click', function() {
  document.getElementById('importSettingsFile').click();
});

document.getElementById('importSettingsFile').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function() {
    try {
      applySettings(JSON.parse(reader.result));
      renderScene();
    } catch (err) {
      alert('⚠ JSON មិនត្រឹមត្រូវ');
    }

    document.getElementById('importSettingsFile').value = '';
  };

  reader.readAsText(file);
});

// ============================================================
//  HIDE HEADER & SETTINGS
// ============================================================
document.getElementById('hideHeaderBtn').addEventListener('click', toggleHeader);

document.getElementById('hideSettingsBtn').addEventListener('click', function() {
  if (cleanScreenMode) {
    cleanScreenMode = false;
    document.body.classList.remove('clean-screen');
    document.getElementById('hideHeaderBtn').textContent = '👤';
    document.getElementById('hideHeaderBtn').title = 'Hide header';
  }

  settingsHidden = !settingsHidden;

  document.querySelector('.main-card').classList.toggle('focus-mode', settingsHidden);
  this.classList.toggle('active', settingsHidden);
  this.textContent = settingsHidden ? '👁' : '⚙';
  this.title = settingsHidden ? 'បង្ហាញ' : 'លាក់';
});

// ============================================================
//  RECORD BUTTON
// ============================================================
document.getElementById('recordBtn').addEventListener('click', function() {
  document.body.classList.add('recording-mode');
  sceneIdx = 0;
  lineIdx = -1;
  renderScene();

  if (!settingsHidden) {
    settingsHidden = true;
    document.querySelector('.main-card').classList.add('focus-mode');
    document.getElementById('hideSettingsBtn').classList.add('active');
    document.getElementById('hideSettingsBtn').textContent = '👁';
  }

  function goFullscreenAndPlay() {
    countdownLabel.textContent = '';

    let fsResult;
    try {
      fsResult = (appRoot.requestFullscreen || appRoot.webkitRequestFullscreen)?.call(appRoot);
    } catch (err) { fsResult = null; }

    Promise.resolve(fsResult).catch(function() {}).finally(function() {
      setTimeout(startAutoPlay, 300);
    });
  }

  let seconds = Math.max(0, parseInt(document.getElementById('preRollSeconds').value, 10) || 0);

  if (seconds <= 0) {
    goFullscreenAndPlay();
    return;
  }

  countdownLabel.textContent = 'រៀបចំកម្មវិធីថតអេក្រង់របស់អ្នក...';
  countdownNum.textContent = seconds;
  countdownOverlay.style.display = 'flex';

  const preRollTick = setInterval(function() {
    seconds--;

    if (seconds > 0) {
      countdownNum.textContent = seconds;
    } else {
      clearInterval(preRollTick);
      countdownOverlay.style.display = 'none';
      goFullscreenAndPlay();
    }
  }, 1000);
});

document.addEventListener('fullscreenchange', function() {
  if (!document.fullscreenElement) document.body.classList.remove('recording-mode');
});
// ============================================================
//  WATERMARK
// ============================================================
const watermarkPositions = {
  br: { top: '', bottom: '14px', left: '', right: '14px' },
  bl: { top: '', bottom: '14px', left: '14px', right: '' },
  tr: { top: '14px', bottom: '', left: '', right: '14px' },
  tl: { top: '14px', bottom: '', left: '14px', right: '' },
};

document.getElementById('watermarkToggleBtn').addEventListener('click', function() {
  const isOn = this.textContent.includes('បើក');
  const newOn = !isOn;

  this.textContent = newOn ? '🏷 Watermark: បើក' : '🏷 Watermark: បិទ';
  this.classList.toggle('active', newOn);
  this.classList.toggle('inactive', !newOn);

  document.getElementById('watermark').classList.toggle('hidden', !newOn);
});

document.getElementById('watermarkPosSelect').addEventListener('change', function() {
  const pos = watermarkPositions[this.value] || watermarkPositions.br;
  Object.assign(document.getElementById('watermark').style, pos);
});

// ============================================================
//  SCENE MANAGER
// ============================================================
document.getElementById('sceneManagerBtn').addEventListener('click', function() {
  const panel = document.getElementById('scenePanel');
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
});

function addLineRow(speaker, en, km) {
  const container = document.getElementById('newSceneLines');
  const row = document.createElement('div');
  row.className = 'line-row';

  const s = speaker === 'B' ? 'B' : 'A';

  row.innerHTML = `
    <select class="row-speaker">
      <option value="A"${s === 'A' ? ' selected' : ''}>A</option>
      <option value="B"${s === 'B' ? ' selected' : ''}>B</option>
    </select>
    <input type="text" class="row-en" placeholder="English" value="${escapeHtml(en || '')}">
    <input type="text" class="row-km" placeholder="ខ្មែរ" value="${escapeHtml(km || '')}">
    <button type="button" class="btn btn-ghost row-remove" title="លុប">✕</button>
  `;

  row.querySelector('.row-remove').addEventListener('click', function() {
    row.remove();
  });

  container.appendChild(row);
}

document.getElementById('addLineRowBtn').addEventListener('click', function() { addLineRow(); });

// Initial line row
addLineRow();

document.getElementById('saveSceneBtn').addEventListener('click', function() {
  const topic = document.getElementById('newSceneTopic').value.trim();
  const rows = [...document.getElementById('newSceneLines').querySelectorAll('.line-row')];

  const lines = rows.map(function(r) {
    return {
      speaker: r.querySelector('.row-speaker').value,
      en: r.querySelector('.row-en').value.trim(),
      km: r.querySelector('.row-km').value.trim(),
    };
  }).filter(function(l) { return l.en && l.km; });

  if (!topic || lines.length === 0) {
    document.getElementById('sceneManagerHint').textContent = '⚠ សូមបំពេញប្រធានបទ និងបន្ទាត់';
    return;
  }

  scenes.push({ topic: topic, lines: lines });

  document.getElementById('sceneManagerHint').textContent = '✅ បានបន្ថែម Scene "' + topic + '"!';

  document.getElementById('newSceneTopic').value = '';
  document.getElementById('newSceneLines').innerHTML = '';

  addLineRow();

  sceneIdx = scenes.length - 1;
  lineIdx = -1;
  renderScene();

  addPoints(5);
});

document.getElementById('importJsonBtn').addEventListener('click', function() {
  let data;

  try {
    data = JSON.parse(document.getElementById('jsonImportArea').value);
  } catch (err) {
    document.getElementById('sceneManagerHint').textContent = '⚠ JSON មិនត្រឹមត្រូវ';
    return;
  }

  const arr = Array.isArray(data) ? data : [data];
  let added = 0;

  arr.forEach(function(item) {
    if (item && item.topic && Array.isArray(item.lines)) {
      const cleanLines = item.lines
        .filter(function(l) { return l && l.en && l.km; })
        .map(function(l) {
          return {
            speaker: l.speaker === 'B' ? 'B' : 'A',
            en: String(l.en),
            km: String(l.km)
          };
        });

      if (cleanLines.length) {
        scenes.push({ topic: String(item.topic), lines: cleanLines });
        added++;
      }
    }
  });

  if (added === 0) {
    document.getElementById('sceneManagerHint').textContent = '⚠ រកមិនឃើញ Scene ត្រឹមត្រូវ';
    return;
  }

  document.getElementById('sceneManagerHint').textContent = '✅ បាននាំចូល ' + added + ' Scene!';

  document.getElementById('jsonImportArea').value = '';

  sceneIdx = scenes.length - 1;
  lineIdx = -1;
  renderScene();

  addPoints(added * 2);
});

// ============================================================
//  SUBTITLE EXPORT
// ============================================================
function formatSrtTime(totalSeconds) {
  const clamped = Math.max(0, totalSeconds);
  const ms = Math.round((clamped % 1) * 1000);
  const totalWhole = Math.floor(clamped);

  const h = Math.floor(totalWhole / 3600);
  const m = Math.floor((totalWhole % 3600) / 60);
  const s = totalWhole % 60;

  const p2 = function(n) { return String(n).padStart(2, '0'); };
  const p3 = function(n) { return String(n).padStart(3, '0'); };

  return p2(h) + ':' + p2(m) + ':' + p2(s) + ',' + p3(ms);
}

function estimateLineDuration(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerSecond = 2.25;
  return Math.max(1.2, words / wordsPerSecond);
}

function generateSRT() {
  const delay = getLineDelay() / 1000;
  let t = 0.5;
  let idx = 1;
  let srt = '';

  scenes.forEach(function(scene, sIdx) {
    scene.lines.forEach(function(line, lIdx) {
      const dur = estimateLineDuration(line.en);
      const start = t;
      const end = t + dur;

      srt += idx + '\n';
      srt += formatSrtTime(start) + ' --> ' + formatSrtTime(end) + '\n';
      srt += line.en + '\n';
      srt += line.km + '\n\n';

      idx++;
      t = end + delay;

      if (lIdx === scene.lines.length - 1 && sIdx !== scenes.length - 1) {
        t += delay * 3.67;
      }
    });
  });

  return srt;
}

document.getElementById('exportSrtBtn').addEventListener('click', function() {
  const blob = new Blob([generateSRT()], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'english-share-subtitles.srt';

  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
});

// ============================================================
//  KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', function(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

  switch (e.key.toLowerCase()) {
    case 'h':
      e.preventDefault();
      toggleHeader();
      break;
    case 's':
      e.preventDefault();
      document.getElementById('hideSettingsBtn').click();
      break;
    case 'c':
      e.preventDefault();
      toggleCleanScreen();
      break;
  }
});

// ============================================================
//  SWIPE GESTURES
// ============================================================
const swipeTarget = document.getElementById('conversationSection');
let touchStartX = 0;
let touchStartY = 0;

swipeTarget.addEventListener('touchstart', function(e) {
  const t = e.changedTouches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
}, { passive: true });

swipeTarget.addEventListener('touchend', function(e) {
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;

  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    if (dx < 0) {
      document.getElementById('nextLineBtn').click();
    } else {
      document.getElementById('prevBtn').click();
    }
  }
}, { passive: true });

// ============================================================
//  INITIALIZATION
// ============================================================
loadGameState();
updateStreak();
startSessionTimer();

// Apply initial watermark position
Object.assign(watermarkEl.style, watermarkPositions.br);

// Set initial watermark toggle state
const initialWmOn = document.getElementById('watermarkToggleBtn').textContent.includes('បើក');
document.getElementById('watermarkToggleBtn').classList.toggle('active', initialWmOn);

// Apply display settings and activate the controls that sit outside the main card.
if (typeof initDisplayControls === 'function') initDisplayControls();

// Render initial scene. The fallback covers slow/cached script initialization.
renderScene();
setTimeout(function() {
  if (!dialogueEl.children.length) renderScene();
}, 0);
window.addEventListener('load', function() {
  if (typeof initDisplayControls === 'function') initDisplayControls();
  if (!dialogueEl.children.length) renderScene();
});

// Update gamification UI
updateGamificationUI();

// ============================================================
//  CLEANUP
// ============================================================
window.addEventListener('beforeunload', function() {
  window.speechSynthesis.cancel();

  if (bgImageUrl) URL.revokeObjectURL(bgImageUrl);
  if (bgMusicUrl) URL.revokeObjectURL(bgMusicUrl);
  if (fadeInterval) clearInterval(fadeInterval);
  if (GAME.sessionTimer) clearInterval(GAME.sessionTimer);

  saveGameState();
});