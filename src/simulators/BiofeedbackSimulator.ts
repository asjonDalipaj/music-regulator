/**
 * BiofeedbackSimulator.ts
 * Simulates realistic physiological biofeedback data for music therapy demonstrations.
 * Generates heart rate, HRV, arousal, valence, and other biosignals with natural variability.
 */

import biofeedbackData from '../data/biofeedback-profiles.json';

export interface BiofeedbackReading {
  timestamp: number;
  heartRate: number;
  heartRateVariability: number;
  arousal: number;
  valence: number;
  respirationRate: number;
  skinConductance: number;
  muscleTension: number;
}

export interface BiofeedbackProfile {
  name: string;
  description: string;
  heartRate: number;
  heartRateVariability: number;
  arousal: number;
  valence: number;
  respirationRate: number;
  skinConductance: number;
  muscleTension: number;
}

export type ProfileName = 'relaxed' | 'focused' | 'stressed' | 'anxious' | 'energized' | 'fatigued';
export type ScenarioName = 'stress_reduction' | 'focus_enhancement' | 'anxiety_management';

/**
 * Main biofeedback simulator class
 */
export class BiofeedbackSimulator {
  private currentProfile: BiofeedbackProfile;
  private targetProfile: BiofeedbackProfile | null = null;
  private transitionProgress: number = 1.0; // 1.0 = fully transitioned
  private isRunning: boolean = false;
  private updateInterval: number = 1000; // Update every second
  private intervalId: number | null = null;
  private listeners: Array<(reading: BiofeedbackReading) => void> = [];

  constructor(initialProfile: ProfileName = 'focused') {
    this.currentProfile = this.getProfile(initialProfile);
  }

  /**
   * Get a biofeedback profile by name
   */
  private getProfile(profileName: ProfileName): BiofeedbackProfile {
    return biofeedbackData.profiles[profileName];
  }

  /**
   * Add natural variability to a value
   */
  private addNoise(value: number, variability: number = 0.05): number {
    const noise = (Math.random() - 0.5) * 2 * variability * value;
    return value + noise;
  }

  /**
   * Interpolate between two profiles during transition
   */
  private interpolate(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
  }

  /**
   * Generate a single biofeedback reading with natural variability
   */
  private generateReading(): BiofeedbackReading {
    const baseProfile = this.currentProfile;
    let effectiveProfile = { ...baseProfile };

    // If transitioning, interpolate between current and target
    if (this.targetProfile && this.transitionProgress < 1.0) {
      effectiveProfile = {
        name: baseProfile.name,
        description: baseProfile.description,
        heartRate: this.interpolate(baseProfile.heartRate, this.targetProfile.heartRate, this.transitionProgress),
        heartRateVariability: this.interpolate(baseProfile.heartRateVariability, this.targetProfile.heartRateVariability, this.transitionProgress),
        arousal: this.interpolate(baseProfile.arousal, this.targetProfile.arousal, this.transitionProgress),
        valence: this.interpolate(baseProfile.valence, this.targetProfile.valence, this.transitionProgress),
        respirationRate: this.interpolate(baseProfile.respirationRate, this.targetProfile.respirationRate, this.transitionProgress),
        skinConductance: this.interpolate(baseProfile.skinConductance, this.targetProfile.skinConductance, this.transitionProgress),
        muscleTension: this.interpolate(baseProfile.muscleTension, this.targetProfile.muscleTension, this.transitionProgress),
      };

      // Progress transition (slower for more realistic changes)
      this.transitionProgress += 0.02; // 2% per update = ~50 seconds for full transition

      if (this.transitionProgress >= 1.0) {
        this.currentProfile = this.targetProfile;
        this.targetProfile = null;
        this.transitionProgress = 1.0;
      }
    }

    // Add realistic noise to each metric
    return {
      timestamp: Date.now(),
      heartRate: Math.max(50, Math.min(120, this.addNoise(effectiveProfile.heartRate, 0.03))),
      heartRateVariability: Math.max(20, Math.min(100, this.addNoise(effectiveProfile.heartRateVariability, 0.08))),
      arousal: Math.max(0, Math.min(100, this.addNoise(effectiveProfile.arousal, 0.05))),
      valence: Math.max(0, Math.min(100, this.addNoise(effectiveProfile.valence, 0.04))),
      respirationRate: Math.max(8, Math.min(25, this.addNoise(effectiveProfile.respirationRate, 0.06))),
      skinConductance: Math.max(1.0, Math.min(10.0, this.addNoise(effectiveProfile.skinConductance, 0.07))),
      muscleTension: Math.max(0, Math.min(100, this.addNoise(effectiveProfile.muscleTension, 0.06))),
    };
  }

  /**
   * Start the biofeedback simulator
   */
  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalId = window.setInterval(() => {
      const reading = this.generateReading();
      this.notifyListeners(reading);
    }, this.updateInterval);
  }

  /**
   * Stop the biofeedback simulator
   */
  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  /**
   * Transition to a new biofeedback profile
   */
  transitionTo(profileName: ProfileName, transitionDuration: number = 50): void {
    this.targetProfile = this.getProfile(profileName);
    this.transitionProgress = 0.0;
  }

  /**
   * Set profile immediately without transition
   */
  setProfile(profileName: ProfileName): void {
    this.currentProfile = this.getProfile(profileName);
    this.targetProfile = null;
    this.transitionProgress = 1.0;
  }

  /**
   * Subscribe to biofeedback updates
   */
  subscribe(callback: (reading: BiofeedbackReading) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Notify all listeners of new reading
   */
  private notifyListeners(reading: BiofeedbackReading): void {
    this.listeners.forEach(listener => listener(reading));
  }

  /**
   * Get current biofeedback reading (one-time)
   */
  getCurrentReading(): BiofeedbackReading {
    return this.generateReading();
  }

  /**
   * Get current profile name
   */
  getCurrentProfileName(): string {
    return this.currentProfile.name;
  }

  /**
   * Set update frequency (in milliseconds)
   */
  setUpdateInterval(interval: number): void {
    this.updateInterval = interval;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }
}

/**
 * Scenario-based simulator that follows predefined therapeutic session timelines
 */
export class ScenarioSimulator {
  private simulator: BiofeedbackSimulator;
  private scenarioName: ScenarioName;
  private startTime: number = 0;
  private isPlaying: boolean = false;
  private checkInterval: number | null = null;

  constructor(scenarioName: ScenarioName) {
    this.scenarioName = scenarioName;
    const scenario = biofeedbackData.scenarios[scenarioName];
    const initialProfile = scenario.timeline[0].profile as ProfileName;
    this.simulator = new BiofeedbackSimulator(initialProfile);
  }

  /**
   * Start playing the scenario
   */
  play(): void {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.startTime = Date.now();
    this.simulator.start();

    // Check every 5 seconds if we need to transition to next profile
    this.checkInterval = window.setInterval(() => {
      this.checkTimelineProgress();
    }, 5000);
  }

  /**
   * Check if we should transition to next profile based on timeline
   */
  private checkTimelineProgress(): void {
    const scenario = biofeedbackData.scenarios[this.scenarioName];
    const elapsedSeconds = (Date.now() - this.startTime) / 1000;

    // Find the current timeline segment
    for (let i = 0; i < scenario.timeline.length - 1; i++) {
      const current = scenario.timeline[i];
      const next = scenario.timeline[i + 1];

      if (elapsedSeconds >= current.time && elapsedSeconds < next.time) {
        // Transition to next profile
        this.simulator.transitionTo(next.profile as ProfileName);
        break;
      }
    }

    // Stop at end of scenario
    if (elapsedSeconds >= scenario.duration) {
      this.stop();
    }
  }

  /**
   * Stop the scenario
   */
  stop(): void {
    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.simulator.stop();
    this.isPlaying = false;
  }

  /**
   * Subscribe to biofeedback updates
   */
  subscribe(callback: (reading: BiofeedbackReading) => void): () => void {
    return this.simulator.subscribe(callback);
  }

  /**
   * Get the underlying simulator
   */
  getSimulator(): BiofeedbackSimulator {
    return this.simulator;
  }
}
