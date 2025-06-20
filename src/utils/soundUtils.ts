
// Sound utility for click interactions
class SoundManager {
  private audioContext: AudioContext | null = null;
  private clickSound: AudioBuffer | null = null;

  constructor() {
    this.initializeAudioContext();
    this.createClickSound();
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

    // Create a short, premium click sound using oscillators
    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.1; // 100ms
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate a sophisticated click sound
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 50); // Exponential decay
      const frequency1 = 800; // Main frequency
      const frequency2 = 1200; // Harmonic
      
      data[i] = envelope * (
        0.7 * Math.sin(2 * Math.PI * frequency1 * t) +
        0.3 * Math.sin(2 * Math.PI * frequency2 * t)
      ) * 0.3; // Volume control
    }

    this.clickSound = buffer;
  }

  playClickSound() {
    if (!this.audioContext || !this.clickSound) return;

    try {
      // Resume audio context if suspended (for browser autoplay policies)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = this.clickSound;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Subtle volume fade
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
      
      source.start();
    } catch (error) {
      console.log('Error playing click sound:', error);
    }
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export const playClickSound = () => {
  soundManager.playClickSound();
};

// Hook for components to use click sounds
export const useClickSound = () => {
  return {
    playClickSound: () => soundManager.playClickSound()
  };
};
