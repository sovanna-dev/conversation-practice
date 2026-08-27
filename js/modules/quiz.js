/**
 * Mini Quiz Module
 * Uses the same scene shape as data.js: { topic, lines: [{ en, km }] }.
 */

let pendingAfterQuiz = null;

export function initQuiz(skipBtnId, closeCallback) {
  const skipBtn = document.getElementById(skipBtnId);
  if (!skipBtn) return;

  skipBtn.addEventListener('click', () => {
    closeQuiz('quizOverlay');
    if (typeof closeCallback === 'function') closeCallback();
  });
}

export function maybeShowQuiz(scene, allScenes, containerIds, callbacks = {}) {
  const { overlayId, promptId, optionsId } = containerIds;
  const { onCorrect, onFinished } = callbacks;
  const overlay = document.getElementById(overlayId);
  const prompt = document.getElementById(promptId);
  const optionsContainer = document.getElementById(optionsId);

  if (!scene?.lines?.length || !overlay || !prompt || !optionsContainer) {
    onFinished?.();
    return;
  }

  const qIdx = Math.floor(Math.random() * scene.lines.length);
  const correctLine = scene.lines[qIdx];
  const correctText = correctLine.en || correctLine.text || '';

  const pool = scene.lines
    .filter((_, i) => i !== qIdx)
    .map(line => line.en || line.text || '')
    .filter(Boolean);

  const allLines = allScenes.flatMap(item => item.lines || [])
    .map(line => line.en || line.text || '')
    .filter(Boolean);

  for (const text of shuffle([...allLines])) {
    if (pool.length >= 3) break;
    if (text !== correctText && !pool.includes(text)) pool.push(text);
  }

  const options = shuffle([correctText, ...pool.slice(0, 3)]);
  prompt.textContent = correctLine.km || correctLine.khmer || 'Translate this line:';
  optionsContainer.replaceChildren();
  pendingAfterQuiz = onFinished;

  options.forEach(optionText => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ghost quiz-opt';
    button.textContent = optionText;
    button.addEventListener('click', () => {
      const isCorrect = optionText === correctText;
      button.classList.add(isCorrect ? 'correct' : 'wrong');

      if (!isCorrect) {
        [...optionsContainer.children].forEach(item => {
          if (item.textContent === correctText) item.classList.add('correct');
        });
      }

      optionsContainer.querySelectorAll('button').forEach(item => { item.disabled = true; });
      if (isCorrect) onCorrect?.();
      setTimeout(() => closeQuiz(overlayId), 1100);
    });
    optionsContainer.appendChild(button);
  });

  overlay.classList.add('show');
}

function closeQuiz(overlayId) {
  document.getElementById(overlayId)?.classList.remove('show');
  const callback = pendingAfterQuiz;
  pendingAfterQuiz = null;
  callback?.();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
