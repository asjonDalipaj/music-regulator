/**
 * PersonalizationEngine.ts
 * User profile management and adaptive algorithm selection for personalized therapy.
 * Tracks user responses and optimizes therapeutic approaches over time.
 */

import { BiofeedbackReading } from '../simulators/BiofeedbackSimulator';
import { TherapeuticGoal, AdaptationAlgorithm } from '../music/AdaptiveMusicEngine';
import { EmotionPrediction } from '../simulators/EmotionRecognition';

export interface UserProfile {
  userId: string;
  preferences: {
    preferredGenres: string[];
    avoidedGenres: string[];
    preferredTempo: { min: number; max: number };
    volumePreference: number; // 0-100
  };
  therapeuticHistory: TherapeuticSession[];
  baselineMetrics: {
    restingHeartRate: number;
    typicalArousal: number;
    typicalValence: number;
  };
  responsiveness: {
    isoEffectiveness: number;      // 0-100
    entrainmentEffectiveness: number; // 0-100
    progressiveEffectiveness: number; // 0-100
  };
  createdAt: number;
  lastUpdated: number;
}

export interface TherapeuticSession {
  sessionId: string;
  timestamp: number;
  goal: TherapeuticGoal;
  algorithmUsed: AdaptationAlgorithm;
  duration: number; // seconds
  initialBiofeedback: BiofeedbackReading;
  finalBiofeedback: BiofeedbackReading;
  effectiveness: number; // 0-100
  userSatisfaction?: number; // 0-100 (optional feedback)
}

export interface AlgorithmRecommendation {
  algorithm: AdaptationAlgorithm;
  confidence: number; // 0-100
  reasoning: string;
}

/**
 * Personalization engine for adaptive therapy optimization
 */
export class PersonalizationEngine {
  private userProfiles: Map<string, UserProfile>;

  constructor() {
    this.userProfiles = new Map();
  }

  /**
   * Create new user profile with defaults
   */
  createUserProfile(userId: string): UserProfile {
    const profile: UserProfile = {
      userId,
      preferences: {
        preferredGenres: [],
        avoidedGenres: [],
        preferredTempo: { min: 60, max: 120 },
        volumePreference: 50,
      },
      therapeuticHistory: [],
      baselineMetrics: {
        restingHeartRate: 70,
        typicalArousal: 50,
        typicalValence: 50,
      },
      responsiveness: {
        isoEffectiveness: 50,
        entrainmentEffectiveness: 50,
        progressiveEffectiveness: 50,
      },
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };

    this.userProfiles.set(userId, profile);
    return profile;
  }

  /**
   * Get user profile (create if not exists)
   */
  getUserProfile(userId: string): UserProfile {
    if (!this.userProfiles.has(userId)) {
      return this.createUserProfile(userId);
    }
    return this.userProfiles.get(userId)!;
  }

  /**
   * Update baseline metrics based on new biofeedback data
   */
  updateBaselineMetrics(userId: string, biofeedback: BiofeedbackReading): void {
    const profile = this.getUserProfile(userId);
    
    // Exponential moving average (smooth update)
    const alpha = 0.1; // Learning rate
    profile.baselineMetrics.restingHeartRate = 
      profile.baselineMetrics.restingHeartRate * (1 - alpha) + 
      biofeedback.heartRate * alpha;
    
    profile.baselineMetrics.typicalArousal = 
      profile.baselineMetrics.typicalArousal * (1 - alpha) + 
      biofeedback.arousal * alpha;
    
    profile.baselineMetrics.typicalValence = 
      profile.baselineMetrics.typicalValence * (1 - alpha) + 
      biofeedback.valence * alpha;

    profile.lastUpdated = Date.now();
  }

  /**
   * Record therapeutic session results
   */
  recordSession(
    userId: string,
    session: Omit<TherapeuticSession, 'sessionId' | 'timestamp' | 'effectiveness'>
  ): void {
    const profile = this.getUserProfile(userId);
    
    // Calculate session effectiveness
    const effectiveness = this.calculateEffectiveness(
      session.initialBiofeedback,
      session.finalBiofeedback,
      session.goal
    );

    const fullSession: TherapeuticSession = {
      sessionId: this.generateSessionId(),
      timestamp: Date.now(),
      effectiveness,
      ...session,
    };

    profile.therapeuticHistory.push(fullSession);

    // Update algorithm effectiveness scores
    this.updateAlgorithmEffectiveness(profile, session.algorithmUsed, effectiveness);

    profile.lastUpdated = Date.now();

    // Keep only last 100 sessions for performance
    if (profile.therapeuticHistory.length > 100) {
      profile.therapeuticHistory = profile.therapeuticHistory.slice(-100);
    }
  }

  /**
   * Calculate session effectiveness based on biofeedback improvement
   */
  private calculateEffectiveness(
    initial: BiofeedbackReading,
    final: BiofeedbackReading,
    goal: TherapeuticGoal
  ): number {
    const targetArousal = this.getTargetArousal(goal.type);
    const targetValence = this.getTargetValence(goal.type);

    // Calculate distance from target (before and after)
    const initialDistance = Math.sqrt(
      Math.pow(initial.arousal - targetArousal, 2) +
      Math.pow(initial.valence - targetValence, 2)
    );

    const finalDistance = Math.sqrt(
      Math.pow(final.arousal - targetArousal, 2) +
      Math.pow(final.valence - targetValence, 2)
    );

    // Calculate improvement percentage
    const improvement = (initialDistance - finalDistance) / initialDistance;
    
    // Scale to 0-100, with bonus for reaching target zone
    let effectiveness = Math.max(0, Math.min(100, improvement * 100 + 50));
    
    if (finalDistance < 10) {
      effectiveness = Math.min(100, effectiveness + 20);
    }

    return effectiveness;
  }

  /**
   * Update algorithm effectiveness scores based on session results
   */
  private updateAlgorithmEffectiveness(
    profile: UserProfile,
    algorithm: AdaptationAlgorithm,
    effectiveness: number
  ): void {
    const alpha = 0.15; // Learning rate
    const key = `${algorithm}Effectiveness` as keyof typeof profile.responsiveness;

    profile.responsiveness[key] = 
      profile.responsiveness[key] * (1 - alpha) + 
      effectiveness * alpha;
  }

  /**
   * Recommend optimal algorithm for user based on historical effectiveness
   */
  recommendAlgorithm(
    userId: string,
    currentBiofeedback: BiofeedbackReading,
    goal: TherapeuticGoal,
    emotion?: EmotionPrediction
  ): AlgorithmRecommendation {
    const profile = this.getUserProfile(userId);
    const { arousal, valence } = currentBiofeedback;

    // Get effectiveness scores
    const isoScore = profile.responsiveness.isoEffectiveness;
    const entrainmentScore = profile.responsiveness.entrainmentEffectiveness;
    const progressiveScore = profile.responsiveness.progressiveEffectiveness;

    // Contextual adjustments based on current state
    let adjustedIso = isoScore;
    let adjustedEntrainment = entrainmentScore;
    let adjustedProgressive = progressiveScore;

    // High stress/anxiety → favor ISO-principle
    if (arousal > 70 || (emotion && (emotion.emotion === 'anxious' || emotion.emotion === 'frustrated'))) {
      adjustedIso += 20;
    }

    // Low arousal + relaxation goal → favor entrainment
    if (arousal < 40 && goal.type === 'relaxation') {
      adjustedEntrainment += 15;
    }

    // Moderate state → favor progressive
    if (arousal >= 40 && arousal <= 70) {
      adjustedProgressive += 10;
    }

    // Find best algorithm
    let bestAlgorithm: AdaptationAlgorithm = 'iso_principle';
    let bestScore = adjustedIso;
    let reasoning = 'ISO-principle shows best historical effectiveness for your profile.';

    if (adjustedEntrainment > bestScore) {
      bestAlgorithm = 'entrainment';
      bestScore = adjustedEntrainment;
      reasoning = 'Entrainment has been most effective for you in similar situations.';
    }

    if (adjustedProgressive > bestScore) {
      bestAlgorithm = 'progressive';
      bestScore = adjustedProgressive;
      reasoning = 'Progressive adaptation aligns well with your response patterns.';
    }

    // Add contextual reasoning
    if (arousal > 75) {
      reasoning += ' High stress detected - gradual approach recommended.';
    }

    return {
      algorithm: bestAlgorithm,
      confidence: Math.min(95, bestScore),
      reasoning,
    };
  }

  /**
   * Update user music preferences
   */
  updatePreferences(
    userId: string,
    updates: Partial<UserProfile['preferences']>
  ): void {
    const profile = this.getUserProfile(userId);
    profile.preferences = { ...profile.preferences, ...updates };
    profile.lastUpdated = Date.now();
  }

  /**
   * Get user statistics and insights
   */
  getUserInsights(userId: string) {
    const profile = this.getUserProfile(userId);
    const recentSessions = profile.therapeuticHistory.slice(-20);

    if (recentSessions.length === 0) {
      return {
        totalSessions: 0,
        averageEffectiveness: 0,
        mostEffectiveGoal: null as string | null,
        mostEffectiveAlgorithm: null as AdaptationAlgorithm | null,
        improvementTrend: 0,
      };
    }

    // Calculate statistics
    const avgEffectiveness = 
      recentSessions.reduce((sum, s) => sum + s.effectiveness, 0) / recentSessions.length;

    // Find most effective goal type
    const goalEffectiveness = new Map<string, number[]>();
    recentSessions.forEach(session => {
      if (!goalEffectiveness.has(session.goal.type)) {
        goalEffectiveness.set(session.goal.type, []);
      }
      goalEffectiveness.get(session.goal.type)!.push(session.effectiveness);
    });

    let mostEffectiveGoal: string | null = null;
    let highestGoalScore = 0;
    goalEffectiveness.forEach((scores, goalType) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg > highestGoalScore) {
        highestGoalScore = avg;
        mostEffectiveGoal = goalType;
      }
    });

    // Find most effective algorithm
    const bestAlgorithm = profile.responsiveness.isoEffectiveness > 
                         profile.responsiveness.entrainmentEffectiveness ?
                         (profile.responsiveness.isoEffectiveness > 
                          profile.responsiveness.progressiveEffectiveness ? 
                          'iso_principle' : 'progressive') :
                         (profile.responsiveness.entrainmentEffectiveness > 
                          profile.responsiveness.progressiveEffectiveness ? 
                          'entrainment' : 'progressive');

    // Calculate improvement trend (recent vs older sessions)
    const halfPoint = Math.floor(recentSessions.length / 2);
    const olderAvg = recentSessions.slice(0, halfPoint)
      .reduce((sum, s) => sum + s.effectiveness, 0) / halfPoint;
    const recentAvg = recentSessions.slice(halfPoint)
      .reduce((sum, s) => sum + s.effectiveness, 0) / (recentSessions.length - halfPoint);
    const improvementTrend = recentAvg - olderAvg;

    return {
      totalSessions: profile.therapeuticHistory.length,
      averageEffectiveness: Math.round(avgEffectiveness),
      mostEffectiveGoal,
      mostEffectiveAlgorithm: bestAlgorithm,
      improvementTrend: Math.round(improvementTrend),
      baselineMetrics: profile.baselineMetrics,
      algorithmScores: profile.responsiveness,
    };
  }

  /**
   * Export user profile for persistence
   */
  exportProfile(userId: string): UserProfile | null {
    return this.userProfiles.get(userId) || null;
  }

  /**
   * Import user profile from saved data
   */
  importProfile(profile: UserProfile): void {
    this.userProfiles.set(profile.userId, profile);
  }

  /**
   * Helper: Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Helper: Get target arousal for therapeutic goal
   */
  private getTargetArousal(goalType: string): number {
    switch (goalType) {
      case 'relaxation': return 20;
      case 'focus': return 45;
      case 'energize': return 75;
      case 'mood_elevation': return 60;
      default: return 50;
    }
  }

  /**
   * Helper: Get target valence for therapeutic goal
   */
  private getTargetValence(goalType: string): number {
    switch (goalType) {
      case 'relaxation': return 70;
      case 'focus': return 60;
      case 'energize': return 80;
      case 'mood_elevation': return 85;
      default: return 60;
    }
  }
}
