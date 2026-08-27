export const calculateLevel = (xp) => {
  return Math.floor(Math.sqrt(xp / 50)) + 1;
};

export const checkNewBadges = (gameState, badgeDefs) => {
  const newBadges = [];
  badgeDefs.forEach(badge => {
    if (!gameState.badges.includes(badge.id)) {
      if (badge.id === 'talkative' && gameState.totalLinesRevealed >= 50) newBadges.push(badge.id);
      if (badge.id === 'first_step' && gameState.totalLinesRevealed >= 1) newBadges.push(badge.id);
      if (badge.id === 'quiz_king' && gameState.totalQuizzesCorrect >= 5) newBadges.push(badge.id);
    }
  });
  return newBadges;
};

export const updateGamificationUI = (state) => {
  const xpDisplay = document.getElementById('xpDisplay');
  const levelBadge = document.getElementById('levelBadge');
  const levelTag = document.getElementById('levelTag');
  const xpBarFill = document.getElementById('xpBarFill');
  const pointsDisplay = document.getElementById('pointsDisplay');
  const sidebarXp = document.getElementById('sidebarXp');
  const playerName = document.getElementById('playerName');

  if (xpDisplay) xpDisplay.textContent = `${state.xp} XP`;
  if (levelBadge) levelBadge.textContent = state.level;
  if (levelTag) levelTag.textContent = `Level ${state.level}`;
  if (pointsDisplay) pointsDisplay.textContent = Math.floor(state.xp / 2);
  if (sidebarXp) sidebarXp.textContent = `${state.xp} XP`;

  if (state.user) {
      if (playerName) playerName.textContent = state.user.displayName || state.user.email.split('@')[0];
  }

  // Basic XP bar calculation
  const nextLevelXp = Math.pow(state.level, 2) * 50;
  const currentLevelXp = Math.pow(state.level - 1, 2) * 50;
  const progress = ((state.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  if (xpBarFill) xpBarFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
};
