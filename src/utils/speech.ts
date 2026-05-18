let currentAudio: HTMLAudioElement | null = null;
let currentPlayId = 0;
let currentResolve: (() => void) | null = null;

const playAudioFile = (id: string, playId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    currentResolve = resolve; // lưu để cancel từ bên ngoài

    const audio = new Audio(`/audio/${id}.mp3`);
    currentAudio = audio;

    audio.onended = () => {
      currentResolve = null;
      resolve();
    };
    audio.onerror = () => {
      currentResolve = null;
      if (currentPlayId !== playId) { resolve(); return; }
      reject(new Error('audio-file-not-found'));
    };
    audio.play().catch((e) => {
      currentResolve = null;
      if (currentPlayId !== playId) { resolve(); return; }
      reject(e);
    });
  });
};

const speakWithWebSpeech = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 1;
    const viVoice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith('vi'));
    if (viVoice) utterance.voice = viVoice;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    setTimeout(() => window.speechSynthesis.speak(utterance), 100);
  });
};

export const speak = async (id: string, text?: string): Promise<void> => {
  const playId = ++currentPlayId;

  // Resolve promise cũ ngay → ItemCard cũ sẽ gọi setPlaying(false)
  if (currentResolve) {
    currentResolve();
    currentResolve = null;
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  window.speechSynthesis?.cancel();

  try {
    await playAudioFile(id, playId);
  } catch {
    if (currentPlayId === playId && text) {
      await speakWithWebSpeech(text);
    }
  }
};

export const stopSpeaking = () => {
  currentPlayId++;
  if (currentResolve) { currentResolve(); currentResolve = null; }
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  window.speechSynthesis?.cancel();
};
