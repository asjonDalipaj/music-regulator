/**
 * AdaptiveMusicEngine.ts
 * Core adaptive music generation engine that responds to biofeedback in real-time.
 * Implements evidence-based therapeutic algorithms (entrainment, iso-principle).
 */

import { BiofeedbackReading } from '../simulators/BiofeedbackSimulator';

export interface MusicParameters {
  tempo: number;           // BPM
  harmony: 'consonant' | 'complex' | 'dissonant';
  volume: number;          // 0-100
  density: number;         // Note density (0-100)
  timbre: 'soft' | 'neutral' | 'bright';
  rhythm: 'simple' | 'moderate' | 'complex';
}

export interface TherapeuticGoal {
  type: 'relaxation' | 'focus' | 'energize' | 'mood_elevation';
  intensity: number; // 0-100: how aggressively to pursue the goal
}

export type AdaptationAlgorithm = 'entrainment' | 'iso_principle' | 'progressive';

/**
 * Main adaptive music engine
 */
export class AdaptiveMusicEngine {
  private currentParameters: MusicParameters;
  private targetParameters: MusicParameters;
  private therapeuticGoal: TherapeuticGoal;
  private algorithm: AdaptationAlgorithm;
  private transitionSpeed: number = 0.05; // How fast to adapt (0-1)

  constructor(goal: TherapeuticGoal = { type: 'relaxation', intensity: 70 }) {
    this.therapeuticGoal = goal;
    this.algorithm = 'iso_principle'; // Default: match current state, then gradually shift
    
    // Initialize with neutral parameters
    this.currentParameters = {
      tempo: 90,
      harmony: 'consonant',
      volume: 50,
      density: 50,
      timbre: 'neutral',
      rhythm: 'moderate',
    };
    
    this.targetParameters = { ...this.currentParameters };
  }

  /**
   * Calculate optimal music parameters based on biofeedback and therapeutic goal
   */
  calculateOptimalParameters(reading: BiofeedbackReading): MusicParameters {
    const { arousal, valence, heartRate } = reading;
    
    switch (this.algorithm) {
      case 'iso_principle':
        return this.isoPrincipleMapping(arousal, valence, heartRate);
      
      case 'entrainment':
        return this.entrainmentMapping(arousal, valence, heartRate);
      
      case 'progressive':
        return this.progressiveMapping(arousal, valence, heartRate);
      
      default:
        return this.isoPrincipleMapping(arousal, valence, heartRate);
    }
  }

  /**
   * ISO-PRINCIPLE: Match current emotional state, then gradually guide toward target
   * Evidence: Most effective for stress/anxiety reduction
   */
  private isoPrincipleMapping(arousal: number, valence: number, heartRate: number): MusicParameters {
    const params: MusicParameters = { ...this.currentParameters };
    
    // Phase 1: Match current state (first ~30 seconds)
    // Tempo matches heart rate initially
    const matchedTempo = Math.max(60, Math.min(140, heartRate * 0.95));
    
    // Phase 2: Gradually shift toward therapeutic goal
    let targetTempo = 90;
    let targetHarmony: 'consonant' | 'complex' | 'dissonant' = 'consonant';
    let targetVolume = 50;
    
    switch (this.therapeuticGoal.type) {
      case 'relaxation':
        targetTempo = 60 + (20 * (1 - this.therapeuticGoal.intensity / 100));
        targetHarmony = 'consonant';
        targetVolume = 40 - (this.therapeuticGoal.intensity / 5);
        break;
      
      case 'focus':
        targetTempo = 70 + (arousal * 0.3);
        targetHarmony = 'consonant';
        targetVolume = 50;
        break;
      
      case 'energize':
        targetTempo = 110 + (this.therapeuticGoal.intensity * 0.3);
        targetHarmony = 'complex';
        targetVolume = 60 + (this.therapeuticGoal.intensity / 5);
        break;
      
      case 'mood_elevation':
        targetTempo = 85 + (valence * 0.4);
        targetHarmony = valence > 50 ? 'consonant' : 'complex';
        targetVolume = 55;
        break;
    }
    
    // Blend matched tempo with target based on goal intensity
    const blendFactor = this.therapeuticGoal.intensity / 100;
    params.tempo = matchedTempo * (1 - blendFactor) + targetTempo * blendFactor;
    
    // Harmony selection
    if (arousal > 70) {
      params.harmony = arousal > 85 ? 'dissonant' : 'complex';
    } else {
      params.harmony = targetHarmony;
    }
    
    // Volume adapts to arousal (lower volume for high arousal to calm)
    params.volume = targetVolume - (arousal > 70 ? (arousal - 70) * 0.3 : 0);
    
    // Density and rhythm
    params.density = Math.max(20, 60 - (arousal * 0.3));
    params.rhythm = arousal > 70 ? 'complex' : arousal > 40 ? 'moderate' : 'simple';
    
    // Timbre
    params.timbre = valence > 60 ? 'bright' : valence < 40 ? 'soft' : 'neutral';
    
    return params;
  }

  /**
   * ENTRAINMENT: Directly guide physiology with target music parameters
   * Evidence: Effective for sleep induction, meditation
   */
  private entrainmentMapping(arousal: number, valence: number, heartRate: number): MusicParameters {
    const params: MusicParameters = { ...this.currentParameters };
    
    // Set target parameters regardless of current state
    switch (this.therapeuticGoal.type) {
      case 'relaxation':
        params.tempo = 60; // Resting heart rate
        params.harmony = 'consonant';
        params.volume = 35;
        params.density = 25;
        params.rhythm = 'simple';
        params.timbre = 'soft';
        break;
      
      case 'focus':
        params.tempo = 72;
        params.harmony = 'consonant';
        params.volume = 45;
        params.density = 40;
        params.rhythm = 'moderate';
        params.timbre = 'neutral';
        break;
      
      case 'energize':
        params.tempo = 120;
        params.harmony = 'complex';
        params.volume = 65;
        params.density = 70;
        params.rhythm = 'complex';
        params.timbre = 'bright';
        break;
      
      case 'mood_elevation':
        params.tempo = 95;
        params.harmony = 'consonant';
        params.volume = 55;
        params.density = 50;
        params.rhythm = 'moderate';
        params.timbre = 'bright';
        break;
    }
    
    return params;
  }

  /**
   * PROGRESSIVE: Gradual step-wise adaptation based on biofeedback trends
   * Evidence: Good for long-term sessions with continuous monitoring
   */
  private progressiveMapping(arousal: number, valence: number, heartRate: number): MusicParameters {
    const params = { ...this.currentParameters };
    
    // Detect trend direction
    const targetArousal = this.therapeuticGoal.type === 'relaxation' ? 20 : 
                         this.therapeuticGoal.type === 'focus' ? 45 : 75;
    
    const arousalDiff = targetArousal - arousal;
    
    // Make small adjustments based on how far from target
    if (Math.abs(arousalDiff) > 5) {
      const adjustment = arousalDiff > 0 ? 2 : -2;
      params.tempo = Math.max(50, Math.min(150, params.tempo + adjustment));
    }
    
    // Adjust other parameters progressively
    params.volume = Math.max(20, Math.min(80, 50 - (arousal - 50) * 0.4));
    params.harmony = arousal > 65 ? 'complex' : 'consonant';
    params.density = Math.max(20, Math.min(80, 60 - arousal * 0.3));
    
    return params;
  }

  /**
   * Update music in real-time based on biofeedback
   */
  update(reading: BiofeedbackReading): MusicParameters {
    // Calculate optimal parameters
    this.targetParameters = this.calculateOptimalParameters(reading);
    
    // Smoothly transition current to target
    this.currentParameters = this.smoothTransition(this.currentParameters, this.targetParameters);
    
    return this.currentParameters;
  }

  /**
   * Smooth transition between current and target parameters
   */
  private smoothTransition(current: MusicParameters, target: MusicParameters): MusicParameters {
    return {
      tempo: current.tempo + (target.tempo - current.tempo) * this.transitionSpeed,
      harmony: this.shouldSwitchHarmony(current.harmony, target.harmony) ? target.harmony : current.harmony,
      volume: current.volume + (target.volume - current.volume) * this.transitionSpeed,
      density: current.density + (target.density - current.density) * this.transitionSpeed,
      timbre: current.timbre, // Timbre switches discretely
      rhythm: current.rhythm, // Rhythm switches discretely
    };
  }

  /**
   * Determine if harmony should switch (avoid too frequent changes)
   */
  private shouldSwitchHarmony(current: string, target: string): boolean {
    // Only switch if significantly different and random threshold met
    return current !== target && Math.random() > 0.7;
  }

  /**
   * Set therapeutic goal
   */
  setTherapeuticGoal(goal: TherapeuticGoal): void {
    this.therapeuticGoal = goal;
  }

  /**
   * Set adaptation algorithm
   */
  setAlgorithm(algorithm: AdaptationAlgorithm): void {
    this.algorithm = algorithm;
  }

  /**
   * Set transition speed (0-1, where 1 = instant, 0.05 = gradual)
   */
  setTransitionSpeed(speed: number): void {
    this.transitionSpeed = Math.max(0.01, Math.min(1, speed));
  }

  /**
   * Get current music parameters
   */
  getCurrentParameters(): MusicParameters {
    return { ...this.currentParameters };
  }

  /**
   * Get therapeutic goal
   */
  getTherapeuticGoal(): TherapeuticGoal {
    return { ...this.therapeuticGoal };
  }

  /**
   * Reset to default parameters
   */
  reset(): void {
    this.currentParameters = {
      tempo: 90,
      harmony: 'consonant',
      volume: 50,
      density: 50,
      timbre: 'neutral',
      rhythm: 'moderate',
    };
    this.targetParameters = { ...this.currentParameters };
  }
}
