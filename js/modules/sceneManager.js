import { scenes } from '../data.js';

const builtInSceneCount = scenes.length;

const normalizeScene = (scene = {}) => ({
  topic: scene.topic || scene.title || 'Untitled Scene',
  lines: (scene.lines || scene.dialogue || []).map(line => ({
    speaker: line.speaker === 'B' ? 'B' : 'A',
    en: line.en || line.text || '',
    km: line.km || line.khmer || ''
  })).filter(line => line.en)
});

const saveScenes = () => {
  localStorage.setItem('customScenes', JSON.stringify(scenes.slice(builtInSceneCount)));
};

export const loadCustomScenes = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('customScenes') || '[]');
    if (Array.isArray(saved)) saved.map(normalizeScene).forEach(scene => {
      if (scene.lines.length) scenes.push(scene);
    });
  } catch (error) {
    console.warn('Unable to load saved scenes:', error);
  }
};

export const addScene = (sceneData) => {
  const scene = normalizeScene(sceneData);
  if (!scene.lines.length) throw new Error('A scene must contain at least one line.');
  scenes.push(scene);
  saveScenes();
  return scenes.length - 1;
};

export const deleteScene = (id) => {
  const index = Number(id);
  if (!Number.isInteger(index) || index < 0 || index >= scenes.length) return false;
  scenes.splice(index, 1);
  saveScenes();
  return true;
};

export const updateLine = (sceneId, lineIndex, newData) => {
  const line = scenes[Number(sceneId)]?.lines?.[Number(lineIndex)];
  if (!line) return false;
  Object.assign(line, {
    speaker: newData.speaker === 'B' ? 'B' : 'A',
    en: newData.en || newData.text || line.en,
    km: newData.km || newData.khmer || line.km
  });
  saveScenes();
  return true;
};

export const exportAllScenes = () => {
  const blob = new Blob([JSON.stringify(scenes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'conversation-scenes.json';
  link.click();
  URL.revokeObjectURL(url);
};
