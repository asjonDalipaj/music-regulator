/**
 * EmotionRecognition.ts
 * Simulates AI-powered emotion recognition from biofeedback data.
 * Mimics facial expression analysis, physiological pattern recognition,
 * and multi-modal emotion classification.
 */

import { BiofeedbackReading } from './BiofeedbackSimulator';

export interface EmotionPrediction {
  emotion: EmotionCategory;
  confidence: number;
  timestamp: number;
  modality: 'physiological' | 'facial' | 'multimodal';
}

export interface EmotionDistribution {
  happy: number;
  sad: number;
  anxious: number;
  calm: number;
  focused: number;
  frustrated: number;
  energized: number;
}

export type EmotionCategory = 'happy' | 'sad' | 'anxious' | 'calm' | 'focused' | 'frustrated' | 'energized';

/**
 * Maps biofeedback readings to emotion predictions
 */
export class EmotionRecognizer {
  private recognitionDelay: number = 500; // Simulate processing time

  /**
   * Classify emotion based on arousal-valence model
   * This simulates ML model inference
   */
  private classifyFromArousalValence(arousal: number, valence: number): EmotionDistribution {
    const distribution: EmotionDistribution = {
      happy: 0,
      sad: 0,
      anxious: 0,
      calm: 0,
      focused: 0,
      frustrated: 0,
      energized: 0,
    };

    // High arousal + high valence = happy/energized
    if (arousal > 65 && valence > 60) {
      distribution.happy = 0.4 + Math.random() * 0.3;
      distribution.energized = 0.3 + Math.random() * 0.2;
      distribution.focused = 0.1 + Math.random() * 0.15;
    }
    // High arousal + low valence = anxious/frustrated
    else if (arousal > 65 && valence < 45) {
      distribution.anxious = 0.5 + Math.random() * 0.3;
      distribution.frustrated = 0.2 + Math.random() * 0.2;
      distribution.sad = 0.1 + Math.random() * 0.1;
    }
    // Low arousal + high valence = calm
    else if (arousal < 35 && valence > 55) {
      distribution.calm = 0.6 + Math.random() * 0.25;
      distribution.happy = 0.15 + Math.random() * 0.1;
      distribution.focused = 0.1 + Math.random() * 0.05;
    }
    // Low arousal + low valence = sad
    else if (arousal < 35 && valence < 45) {
      distribution.sad = 0.5 + Math.random() * 0.3;
      distribution.frustrated = 0.2 + Math.random() * 0.15;
      distribution.calm = 0.1 + Math.random() * 0.05;
    }
    // Moderate arousal + moderate valence = focused
    else {
      distribution.focused = 0.5 + Math.random() * 0.25;
      distribution.calm = 0.2 + Math.random() * 0.15;
      distribution.happy = 0.1 + Math.random() * 0.1;
    }

    // Normalize to ensure sum = 1.0
    const sum = Object.values(distribution).reduce((a, b) => a + b, 0);
    Object.keys(distribution).forEach(key => {
      distribution[key as EmotionCategory] /= sum;
    });

    return distribution;
  }

  /**
   * Get dominant emotion from distribution
   */
  private getDominantEmotion(distribution: EmotionDistribution): { emotion: EmotionCategory; confidence: number } {
    let maxEmotion: EmotionCategory = 'calm';
    let maxConfidence = 0;

    Object.entries(distribution).forEach(([emotion, confidence]) => {
      if (confidence > maxConfidence) {
        maxConfidence = confidence;
        maxEmotion = emotion as EmotionCategory;
      }
    });

    return { emotion: maxEmotion, confidence: maxConfidence };
  }

  /**
   * Recognize emotion from physiological data (simulated AI inference)
   */
  async recognizeFromPhysiological(reading: BiofeedbackReading): Promise<EmotionPrediction> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, this.recognitionDelay));

    const distribution = this.classifyFromArousalValence(reading.arousal, reading.valence);
    const { emotion, confidence } = this.getDominantEmotion(distribution);

    // Add some realism: reduce confidence slightly for physiological-only data
    const adjustedConfidence = Math.min(0.95, confidence * 0.85 + Math.random() * 0.1);

    return {
      emotion,
      confidence: adjustedConfidence,
      timestamp: Date.now(),
      modality: 'physiological',
    };
  }

  /**
   * Simulate facial expression analysis (mock computer vision)
   */
  async recognizeFromFacial(reading: BiofeedbackReading): Promise<EmotionPrediction> {
    // Simulate longer processing for vision models
    await new Promise(resolve => setTimeout(resolve, this.recognitionDelay * 2));

    // Facial recognition tends to be better at detecting positive emotions
    const distribution = this.classifyFromArousalValence(reading.arousal, reading.valence);
    
    // Boost facial detection confidence for happy/sad
    if (distribution.happy > 0.3) {
      distribution.happy *= 1.2;
    }
    if (distribution.sad > 0.3) {
      distribution.sad *= 1.15;
    }

    // Normalize again
    const sum = Object.values(distribution).reduce((a, b) => a + b, 0);
    Object.keys(distribution).forEach(key => {
      distribution[key as EmotionCategory] /= sum;
    });

    const { emotion, confidence } = this.getDominantEmotion(distribution);

    return {
      emotion,
      confidence: Math.min(0.98, confidence),
      timestamp: Date.now(),
      modality: 'facial',
    };
  }

  /**
   * Multi-modal fusion: combines physiological + facial data
   */
  async recognizeMultimodal(reading: BiofeedbackReading): Promise<EmotionPrediction> {
    // Run both modalities in parallel
    const [physio, facial] = await Promise.all([
      this.recognizeFromPhysiological(reading),
      this.recognizeFromFacial(reading),
    ]);

    // Weighted fusion (physiological has more weight for stress/anxiety detection)
    const weights = { physiological: 0.6, facial: 0.4 };

    // Simple fusion: if both agree, high confidence; if disagree, use weighted average
    if (physio.emotion === facial.emotion) {
      return {
        emotion: physio.emotion,
        confidence: Math.min(0.99, (physio.confidence * weights.physiological + facial.confidence * weights.facial) * 1.15),
        timestamp: Date.now(),
        modality: 'multimodal',
      };
    } else {
      // Use the one with higher confidence, but reduce overall confidence
      const selectedPrediction = physio.confidence > facial.confidence ? physio : facial;
      return {
        emotion: selectedPrediction.emotion,
        confidence: selectedPrediction.confidence * 0.85,
        timestamp: Date.now(),
        modality: 'multimodal',
      };
    }
  }

  /**
   * Get full emotion distribution (useful for visualization)
   */
  getEmotionDistribution(reading: BiofeedbackReading): EmotionDistribution {
    return this.classifyFromArousalValence(reading.arousal, reading.valence);
  }

  /**
   * Set recognition delay (for testing/demo purposes)
   */
  setRecognitionDelay(delayMs: number): void {
    this.recognitionDelay = delayMs;
  }
}

/**
 * Emotion trend analyzer - tracks emotional changes over time
 */
export class EmotionTrendAnalyzer {
  private history: EmotionPrediction[] = [];
  private maxHistorySize: number = 60; // Keep 60 seconds of history

  /**
   * Add a new emotion prediction to history
   */
  addPrediction(prediction: EmotionPrediction): void {
    this.history.push(prediction);

    // Trim old entries
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  /**
   * Get the most common emotion in recent history
   */
  getDominantEmotion(windowSeconds: number = 30): EmotionCategory | null {
    if (this.history.length === 0) return null;

    const cutoffTime = Date.now() - windowSeconds * 1000;
    const recentPredictions = this.history.filter(p => p.timestamp >= cutoffTime);

    if (recentPredictions.length === 0) return null;

    // Count occurrences
    const counts: Partial<Record<EmotionCategory, number>> = {};
    recentPredictions.forEach(p => {
      counts[p.emotion] = (counts[p.emotion] || 0) + 1;
    });

    // Find most common
    let maxEmotion: EmotionCategory = 'calm';
    let maxCount = 0;

    Object.entries(counts).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxEmotion = emotion as EmotionCategory;
      }
    });

    return maxEmotion;
  }

  /**
   * Detect emotional trend (improving, declining, stable)
   */
  getTrend(): 'improving' | 'declining' | 'stable' {
    if (this.history.length < 10) return 'stable';

    const recentHalf = this.history.slice(-10, -5);
    const latestHalf = this.history.slice(-5);

    const avgRecentValence = recentHalf.reduce((sum, p) => {
      // Map emotions to valence scores
      const valenceMap: Record<EmotionCategory, number> = {
        happy: 85,
        energized: 75,
        calm: 70,
        focused: 60,
        frustrated: 35,
        anxious: 30,
        sad: 25,
      };
      return sum + valenceMap[p.emotion];
    }, 0) / recentHalf.length;

    const avgLatestValence = latestHalf.reduce((sum, p) => {
      const valenceMap: Record<EmotionCategory, number> = {
        happy: 85,
        energized: 75,
        calm: 70,
        focused: 60,
        frustrated: 35,
        anxious: 30,
        sad: 25,
      };
      return sum + valenceMap[p.emotion];
    }, 0) / latestHalf.length;

    const diff = avgLatestValence - avgRecentValence;

    if (diff > 10) return 'improving';
    if (diff < -10) return 'declining';
    return 'stable';
  }

  /**
   * Clear history
   */
  clear(): void {
    this.history = [];
  }

  /**
   * Get full history
   */
  getHistory(): EmotionPrediction[] {
    return [...this.history];
  }
}
