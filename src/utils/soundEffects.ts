let audioContext: AudioContext | null = null;

export const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

export const playBellSound = () => {
  try {
    const context = audioContext || initAudioContext();

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const filter = context.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(1, now);

    oscillator.frequency.setValueAtTime(528, now);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2);

    oscillator.type = 'sine';

    oscillator.start(now);
    oscillator.stop(now + 2);
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
};
