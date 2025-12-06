/**
 * ReinforcementLearning.ts
 * Simulated Q-learning algorithm for optimizing music therapy parameters.
 * Learns optimal music parameter adjustments based on biofeedback responses.
 */

import { BiofeedbackReading } from '../simulators/BiofeedbackSimulator';
import { TherapeuticGoal, MusicParameters } from '../music/AdaptiveMusicEngine';

export interface State {
  arousal: 'low' | 'medium' | 'high';
  valence: 'low' | 'medium' | 'high';
  goal: string;
}

export interface Action {
  parameter: keyof MusicParameters;
  adjustment: number; // -10 to +10
}

export interface QTableEntry {
  state: State;
  action: Action;
  qValue: number;
}

export interface LearningSession {
  timestamp: number;
  state: State;
  action: Action;
  reward: number;
  nextState: State;
  improved: boolean;
}

/**
 * Simulated Q-learning reinforcement learning engine
 * Optimizes music parameters based on biofeedback responses
 */
export class ReinforcementLearner {
  private qTable: Map<string, Map<string, number>>; // state -> action -> Q-value
  private learningRate: number = 0.1;
  private discountFactor: number = 0.95;
  private explorationRate: number = 0.2; // Epsilon for epsilon-greedy
  private sessionHistory: LearningSession[] = [];
  private episodeCount: number = 0;

  constructor() {
    this.qTable = new Map();
  }

  /**
   * Select optimal action for current state using epsilon-greedy strategy
   */
  selectAction(
    currentBiofeedback: BiofeedbackReading,
    goal: TherapeuticGoal
  ): Action {
    const state = this.discretizeState(currentBiofeedback, goal);
    const stateKey = this.getStateKey(state);

    // Exploration vs Exploitation
    if (Math.random() < this.explorationRate) {
      return this.getRandomAction();
    }

    // Get best action for this state
    const actionQValues = this.qTable.get(stateKey);
    if (!actionQValues || actionQValues.size === 0) {
      return this.getRandomAction();
    }

    // Find action with highest Q-value
    let bestAction: Action | null = null;
    let bestQValue = -Infinity;

    actionQValues.forEach((qValue, actionKey) => {
      if (qValue > bestQValue) {
        bestQValue = qValue;
        bestAction = this.parseActionKey(actionKey);
      }
    });

    return bestAction || this.getRandomAction();
  }

  /**
   * Update Q-table based on observed reward
   */
  learn(
    previousBiofeedback: BiofeedbackReading,
    action: Action,
    currentBiofeedback: BiofeedbackReading,
    goal: TherapeuticGoal
  ): number {
    const state = this.discretizeState(previousBiofeedback, goal);
    const nextState = this.discretizeState(currentBiofeedback, goal);
    
    // Calculate reward based on biofeedback improvement
    const reward = this.calculateReward(previousBiofeedback, currentBiofeedback, goal);

    // Q-learning update: Q(s,a) = Q(s,a) + α[r + γ·max(Q(s',a')) - Q(s,a)]
    const stateKey = this.getStateKey(state);
    const actionKey = this.getActionKey(action);
    const nextStateKey = this.getStateKey(nextState);

    // Initialize Q-value if not exists
    if (!this.qTable.has(stateKey)) {
      this.qTable.set(stateKey, new Map());
    }
    const stateActions = this.qTable.get(stateKey)!;
    const currentQ = stateActions.get(actionKey) || 0;

    // Find max Q-value for next state
    const nextStateActions = this.qTable.get(nextStateKey);
    let maxNextQ = 0;
    if (nextStateActions) {
      nextStateActions.forEach(qValue => {
        if (qValue > maxNextQ) maxNextQ = qValue;
      });
    }

    // Update Q-value
    const newQ = currentQ + this.learningRate * (reward + this.discountFactor * maxNextQ - currentQ);
    stateActions.set(actionKey, newQ);

    // Record session
    this.sessionHistory.push({
      timestamp: Date.now(),
      state,
      action,
      reward,
      nextState,
      improved: reward > 0,
    });

    return reward;
  }

  /**
   * Calculate reward based on biofeedback improvement toward goal
   */
  private calculateReward(
    previous: BiofeedbackReading,
    current: BiofeedbackReading,
    goal: TherapeuticGoal
  ): number {
    const targetArousal = this.getTargetArousal(goal.type);
    const targetValence = this.getTargetValence(goal.type);

    // Calculate distance from target (before and after)
    const previousDistance = Math.sqrt(
      Math.pow(previous.arousal - targetArousal, 2) +
      Math.pow(previous.valence - targetValence, 2)
    );

    const currentDistance = Math.sqrt(
      Math.pow(current.arousal - targetArousal, 2) +
      Math.pow(current.valence - targetValence, 2)
    );

    // Reward = improvement (negative distance change is good)
    const improvement = previousDistance - currentDistance;

    // Scale reward: +10 for significant improvement, -10 for significant regression
    let reward = improvement * 0.2;

    // Bonus for reaching target zone (within 10 units)
    if (currentDistance < 10) {
      reward += 5;
    }

    // Penalty for dangerous states (extreme arousal)
    if (current.arousal > 90 || current.arousal < 10) {
      reward -= 3;
    }

    return Math.max(-10, Math.min(10, reward));
  }

  /**
   * Discretize continuous biofeedback into discrete state
   */
  private discretizeState(biofeedback: BiofeedbackReading, goal: TherapeuticGoal): State {
    return {
      arousal: this.discretizeValue(biofeedback.arousal),
      valence: this.discretizeValue(biofeedback.valence),
      goal: goal.type,
    };
  }

  /**
   * Convert continuous value to discrete category
   */
  private discretizeValue(value: number): 'low' | 'medium' | 'high' {
    if (value < 33) return 'low';
    if (value < 67) return 'medium';
    return 'high';
  }

  /**
   * Generate unique key for state
   */
  private getStateKey(state: State): string {
    return `${state.arousal}-${state.valence}-${state.goal}`;
  }

  /**
   * Generate unique key for action
   */
  private getActionKey(action: Action): string {
    return `${action.parameter}:${action.adjustment}`;
  }

  /**
   * Parse action from key string
   */
  private parseActionKey(key: string): Action {
    const [parameter, adjustment] = key.split(':');
    return {
      parameter: parameter as keyof MusicParameters,
      adjustment: parseFloat(adjustment),
    };
  }

  /**
   * Generate random action for exploration
   */
  private getRandomAction(): Action {
    const parameters: (keyof MusicParameters)[] = [
      'tempo',
      'harmony',
      'volume',
      'density',
      'timbre',
      'rhythm',
    ];
    
    const parameter = parameters[Math.floor(Math.random() * parameters.length)];
    const adjustment = (Math.random() - 0.5) * 20; // -10 to +10

    return { parameter, adjustment };
  }

  /**
   * Get learning statistics
   */
  getStatistics() {
    const recentSessions = this.sessionHistory.slice(-100);
    const successRate = recentSessions.filter(s => s.improved).length / Math.max(1, recentSessions.length);
    const avgReward = recentSessions.reduce((sum, s) => sum + s.reward, 0) / Math.max(1, recentSessions.length);

    return {
      totalSessions: this.sessionHistory.length,
      successRate: successRate * 100,
      averageReward: avgReward,
      qTableSize: this.getQTableSize(),
      explorationRate: this.explorationRate * 100,
    };
  }

  /**
   * Get total number of state-action pairs learned
   */
  private getQTableSize(): number {
    let total = 0;
    this.qTable.forEach(actions => {
      total += actions.size;
    });
    return total;
  }

  /**
   * Decay exploration rate over time (exploit more as we learn)
   */
  decayExploration(): void {
    this.explorationRate = Math.max(0.05, this.explorationRate * 0.995);
    this.episodeCount++;
  }

  /**
   * Reset exploration rate (for new user or context change)
   */
  resetExploration(): void {
    this.explorationRate = 0.2;
  }

  /**
   * Export Q-table for persistence
   */
  exportQTable(): Record<string, Record<string, number>> {
    const exported: Record<string, Record<string, number>> = {};
    this.qTable.forEach((actions, stateKey) => {
      exported[stateKey] = {};
      actions.forEach((qValue, actionKey) => {
        exported[stateKey][actionKey] = qValue;
      });
    });
    return exported;
  }

  /**
   * Import Q-table from saved data
   */
  importQTable(data: Record<string, Record<string, number>>): void {
    this.qTable.clear();
    Object.entries(data).forEach(([stateKey, actions]) => {
      const actionMap = new Map<string, number>();
      Object.entries(actions).forEach(([actionKey, qValue]) => {
        actionMap.set(actionKey, qValue);
      });
      this.qTable.set(stateKey, actionMap);
    });
  }

  /**
   * Get best actions for a given state (for analysis)
   */
  getBestActions(biofeedback: BiofeedbackReading, goal: TherapeuticGoal, topK: number = 3): Action[] {
    const state = this.discretizeState(biofeedback, goal);
    const stateKey = this.getStateKey(state);
    const actionQValues = this.qTable.get(stateKey);

    if (!actionQValues || actionQValues.size === 0) {
      return [];
    }

    const sorted = Array.from(actionQValues.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK)
      .map(([actionKey]) => this.parseActionKey(actionKey));

    return sorted;
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
