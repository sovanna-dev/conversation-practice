// ============================================================
//  GAMIFICATION SYSTEM
//  Handles points, XP, levels, badges, streaks, session timer
// ============================================================

const GAME = {
  points: 0,
  xp: 0,
  level: 1,
  streak: 0,
  lastSessionDate: null,
  sessionSeconds: 0,
  sessionTimer: null,
  badges: [],
  totalLinesRevealed: 0,
  totalScenesCompleted: 0,
  totalQuizzesCorrect: 0,
  totalSpeaks: 0,
  totalMics: 0,
};

const BADGES = [
  { id: 'first_step', icon: '👣', name: 'ជំហានដំបូង', desc: 'បើកបន្ទាត់ដំបូង', check: () => GAME.totalLinesRevealed >= 1 },
  { id: 'talker', icon: '🗣️', name: 'អ្នកនិយាយ', desc: 'ចុចអាន 10 ដង', check: () => GAME.totalSpeaks >= 10 },
  { id: 'scene_master', icon: '🎬', name: 'ម្ចាស់ឆាក', desc: 'បញ្ចប់ 5 Scene', check: () => GAME.totalScenesCompleted >= 5 },
  { id: 'quiz_king', icon: '👑', name: 'ស្តេចតេស្ត', desc: 'ឆ្លើយតេស្តត្រូវ 5 ដង', check: () => GAME.totalQuizzesCorrect >= 5 },
  { id: 'streak_3', icon: '🔥', name: 'ភ្លើងឆេះ', desc: 'Streak 3 ថ្ងៃ', check: () => GAME.streak >= 3 },
  { id: 'streak_7', icon: '⚡', name: 'ផ្លេកបន្ទោរ', desc: 'Streak 7 ថ្ងៃ', check: () => GAME.streak >= 7 },
  { id: 'mic_user', icon: '🎙️', name: 'អ្នកថតសំឡេង', desc: 'ប្រើមីក្រូ 5 ដង', check: () => GAME.totalMics >= 5 },
  { id: 'level_5', icon: '⭐', name: 'កម្រិត 5', desc: 'ឈានដល់កម្រិត 5', check: () => GAME.level >= 5 },
];

// ============================================================
//  XP CALCULATIONS
// ============================================================
function xpForLevel(level) {
  return Math.floor(50 * Math.pow(1.4, level - 1));
}

function getLevelXp() {
  return xpForLevel(GAME.level);
}

function getNextLevelXp() {
  return xpForLevel(GAME.level + 1);
}

function getLevelProgress() {
  const current = getLevelXp();
  const next = getNextLevelXp();
  const xpInLevel = GAME.xp - current;
  return Math.min(1, Math.max(0, xpInLevel / (next - current)));
}

// ============================================================
//  UI UPDATES
// ============================================================
function updateGamificationUI() {
  const progress = getLevelProgress();
  const elements = {
    levelBadge: document.getElementById('levelBadge'),
    levelTag: document.getElementById('levelTag'),
    xpBarFill: document.getElementById('xpBarFill'),
    xpDisplay: document.getElementById('xpDisplay'),
    xpNext: document.getElementById('xpNext'),
    pointsDisplay: document.getElementById('pointsDisplay'),
    streakDisplay: document.getElementById('streakDisplay'),
  };

  if (elements.levelBadge) elements.levelBadge.textContent = GAME.level;
  if (elements.levelTag) elements.levelTag.textContent = 'កម្រិត ' + GAME.level;
  if (elements.xpBarFill) elements.xpBarFill.style.width = (progress * 100) + '%';
  if (elements.xpDisplay) elements.xpDisplay.textContent = GAME.xp + ' XP';
  if (elements.xpNext) elements.xpNext.textContent = getNextLevelXp() + ' XP';
  if (elements.pointsDisplay) elements.pointsDisplay.textContent = GAME.points;
  if (elements.streakDisplay) elements.streakDisplay.textContent = GAME.streak + '🔥';

  renderBadges();
  saveGameState();
}

function renderBadges() {
  const container = document.getElementById('badgeCollection');
  if (!container) return;
  container.innerHTML = '';

  BADGES.forEach(function(b) {
    const unlocked = GAME.badges.includes(b.id);
    const div = document.createElement('div');
    div.className = 'badge-item ' + (unlocked ? 'unlocked' : 'locked');
    div.title = b.name + ': ' + b.desc;
    div.innerHTML = b.icon + '<span class="badge-tooltip">' + b.name + (unlocked ? ' ✅' : ' 🔒') + '</span>';
    container.appendChild(div);
  });
}

// ============================================================
//  GAMIFICATION ACTIONS
// ============================================================
function addXP(amount) {
  GAME.xp += amount;
  GAME.points += Math.floor(amount / 2);
  let leveledUp = false;

  while (GAME.xp >= getNextLevelXp()) {
    GAME.level++;
    leveledUp = true;
    GAME.points += GAME.level * 10;
    showLevelUp(GAME.level);
    spawnConfetti(40);
  }

  updateGamificationUI();

  if (leveledUp) checkBadges();
  if (amount > 0 && !leveledUp) showXPPopup(amount);
}

function addPoints(amount) {
  GAME.points += amount;
  updateGamificationUI();
}

function showXPPopup(amount) {
  const el = document.createElement('div');
  el.className = 'xp-flash';
  el.textContent = '+' + amount + ' XP';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function showLevelUp(level) {
  const el = document.createElement('div');
  el.className = 'level-up-flash';
  el.innerHTML = '🎉 កម្រិត ' + level + '!<span class="sub">+' + (level * 10) + ' ពិន្ទុបន្ថែម</span>';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
  spawnConfetti(60);
}

function showBadgeUnlock(badge) {
  const el = document.createElement('div');
  el.className = 'badge-unlock-flash';
  el.innerHTML = '🏅 ' + badge.icon + ' ' + badge.name + '<span class="sub">' + badge.desc + '</span>';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
  spawnConfetti(50);
}

function spawnConfetti(count) {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  const colors = ['#b8863f', '#3f6355', '#a8412f', '#f5a623', '#e74c3c', '#3498db', '#2ecc71', '#f1c40f'];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const size = 6 + Math.random() * 8;
    piece.style.width = size + 'px';
    piece.style.height = size + 'px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = Math.random() * 100 + '%';
    piece.style.top = '-10px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.animationDuration = (1.5 + Math.random() * 2) + 's';
    piece.style.animationDelay = Math.random() * 0.5 + 's';
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 3000);
}

// ============================================================
//  BADGE CHECKING
// ============================================================
function checkBadges() {
  let unlocked = false;

  BADGES.forEach(function(b) {
    if (!GAME.badges.includes(b.id) && b.check()) {
      GAME.badges.push(b.id);
      unlocked = true;
      showBadgeUnlock(b);
      addPoints(15);
    }
  });

  if (unlocked) updateGamificationUI();
  return unlocked;
}

// ============================================================
//  STREAK TRACKING
// ============================================================
function updateStreak() {
  const today = new Date().toDateString();

  if (GAME.lastSessionDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (GAME.lastSessionDate === yesterdayStr) {
      GAME.streak++;
    } else if (GAME.lastSessionDate !== today) {
      GAME.streak = 1;
    }

    GAME.lastSessionDate = today;
    updateGamificationUI();
    checkBadges();
  }
}

// ============================================================
//  SESSION TIMER
// ============================================================
function startSessionTimer() {
  if (GAME.sessionTimer) return;

  GAME.sessionTimer = setInterval(function() {
    GAME.sessionSeconds++;
    const mins = String(Math.floor(GAME.sessionSeconds / 60)).padStart(2, '0');
    const secs = String(GAME.sessionSeconds % 60).padStart(2, '0');
    const el = document.getElementById('sessionTime');

    if (el) el.textContent = mins + ':' + secs;
    if (GAME.sessionSeconds % 300 === 0) addXP(5);
  }, 1000);
}

// ============================================================
//  SAVE / LOAD
// ============================================================
function saveGameState() {
  try {
    const state = {
      points: GAME.points,
      xp: GAME.xp,
      level: GAME.level,
      streak: GAME.streak,
      lastSessionDate: GAME.lastSessionDate,
      sessionSeconds: GAME.sessionSeconds,
      badges: GAME.badges,
      totalLinesRevealed: GAME.totalLinesRevealed,
      totalScenesCompleted: GAME.totalScenesCompleted,
      totalQuizzesCorrect: GAME.totalQuizzesCorrect,
      totalSpeaks: GAME.totalSpeaks,
      totalMics: GAME.totalMics,
    };
    localStorage.setItem('english_share_game', JSON.stringify(state));
  } catch (e) { /* ignore */ }
}

function loadGameState() {
  try {
    const raw = localStorage.getItem('english_share_game');
    if (!raw) return;
    const state = JSON.parse(raw);
    Object.assign(GAME, state);
  } catch (e) { /* ignore */ }
}