/**
 * Audio Manager
 * Handles Web Audio API for ambient sound generation
 * Pure TypeScript class with no React dependencies
 */

export class AudioManager {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private dataArray: Uint8Array | null = null;
  public isPlaying: boolean = false;

  /**
   * Initialize audio context and analyser
   */
  init(): void {
    if (this.ctx) return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContext();
    
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.analyser.smoothingTimeConstant = 0.8;
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength) as Uint8Array;
  }

  /**
   * Start playing ambient audio
   */
  play(): void {
    if (!this.ctx) this.init();
    if (!this.ctx || !this.analyser) return;

    this.ctx.resume();

    // Ambient chord frequencies (F2, C3, F3, C4)
    const freqs = [87.31, 130.81, 174.61, 261.63];

    freqs.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      // Alternate between sine and triangle waves
      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
      osc.detune.value = (Math.random() - 0.5) * 10; // Slight detuning for richness

      // Fade in slowly
      gain.gain.setValueAtTime(0, this.ctx!.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, this.ctx!.currentTime + 2);

      // Connect nodes
      osc.connect(gain);
      gain.connect(this.analyser!);
      this.analyser!.connect(this.ctx!.destination);

      osc.start();
      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    });

    this.isPlaying = true;
  }

  /**
   * Stop playing audio with fade out
   */
  stop(): void {
    if (!this.ctx) return;

    // Fade out
    this.gainNodes.forEach((gain) => {
      gain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 1);
    });

    // Stop oscillators after fade
    setTimeout(() => {
      this.oscillators.forEach((osc) => osc.stop());
      this.oscillators = [];
      this.gainNodes = [];
    }, 1000);

    this.isPlaying = false;
  }

  /**
   * Get normalized frequency data (0..1)
   * Returns average amplitude across frequency bins
   */
  getFrequencyData(): number {
    if (!this.analyser || !this.dataArray) return 0;

    // @ts-ignore - Type mismatch between lib.dom.d.ts versions
    this.analyser.getByteFrequencyData(this.dataArray);

    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }

    return sum / (this.dataArray.length * 255);
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stop();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.analyser = null;
    this.dataArray = null;
  }
}
