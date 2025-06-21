
// Sound utility for click interactions without background music
class SoundManager {
  private audioContext: AudioContext | null = null;
  private clickSound: AudioBuffer | null = null;
  private bellSound: AudioBuffer | null = null;
  private tickSound: AudioBuffer | null = null;
  private completionChime: AudioBuffer | null = null;

  constructor() {
    this.initializeAudioContext();
    this.createClickSound();
    this.createBellSound();
    this.createTickSound();
    this.createCompletionChime();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.log('Web Audio API not supported');
    }
  }

  private createClickSound() {
    if (!this.audioContext) return;

    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.15;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 30);
      const frequency1 = 600;
      const frequency2 = 900;
      const frequency3 = 1200;
      
      data[i] = envelope * (
        0.5 * Math.sin(2 * Math.PI * frequency1 * t) +
        0.3 * Math.sin(2 * Math.PI * frequency2 * t) +
        0.2 * Math.sin(2 * Math.PI * frequency3 * t) +
        0.1 * Math.random()
      ) * 2.5;
    }

    this.clickSound = buffer;
  }

  private createBellSound() {
    if (!this.audioContext) return;

    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.8;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 4);
      
      // Bell-like harmonics
      const fundamental = 880; // A5 note
      const harmonic2 = fundamental * 2;
      const harmonic3 = fundamental * 3;
      const harmonic4 = fundamental * 4;
      
      data[i] = envelope * (
        0.6 * Math.sin(2 * Math.PI * fundamental * t) +
        0.3 * Math.sin(2 * Math.PI * harmonic2 * t) +
        0.15 * Math.sin(2 * Math.PI * harmonic3 * t) +
        0.05 * Math.sin(2 * Math.PI * harmonic4 * t)
      ) * 3.0; // High volume for notifications
    }

    this.bellSound = buffer;
  }

  private createTickSound() {
    if (!this.audioContext) return;

    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.05;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 50);
      
      // Clock tick sound - sharp, brief tone
      const frequency = 800;
      data[i] = envelope * Math.sin(2 * Math.PI * frequency * t) * 0.3;
    }

    this.tickSound = buffer;
  }

  private createCompletionChime() {
    if (!this.audioContext) return;

    const sampleRate = this.audioContext.sampleRate;
    const duration = 2.0;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 2);
      
      // Beautiful completion chime with ascending notes
      const note1 = 523.25; // C5
      const note2 = 659.25; // E5
      const note3 = 783.99; // G5
      const note4 = 1046.50; // C6
      
      let signal = 0;
      
      // Play notes in sequence with overlap
      if (t < 0.5) signal += 0.8 * Math.sin(2 * Math.PI * note1 * t);
      if (t > 0.3 && t < 1.0) signal += 0.6 * Math.sin(2 * Math.PI * note2 * t);
      if (t > 0.6 && t < 1.5) signal += 0.4 * Math.sin(2 * Math.PI * note3 * t);
      if (t > 0.9) signal += 0.7 * Math.sin(2 * Math.PI * note4 * t);
      
      data[i] = envelope * signal * 0.8;
    }

    this.completionChime = buffer;
  }

  playClickSound() {
    if (!this.audioContext || !this.clickSound) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = this.clickSound;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      gainNode.gain.setValueAtTime(0.8, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
      
      source.start();
    } catch (error) {
      console.log('Error playing click sound:', error);
    }
  }

  playBellSound() {
    if (!this.audioContext || !this.bellSound) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = this.bellSound;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      gainNode.gain.setValueAtTime(1.0, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
      
      source.start();
    } catch (error) {
      console.log('Error playing bell sound:', error);
    }
  }

  playTickSound() {
    if (!this.audioContext || !this.tickSound) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = this.tickSound;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
      
      source.start();
    } catch (error) {
      console.log('Error playing tick sound:', error);
    }
  }

  playCompletionChime() {
    if (!this.audioContext || !this.completionChime) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = this.completionChime;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      gainNode.gain.setValueAtTime(1.0, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2.0);
      
      source.start();
    } catch (error) {
      console.log('Error playing completion chime:', error);
    }
  }
}

const soundManager = new SoundManager();

export const playClickSound = () => {
  soundManager.playClickSound();
};

export const playBellSound = () => {
  soundManager.playBellSound();
};

export const playTickSound = () => {
  soundManager.playTickSound();
};

export const playCompletionChime = () => {
  soundManager.playCompletionChime();
};

export const useClickSound = () => {
  return {
    playClickSound: () => soundManager.playClickSound()
  };
};

export const useBellSound = () => {
  return {
    playBellSound: () => soundManager.playBellSound()
  };
};

export const useTickSound = () => {
  return {
    playTickSound: () => soundManager.playTickSound()
  };
};

export const useCompletionChime = () => {
  return {
    playCompletionChime: () => soundManager.playCompletionChime()
  };
};
