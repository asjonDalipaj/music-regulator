# File Dependencies - Real-Time Music Regulator

## Current Structure (v0.2.0)

### Data Layer

#### `src/data/biofeedback-profiles.json`
- **Type**: Static JSON data
- **Dependencies**: None
- **Provides**: Physiological state profiles, therapeutic scenarios, valid ranges
- **Consumed By**: BiofeedbackSimulator.ts
- **Size**: ~120 lines

### Simulation Layer

#### `src/simulators/BiofeedbackSimulator.ts`
- **Type**: TypeScript module
- **Dependencies**: 
  - Internal: `../data/biofeedback-profiles.json`
- **Provides**: BiofeedbackSimulator class, ScenarioSimulator class, types
- **Consumed By**: Future components, EmotionRecognition.ts
- **Exports**: 
  - `BiofeedbackSimulator`
  - `ScenarioSimulator`
  - `BiofeedbackReading` (interface)
  - `BiofeedbackProfile` (interface)
  - `ProfileName` (type)
  - `ScenarioName` (type)
- **Size**: ~295 lines ✅

#### `src/simulators/EmotionRecognition.ts`
- **Type**: TypeScript module
- **Dependencies**:
  - Internal: `./BiofeedbackSimulator` (BiofeedbackReading interface)
- **Provides**: EmotionRecognizer class, EmotionTrendAnalyzer class
- **Consumed By**: Future AI layer, components
- **Exports**:
  - `EmotionRecognizer`
  - `EmotionTrendAnalyzer`
  - `EmotionPrediction` (interface)
  - `EmotionDistribution` (interface)
  - `EmotionCategory` (type)
- **Size**: ~310 lines ✅

### Music Engine Layer

#### `src/music/AdaptiveMusicEngine.ts`
- **Type**: TypeScript module
- **Dependencies**:
  - Internal: `../simulators/BiofeedbackSimulator` (BiofeedbackReading interface)
- **Provides**: AdaptiveMusicEngine class with 3 therapeutic algorithms
- **Consumed By**: Future audio synthesis layer, components
- **Exports**:
  - `AdaptiveMusicEngine`
  - `MusicParameters` (interface)
  - `TherapeuticGoal` (interface)
  - `AdaptationAlgorithm` (type)
- **Size**: ~320 lines ✅

### Legacy

#### `index.html`
- **Type**: Single-file React application
- **Dependencies**: 
  - External: React 18, ReactDOM, Babel, Tailwind CSS (CDN)
  - Internal: None (self-contained)
- **Status**: ⚠️ To be refactored into modular components
- **Size**: ~390 lines

---

## Dependency Graph

```
┌─────────────────────────────────────┐
│  biofeedback-profiles.json (DATA)   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  BiofeedbackSimulator.ts            │
│  - Reads profiles                   │
│  - Generates realistic biosignals   │
└────────┬──────────┬─────────────────┘
         │          │
         ▼          ▼
┌────────────────┐  ┌──────────────────────────┐
│ EmotionRecog.ts│  │ AdaptiveMusicEngine.ts   │
│ - Uses         │  │ - Uses BiofeedbackReading│
│   BiofeedbackR.│  │ - Generates music params │
└────────────────┘  └──────────────────────────┘
         │                    │
         └─────────┬──────────┘
                   ▼
         ┌──────────────────┐
         │  Future AI Layer │
         │  Future UI Layer │
         └──────────────────┘
```

---

## AI/ML Layer (Phase 2 - Completed v0.3.0)

### `src/ai/PlaylistRecommender.ts`
- **Type**: TypeScript module
- **Dependencies**:
  - Internal: `../simulators/BiofeedbackSimulator`, `../simulators/EmotionRecognition`, `../music/AdaptiveMusicEngine`
- **Provides**: Smart music recommendation system with emotion-based filtering
- **Exports**:
  - `PlaylistRecommender`
  - `MusicTrack` (interface)
  - `RecommendationCriteria` (interface)
  - `TrackScore` (interface)
- **Size**: ~390 lines ✅

### `src/ai/ReinforcementLearning.ts`
- **Type**: TypeScript module
- **Dependencies**:
  - Internal: `../simulators/BiofeedbackSimulator`, `../music/AdaptiveMusicEngine`
- **Provides**: Q-learning optimization for music parameters
- **Exports**:
  - `MusicRLAgent`
  - `RLState` (interface)
  - `RLAction` (interface)
  - `Experience` (interface)
- **Size**: ~350 lines ✅

### `src/ai/PersonalizationEngine.ts`
- **Type**: TypeScript module
- **Dependencies**:
  - Internal: `../simulators/BiofeedbackSimulator`, `../simulators/EmotionRecognition`, `../music/AdaptiveMusicEngine`
- **Provides**: User profile management and adaptive algorithm selection
- **Exports**:
  - `PersonalizationEngine`
  - `UserProfile` (interface)
  - `TherapeuticSession` (interface)
  - `AlgorithmRecommendation` (interface)
- **Size**: ~380 lines ✅

---

## Planned Additions (Phase 3+)

### Component Layer
```
src/components/
├── MusicRegulator.tsx         # Main app (uses all simulators)
├── BiofeedbackDisplay.tsx     # Deps: BiofeedbackSimulator
├── EmotionChart.tsx           # Deps: EmotionRecognition
├── MusicControls.tsx          # Deps: AdaptiveMusicEngine
└── TherapeuticDashboard.tsx   # Deps: All layers
```

### Portfolio Integration
```
portfolio/
└── app/projects/music-regulator/
    └── page.tsx               # Imports from src/
```

---

## Dependency Rules

1. **One-Way Flow**: Data → Simulation → Music/AI → Components → Portfolio
2. **No Circular Dependencies**: Strictly enforced
3. **Interface Contracts**: All cross-module communication via TypeScript interfaces
4. **File Size**: Max 400 lines (all current files compliant ✅)
5. **Named Exports**: All modules use named exports for tree-shaking

---

## External Dependencies (Future)

### Runtime
- **Tone.js**: Audio synthesis and scheduling
- **React 18+**: UI framework
- **Next.js 14+**: Portfolio framework
- **Tailwind CSS**: Styling

### Development
- **TypeScript 5+**: Type safety
- **ESLint**: Code quality
- **Prettier**: Code formatting

---

## Integration Points

1. **Biofeedback → Music**: Real-time parameter updates
2. **Biofeedback → Emotion**: Continuous emotion classification
3. **Emotion → Music**: Emotion-aware adaptation
4. **Music → Audio**: Parameter-to-sound synthesis
5. **All → UI**: Data visualization and controls

---

**Last Updated**: 2025-06-12  
**Version**: 0.3.0  
**Total Modules**: 7 (6 TypeScript + 1 JSON)
