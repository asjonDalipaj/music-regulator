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

## Portfolio Layer (Phase 4 - In Progress)

### `portfolio/app/layout.tsx`
- **Type**: Next.js Root Layout
- **Dependencies**: 
  - External: Next.js, Google Fonts (Playfair Display, Inter)
  - Internal: `./globals.css`
- **Provides**: Root HTML structure, font configuration, metadata
- **Size**: ~45 lines

### `portfolio/app/globals.css`
- **Type**: Global CSS with Tailwind
- **Dependencies**: 
  - External: Tailwind CSS
- **Provides**: Renaissance color palette CSS variables, custom scrollbar, global styles
- **Size**: ~95 lines

### `portfolio/app/page.tsx`
- **Type**: Next.js Home Page
- **Dependencies**: 
  - Internal: `@/components/Header`, `@/components/Hero`, `@/components/about/AboutMe`, `@/components/skills/Skills`, `@/components/Footer`
- **Provides**: Main portfolio landing page with sections (Hero, About, Skills, Projects, Contact)
- **Size**: ~45 lines

### `portfolio/components/Header.tsx`
- **Type**: React Component
- **Dependencies**: 
  - External: Framer Motion, Next.js Link
- **Provides**: Fixed navigation header with scroll detection
- **Size**: ~125 lines

### `portfolio/components/Footer.tsx`
- **Type**: React Component
- **Dependencies**: 
  - External: Framer Motion
- **Provides**: Footer with social links and navigation
- **Size**: ~80 lines

### `portfolio/components/Hero.tsx` ⚡ ENHANCED
- **Type**: React Component (Client-side)
- **Dependencies**: 
  - External: Framer Motion
- **Provides**: 
  - Letter-by-letter name animation with spring physics
  - Staggered tagline animation
  - Typewriter poetry effect (60ms per character)
  - Renaissance SVG decorative borders (4 corner flourishes)
  - Floating geometric particle background (15 animated shapes)
  - Pulsing gradient blobs (3 layers)
  - 3D tilt effect on poetry cards
  - Magnetic hover effects on CTA button
  - Pulsing bullet point animations
- **Size**: ~400 lines (at limit ✅)
- **Animation Features**:
  - Slow entrance (2-4s)
  - Energetic interactions (0.3-0.5s)
  - Continuous subtle animations (floating, pulsing)

### Portfolio Animation Components (v0.6.0)

#### `portfolio/components/animations/ScrollReveal.tsx`
- **Type**: React Component (Client-side)
- **Dependencies**: External: React (useEffect, useRef, useState)
- **Provides**: Intersection Observer-based scroll animations
- **Variants**: fadeUp, fadeDown, slideLeft, slideRight, scaleIn, rotate
- **Size**: ~110 lines ✅

### Portfolio Decorative Components (v0.6.0)

#### `portfolio/components/decorative/CornerFlourish.tsx`
- **Type**: React Component
- **Dependencies**: None
- **Provides**: SVG ornamental flourishes for Renaissance aesthetic
- **Positions**: top-left, top-right, bottom-left, bottom-right
- **Size**: ~85 lines ✅

#### `portfolio/components/decorative/DecorativeDivider.tsx`
- **Type**: React Component
- **Dependencies**: None
- **Provides**: Section dividers with three variants (ornate, simple, flourish)
- **Size**: ~65 lines ✅

### Portfolio About Section (v0.6.0)

#### `portfolio/components/about/AboutMe.tsx`
- **Type**: React Component (Client-side)
- **Dependencies**: 
  - Internal: `@/components/animations/ScrollReveal`, `@/components/decorative/*`, `./Milestone`
- **Provides**: Complete about section with journey timeline and philosophy
- **Size**: ~150 lines ✅

#### `portfolio/components/about/Milestone.tsx`
- **Type**: React Component (Client-side)
- **Dependencies**: Internal: `@/components/animations/ScrollReveal`
- **Provides**: Timeline milestone cards with alternating left/right layout
- **Size**: ~75 lines ✅

### Portfolio Skills Section (v0.6.0)

#### `portfolio/components/skills/Skills.tsx`
- **Type**: React Component (Client-side)
- **Dependencies**: 
  - Internal: `@/components/animations/ScrollReveal`, `@/components/decorative/*`, `./SkillCard`, `./SkillBar`
- **Provides**: Complete skills section with cards and progress bars
- **Size**: ~180 lines ✅

#### `portfolio/components/skills/SkillCard.tsx`
- **Type**: React Component (Client-side)
- **Dependencies**: Internal: `@/components/animations/ScrollReveal`
- **Provides**: Interactive skill category cards with hover effects
- **Size**: ~95 lines ✅

#### `portfolio/components/skills/SkillBar.tsx`
- **Type**: React Component (Client-side)
- **Dependencies**: External: React (useEffect, useState)
- **Provides**: Animated progress bars with level indicators
- **Size**: ~80 lines ✅

---

## Planned Additions (Phase 4+)

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

**Last Updated**: 2025-08-12  
**Version**: 0.6.0  
**Total Modules**: 16 (6 TypeScript core + 1 JSON + 9 Portfolio components)
