export const speak = (text, rate = 0.9) => {
  // Cancel previous speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;

  // Find a natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural'));
  if (preferredVoice) utterance.voice = preferredVoice;

  window.speechSynthesis.speak(utterance);
};
