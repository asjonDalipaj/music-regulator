/**
 * PlaylistRecommender.ts
 * AI-simulated playlist recommendation system for therapeutic music selection.
 * Uses emotion recognition and therapeutic goals to suggest optimal music tracks.
 */

import { BiofeedbackReading } from '../simulators/BiofeedbackSimulator';
import { EmotionCategory, EmotionPrediction } from '../simulators/EmotionRecognition';
import { TherapeuticGoal } from '../music/AdaptiveMusicEngine';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  tempo: number;           // BPM
  valence: number;         // Musical positivity (0-100)
  energy: number;          // Musical intensity (0-100)
  genre: string;
  duration: number;        // seconds
  therapeuticTags: string[]; // e.g., ['relaxation', 'focus', 'sleep']
}

export interface PlaylistRecommendation {
  tracks: MusicTrack[];
  confidence: number;      // 0-100
  reasoning: string;
  adaptationStrategy: 'iso_principle' | 'entrainment' | 'progressive';
}

/**
 * Simulated AI-powered playlist recommendation engine
 */
export class PlaylistRecommender {
  private musicLibrary: MusicTrack[];
  private userPreferences: Map<string, number>; // trackId -> preference score
  private recentRecommendations: string[] = []; // Track IDs

  constructor() {
    this.musicLibrary = this.initializeMusicLibrary();
    this.userPreferences = new Map();
  }

  /**
   * Generate personalized playlist based on current emotional state and therapeutic goal
   */
  async recommendPlaylist(
    biofeedback: BiofeedbackReading,
    emotion: EmotionPrediction,
    goal: TherapeuticGoal,
    playlistLength: number = 10
  ): Promise<PlaylistRecommendation> {
    // Simulate AI processing delay
    await this.simulateProcessing(100, 300);

    // Select adaptation strategy based on goal and current state
    const strategy = this.selectStrategy(biofeedback, emotion, goal);

    // Generate candidate tracks
    const candidates = this.generateCandidates(biofeedback, emotion, goal, strategy);

    // Apply personalization
    const personalizedCandidates = this.applyPersonalization(candidates);

    // Rank and select top tracks
    const selectedTracks = this.rankAndSelect(
      personalizedCandidates,
      playlistLength,
      biofeedback,
      emotion,
      goal
    );

    // Avoid repetition
    const diversifiedTracks = this.diversifyPlaylist(selectedTracks);

    // Generate reasoning
    const reasoning = this.generateReasoning(biofeedback, emotion, goal, strategy);

    // Calculate confidence
    const confidence = this.calculateConfidence(emotion, diversifiedTracks);

    // Track recommendations for future personalization
    this.recentRecommendations = diversifiedTracks.map(t => t.id);

    return {
      tracks: diversifiedTracks,
      confidence,
      reasoning,
      adaptationStrategy: strategy,
    };
  }

  /**
   * Select optimal therapeutic strategy based on current state and goal
   */
  private selectStrategy(
    biofeedback: BiofeedbackReading,
    emotion: EmotionPrediction,
    goal: TherapeuticGoal
  ): 'iso_principle' | 'entrainment' | 'progressive' {
    const { arousal } = biofeedback;
    const { emotion: emotionType } = emotion;

    // High stress/anxiety → ISO-principle (match then guide)
    if (emotionType === 'anxious' || emotionType === 'frustrated' || arousal > 75) {
      return 'iso_principle';
    }

    // Low arousal + specific target → Entrainment (direct guidance)
    if (arousal < 40 && (goal.type === 'relaxation' || goal.type === 'focus')) {
      return 'entrainment';
    }

    // Moderate state → Progressive adaptation
    return 'progressive';
  }

  /**
   * Generate candidate tracks based on therapeutic strategy
   */
  private generateCandidates(
    biofeedback: BiofeedbackReading,
    emotion: EmotionPrediction,
    goal: TherapeuticGoal,
    strategy: 'iso_principle' | 'entrainment' | 'progressive'
  ): MusicTrack[] {
    const { arousal, valence } = biofeedback;

    if (strategy === 'iso_principle') {
      // Phase 1: Match current state
      return this.musicLibrary.filter(track => {
        const tempoMatch = Math.abs(track.tempo - biofeedback.heartRate) < 20;
        const valenceMatch = Math.abs(track.valence - valence) < 30;
        return tempoMatch || valenceMatch;
      });
    }

    if (strategy === 'entrainment') {
      // Direct selection for target state
      return this.musicLibrary.filter(track => {
        return track.therapeuticTags.includes(goal.type);
      });
    }

    // Progressive: gradual shift
    const targetArousal = this.getTargetArousal(goal);
    return this.musicLibrary.filter(track => {
      const energyInRange = track.energy >= Math.min(arousal, targetArousal) - 20 &&
                           track.energy <= Math.max(arousal, targetArousal) + 20;
      return energyInRange;
    });
  }

  /**
   * Apply user preference learning (simulated)
   */
  private applyPersonalization(tracks: MusicTrack[]): MusicTrack[] {
    return tracks.map(track => ({
      ...track,
      _personalizedScore: this.userPreferences.get(track.id) || 50,
    })) as MusicTrack[];
  }

  /**
   * Rank tracks and select top N
   */
  private rankAndSelect(
    tracks: MusicTrack[],
    count: number,
    biofeedback: BiofeedbackReading,
    emotion: EmotionPrediction,
    goal: TherapeuticGoal
  ): MusicTrack[] {
    const scored = tracks.map(track => ({
      track,
      score: this.calculateTrackScore(track, biofeedback, emotion, goal),
    }));

    // Sort by score (descending)
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, count).map(s => s.track);
  }

  /**
   * Calculate track suitability score
   */
  private calculateTrackScore(
    track: MusicTrack,
    biofeedback: BiofeedbackReading,
    emotion: EmotionPrediction,
    goal: TherapeuticGoal
  ): number {
    let score = 0;

    // Therapeutic alignment (40% weight)
    if (track.therapeuticTags.includes(goal.type)) {
      score += 40;
    }

    // Tempo appropriateness (20% weight)
    const targetTempo = this.getTargetTempo(goal);
    const tempoDistance = Math.abs(track.tempo - targetTempo);
    score += Math.max(0, 20 - (tempoDistance / 5));

    // Valence match (20% weight)
    const targetValence = this.getTargetValence(goal);
    const valenceDistance = Math.abs(track.valence - targetValence);
    score += Math.max(0, 20 - (valenceDistance / 5));

    // User preference (20% weight)
    const preference = (track as any)._personalizedScore || 50;
    score += (preference / 100) * 20;

    // Add small random factor for diversity
    score += Math.random() * 5;

    return score;
  }

  /**
   * Diversify playlist to avoid monotony
   */
  private diversifyPlaylist(tracks: MusicTrack[]): MusicTrack[] {
    const diversified: MusicTrack[] = [];
    const usedGenres = new Set<string>();

    for (const track of tracks) {
      // Prefer genre diversity
      if (!usedGenres.has(track.genre) || diversified.length > tracks.length / 2) {
        diversified.push(track);
        usedGenres.add(track.genre);
      }
    }

    // Fill remaining slots with highest-scored tracks
    for (const track of tracks) {
      if (diversified.length >= tracks.length) break;
      if (!diversified.includes(track)) {
        diversified.push(track);
      }
    }

    return diversified;
  }

  /**
   * Generate human-readable reasoning for recommendations
   */
  private generateReasoning(
    biofeedback: BiofeedbackReading,
    emotion: EmotionPrediction,
    goal: TherapeuticGoal,
    strategy: string
  ): string {
    const emotionDesc = emotion.emotion;
    const goalDesc = goal.type.replace('_', ' ');

    if (strategy === 'iso_principle') {
      return `Detected ${emotionDesc} state. Using ISO-principle: playlist starts by matching your current mood, then gradually guides you toward ${goalDesc}.`;
    }

    if (strategy === 'entrainment') {
      return `Your current state is suitable for direct guidance. Playlist designed to entrain your physiology toward ${goalDesc} using targeted music.`;
    }

    return `Progressive adaptation: playlist gradually shifts your emotional state toward ${goalDesc} through carefully sequenced tracks.`;
  }

  /**
   * Calculate recommendation confidence
   */
  private calculateConfidence(emotion: EmotionPrediction, tracks: MusicTrack[]): number {
    // Base confidence on emotion detection confidence
    let confidence = emotion.confidence;

    // Reduce if few matching tracks
    if (tracks.length < 5) {
      confidence *= 0.8;
    }

    // Add small random variation
    confidence += (Math.random() - 0.5) * 5;

    return Math.max(50, Math.min(95, confidence));
  }

  /**
   * Update user preferences based on feedback
   */
  updatePreference(trackId: string, liked: boolean): void {
    const currentScore = this.userPreferences.get(trackId) || 50;
    const adjustment = liked ? 10 : -10;
    const newScore = Math.max(0, Math.min(100, currentScore + adjustment));
    this.userPreferences.set(trackId, newScore);
  }

  /**
   * Helper: Get target arousal for therapeutic goal
   */
  private getTargetArousal(goal: TherapeuticGoal): number {
    switch (goal.type) {
      case 'relaxation': return 20;
      case 'focus': return 45;
      case 'energize': return 75;
      case 'mood_elevation': return 60;
      default: return 50;
    }
  }

  /**
   * Helper: Get target tempo for therapeutic goal
   */
  private getTargetTempo(goal: TherapeuticGoal): number {
    switch (goal.type) {
      case 'relaxation': return 60;
      case 'focus': return 72;
      case 'energize': return 120;
      case 'mood_elevation': return 95;
      default: return 90;
    }
  }

  /**
   * Helper: Get target valence for therapeutic goal
   */
  private getTargetValence(goal: TherapeuticGoal): number {
    switch (goal.type) {
      case 'relaxation': return 70;
      case 'focus': return 60;
      case 'energize': return 80;
      case 'mood_elevation': return 85;
      default: return 60;
    }
  }

  /**
   * Simulate AI processing delay
   */
  private async simulateProcessing(minMs: number, maxMs: number): Promise<void> {
    const delay = minMs + Math.random() * (maxMs - minMs);
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Initialize simulated music library
   */
  private initializeMusicLibrary(): MusicTrack[] {
    return [
      // Relaxation tracks
      { id: '1', title: 'Calm Waters', artist: 'Ambient Collective', tempo: 60, valence: 75, energy: 20, genre: 'Ambient', duration: 240, therapeuticTags: ['relaxation', 'sleep'] },
      { id: '2', title: 'Peaceful Mind', artist: 'Meditation Masters', tempo: 55, valence: 80, energy: 15, genre: 'Meditation', duration: 300, therapeuticTags: ['relaxation', 'meditation'] },
      
      // Focus tracks
      { id: '3', title: 'Deep Work', artist: 'Focus Flow', tempo: 72, valence: 60, energy: 45, genre: 'Electronic', duration: 180, therapeuticTags: ['focus', 'productivity'] },
      { id: '4', title: 'Concentration', artist: 'Study Sounds', tempo: 70, valence: 55, energy: 40, genre: 'Instrumental', duration: 210, therapeuticTags: ['focus'] },
      
      // Energizing tracks
      { id: '5', title: 'Morning Motivation', artist: 'Energy Boost', tempo: 120, valence: 85, energy: 80, genre: 'Pop', duration: 200, therapeuticTags: ['energize', 'mood_elevation'] },
      { id: '6', title: 'Power Up', artist: 'Upbeat Collective', tempo: 128, valence: 90, energy: 85, genre: 'Electronic', duration: 195, therapeuticTags: ['energize'] },
      
      // Mood elevation
      { id: '7', title: 'Sunshine', artist: 'Happy Vibes', tempo: 95, valence: 88, energy: 65, genre: 'Indie Pop', duration: 185, therapeuticTags: ['mood_elevation'] },
      { id: '8', title: 'Joyful Journey', artist: 'Positive Energy', tempo: 100, valence: 92, energy: 70, genre: 'World', duration: 220, therapeuticTags: ['mood_elevation'] },
      
      // Stress reduction (ISO-principle starters)
      { id: '9', title: 'Release Tension', artist: 'Calm Down', tempo: 90, valence: 50, energy: 60, genre: 'Ambient', duration: 240, therapeuticTags: ['relaxation', 'stress_relief'] },
      { id: '10', title: 'Let Go', artist: 'Stress Relief', tempo: 85, valence: 55, energy: 55, genre: 'New Age', duration: 270, therapeuticTags: ['relaxation', 'stress_relief'] },
    ];
  }
}
