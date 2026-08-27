let activeRecorder = null;

export const startRecording = async (onStop) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Browser does not support recording');
    return null;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const chunks = [];
    activeRecorder = new MediaRecorder(stream);

    activeRecorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    activeRecorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(chunks, { type: activeRecorder.mimeType || 'audio/webm' });
      const url = URL.createObjectURL(blob);
      onStop(url);
    };

    activeRecorder.start();
    return activeRecorder;
  } catch (err) {
    console.error('Mic access denied:', err);
    return null;
  }
};

export const stopRecording = () => {
  if (activeRecorder && activeRecorder.state === 'recording') {
    activeRecorder.stop();
  }
};
