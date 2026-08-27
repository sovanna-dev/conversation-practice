export const escapeHtml = (str) => {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
};

export const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const formatSrtTime = (totalSeconds) => {
  const clamped = Math.max(0, totalSeconds);
  const ms = Math.round((clamped % 1) * 1000);
  const totalWhole = Math.floor(clamped);
  const h = Math.floor(totalWhole / 3600);
  const m = Math.floor((totalWhole % 3600) / 60);
  const s = totalWhole % 60;
  const p2 = n => String(n).padStart(2, '0');
  const p3 = n => String(n).padStart(3, '0');
  return `${p2(h)}:${p2(m)}:${p2(s)},${p3(ms)}`;
};

export const estimateLineDuration = (text) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerSecond = 2.25;
  return Math.max(1.2, words / wordsPerSecond);
};

export const generateSRT = (scenes, lineDelaySeconds) => {
  let t = 0.5;
  let idx = 1;
  let srt = '';
  scenes.forEach((scene, sIdx) => {
    scene.lines.forEach((line, lIdx) => {
      const dur = estimateLineDuration(line.en);
      const start = t;
      const end = t + dur;
      srt += `${idx}\n${formatSrtTime(start)} --> ${formatSrtTime(end)}\n${line.en}\n${line.km}\n\n`;
      idx++;
      t = end + lineDelaySeconds;
    });
  });
  return srt;
};
