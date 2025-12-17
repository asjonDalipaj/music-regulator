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

### Portfolio Effects Components (v0.8.0)

#### `portfolio/components/effects/FluidDistortion.tsx`
- **Type**: React Component (Client-side)
- **Dependencies**: External: React (useEffect, useRef)
- **Provides**: Canvas-based fluid distortion effect with colorful mouse trails
- **Features**:
  - Velocity-based particle generation (8 particles per frame)
  - Radial gradients with alpha blending
  - Color palette: coral, cyan, yellow, purple
  - Configurable intensity and dissipation
- **Size**: ~145 lines ✅
- **Integration**: Hero section background effect

---

---

## Portfolio Scene V2 - Feature-Based Architecture (v1.0.0)

### Route Entry Point

#### `portfolio/app/portfolio-v2/page.tsx`
- **Type**: Next.js Page Route
- **Dependencies**: Internal: `@/features/portfolioScene/PortfolioScene`
- **Provides**: Route wrapper for /portfolio-v2 path
- **Size**: ~10 lines ✅

### Main Orchestrator

#### `portfolio/features/portfolioScene/PortfolioScene.tsx`
- **Type**: React Component (Client-side)
- **Dependencies**: 
  - Internal: `./webgl/SceneManager`, `./webgl/AudioManager`, `./webgl/config`, `./ui/*`, `./sections/*`
  - External: React (useEffect, useRef, useState)
- **Provides**: Main component orchestrating entire portfolio scene
- **Features**:
  - Three.js scene initialization and lifecycle
  - Event listeners (scroll, mouse, resize)
  - RequestAnimationFrame loop
  - Audio management integration
  - Section composition
- **Size**: ~140 lines ✅

#### `portfolio/features/portfolioScene/PortfolioScene.module.css`
- **Type**: CSS Module
- **Dependencies**: None
- **Provides**: Scoped styling for portfolio scene layout
- **Features**:
  - Container and canvas positioning
  - Section layouts and grids
  - Loader and audio toggle styles
  - Project card styling
- **Size**: ~200 lines ✅

### WebGL System

#### `portfolio/features/portfolioScene/webgl/config.ts`
- **Type**: TypeScript Configuration Module
- **Dependencies**: None
- **Provides**: 
  - `SceneConfig` interface
  - `sceneConfig` default instance
  - `getAdaptiveConfig()` function with device detection
- **Features**:
  - Color palette configuration
  - Camera and geometry settings
  - Particle system parameters
  - Performance optimization rules
  - Mobile/desktop adaptation
  - Reduced motion support
- **Size**: ~115 lines ✅

#### `portfolio/features/portfolioScene/webgl/types.ts`
- **Type**: TypeScript Type Definitions
- **Dependencies**: External: Three.js
- **Provides**: TypeScript interfaces for all WebGL entities
- **Exports**:
  - `Vector2D`, `Vector3D`
  - `ParticleSystem`, `Particle`
  - `MorphingMesh`
  - `InteractionState`
- **Size**: ~85 lines ✅

#### `portfolio/features/portfolioScene/webgl/shaders.ts`
- **Type**: GLSL Shader Definitions
- **Dependencies**: None
- **Provides**: Custom vertex and fragment shaders
- **Features**:
  - Vertex shader with displacement and color variation
  - Fragment shader with liquid metal effect
  - Fresnel-based rim lighting
  - Audio-reactive parameters
  - Smooth color transitions
- **Size**: ~95 lines ✅

#### `portfolio/features/portfolioScene/webgl/SceneManager.ts`
- **Type**: TypeScript Class Module
- **Dependencies**: 
  - External: Three.js
  - Internal: `./types`, `./shaders`, `./config`
- **Provides**: Core Three.js scene management
- **Features**:
  - Scene, camera, renderer initialization
  - Particle system creation and animation
  - Morphing geometry mesh with custom shaders
  - Scroll and mouse interaction handling
  - Smooth interpolation (lerp) for all animations
  - Resize handling
  - Proper disposal/cleanup
- **Size**: ~310 lines ✅

#### `portfolio/features/portfolioScene/webgl/AudioManager.ts`
- **Type**: TypeScript Class Module
- **Dependencies**: None (Web Audio API)
- **Provides**: Audio analysis and management
- **Features**:
  - OscillatorNode for ambient audio
  - AnalyserNode for frequency data
  - Play/stop controls
  - Frequency data extraction
  - Proper cleanup
- **Size**: ~85 lines ✅

### UI Components

#### `portfolio/features/portfolioScene/ui/Loader.tsx`
- **Type**: React Component
- **Dependencies**: Internal: `../PortfolioScene.module.css`
- **Provides**: Animated loading screen overlay
- **Features**:
  - Conditional rendering based on loading state
  - Fade-in/out transitions
  - Centered spinner animation
- **Size**: ~25 lines ✅

#### `portfolio/features/portfolioScene/ui/AudioToggle.tsx`
- **Type**: React Component
- **Dependencies**: Internal: `../PortfolioScene.module.css`
- **Provides**: Floating audio control button
- **Features**:
  - Play/pause state visualization
  - Icon toggle (🔊/🔇)
  - Accessible ARIA labels
  - Fixed positioning
- **Size**: ~30 lines ✅

### Content Sections

#### `portfolio/features/portfolioScene/sections/HeroSection.tsx`
- **Type**: React Component
- **Dependencies**: Internal: `../PortfolioScene.module.css`
- **Provides**: Opening hero section with headline
- **Features**:
  - "Building Electric Dreams" headline
  - Accent color highlighting
  - Left-aligned layout
- **Size**: ~25 lines ✅

#### `portfolio/features/portfolioScene/sections/AboutSection.tsx`
- **Type**: React Component
- **Dependencies**: Internal: `../PortfolioScene.module.css`
- **Provides**: Philosophy and approach description
- **Features**:
  - "Vibrant Logic" heading
  - Technology philosophy statement
  - Right-aligned layout
- **Size**: ~25 lines ✅

#### `portfolio/features/portfolioScene/sections/ProjectsSection.tsx`
- **Type**: React Component
- **Dependencies**: Internal: `../PortfolioScene.module.css`
- **Provides**: Featured projects showcase
- **Features**:
  - 3 project cards with titles, descriptions, tech stacks
  - Grid layout
  - Tech stack badges
  - Center-aligned layout
- **Size**: ~60 lines ✅

#### `portfolio/features/portfolioScene/sections/ContactSection.tsx`
- **Type**: React Component
- **Dependencies**: Internal: `../PortfolioScene.module.css`
- **Provides**: Contact information section
- **Features**:
  - Contact heading
  - Email link with accent styling
  - Left-aligned layout
- **Size**: ~30 lines ✅

### Dependency Graph - Portfolio Scene V2

```
┌───────────────────────────────────┐
│ app/portfolio-v2/page.tsx         │
│ (Route Entry)                     │
└────────────┬──────────────────────┘
             │
             ▼
┌───────────────────────────────────┐
│ features/portfolioScene/          │
│ PortfolioScene.tsx                │
│ (Main Orchestrator)               │
└─────┬────────┬──────────┬─────────┘
      │        │          │
      ▼        ▼          ▼
┌─────────┐ ┌──────┐ ┌──────────┐
│ webgl/  │ │ ui/  │ │sections/ │
└─────┬───┘ └──┬───┘ └─────┬────┘
      │        │           │
      ▼        ▼           ▼
┌─────────────────────────────────┐
│ - SceneManager.ts               │
│ - AudioManager.ts               │
│ - config.ts, types.ts, shaders.ts│
│ - Loader.tsx, AudioToggle.tsx   │
│ - Hero, About, Projects, Contact│
└─────────────────────────────────┘
```

### Architecture Principles

1. **Feature-Based Structure**: All related code in `features/portfolioScene/`
2. **Separation of Concerns**: 
   - `webgl/` - Three.js and graphics logic
   - `ui/` - Reusable UI components
   - `sections/` - Content sections
3. **Single Responsibility**: Each file handles one specific concern
4. **Dependency Injection**: SceneManager accepts configuration
5. **Type Safety**: Full TypeScript coverage
6. **Performance First**: Adaptive quality based on device
7. **Clean Lifecycle**: Proper initialization and cleanup

### Integration Points

1. **WebGL ↔ React**: Scene initialized in useEffect, refs for DOM
2. **Scroll → WebGL**: Scroll events update scene progress
3. **Mouse → WebGL**: Mouse movement creates parallax effect
4. **Audio → WebGL**: Frequency data drives visual parameters
5. **Resize → WebGL**: Window resize triggers camera/renderer updates

---

---

## Portfolio Scene V2 - Multi-Layer Parallax System (v1.2.0)

### Image Assets

#### `portfolio/public/img/headphones-girl-bg.png`
- **Type**: PNG Image Asset (Background Layer)
- **Dependencies**: None
- **Consumed By**: `webgl/config.ts`, `webgl/SceneManager.ts`
- **Features**:
  - Transparent PNG with alpha channel
  - Background elements (windows, walls, distant objects)
  - RGBA format for proper transparency
- **Parallax Config**: Speed 0.4, Z-position -0.5

#### `portfolio/public/img/headphones-girl-fg.png`
- **Type**: PNG Image Asset (Foreground Layer)
- **Dependencies**: None
- **Consumed By**: `webgl/config.ts`, `webgl/SceneManager.ts`
- **Features**:
  - Transparent PNG with alpha channel
  - Foreground elements (main subject, close objects)
  - RGBA format for proper transparency
- **Parallax Config**: Speed 1.0, Z-position 0.0

### Documentation

#### `memlog/parallax_layering_guide.md`
- **Type**: Technical Documentation
- **Dependencies**: None
- **Provides**: Comprehensive guide for creating multi-layer parallax images
- **Topics**:
  - Photoshop/GIMP layer separation (3 methods)
  - PNG export requirements and settings
  - Configuration examples and best practices
  - Troubleshooting common issues
  - Parallax speed and z-position guidelines
  - Testing checklist
- **Size**: ~280 lines

### Updated Components (v1.2.0)

#### `portfolio/features/portfolioScene/webgl/config.ts` (Updated)
- **Changes**: 
  - Added multi-layer texture configuration
  - Layer-specific parallax speeds and z-positions
  - `disableDistortion` flag per layer
- **Features**:
  - Layer 0 (background): parallaxSpeed 0.4, zPosition -0.5
  - Layer 1 (foreground): parallaxSpeed 1.0, zPosition 0.0
  - Proper aspect ratio and sizing

#### `portfolio/features/portfolioScene/webgl/shaders.ts` (Updated)
- **Changes**:
  - Modified fragment shader to preserve alpha channel
  - Changed from RGB to RGBA texture sampling
  - Extract alpha from center sample: `float alpha = texG.a`
  - Output with alpha: `gl_FragColor = vec4(color, alpha)`
- **Features**:
  - Proper transparency handling
  - Alpha-aware chromatic aberration
  - Clean multi-layer compositing

#### `portfolio/features/portfolioScene/webgl/SceneManager.ts` (Updated)
- **Changes**:
  - Added multi-layer texture loading
  - Layer-specific mesh creation with z-positioning
  - Added `blending: THREE.NormalBlending` to materials
  - Explicit `texture.format = THREE.RGBAFormat`
  - Layer-specific parallax speed application
- **Features**:
  - Multiple mesh management
  - Independent layer animation
  - Proper alpha compositing
  - Per-layer update logic

### Integration: Multi-Layer Parallax

```
┌─────────────────────────────┐
│ Image Assets (PNG + Alpha) │
│ - headphones-girl-bg.png    │
│ - headphones-girl-fg.png  │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ config.ts                   │
│ - Layer definitions         │
│ - Parallax speeds           │
│ - Z-positions               │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ SceneManager.ts             │
│ - Load textures (RGBA)      │
│ - Create meshes per layer   │
│ - Apply z-positions         │
│ - Animate with diff speeds  │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ shaders.ts                  │
│ - Preserve alpha channel    │
│ - Alpha-aware effects       │
│ - Proper blending           │
└─────────────────────────────┘
```

### Technical Implementation

1. **Layer Separation**: Manual Photoshop/GIMP selection and export
2. **Transparency**: PNG-24/32 with alpha channel preserved
3. **Configuration**: Layer array in config.ts with speed/position
4. **Loading**: THREE.TextureLoader with RGBA format
5. **Rendering**: Separate meshes with z-positioning
6. **Animation**: Layer-specific parallax speeds on scroll/mouse
7. **Blending**: NormalBlending for proper alpha compositing

### Key Features

- **No Distortion**: Clean parallax without warping (`disableDistortion: true`)
- **Depth Perception**: Different parallax speeds create depth
- **Transparency**: Foreground reveals background through alpha
- **Performance**: Optimized multi-layer rendering
- **Configurability**: Easy to add more layers via config

---

**Last Updated**: 2025-12-17  
**Version**: 1.2.0  
**Total Modules**: 31 (6 TypeScript core + 1 JSON + 10 Portfolio v1 components + 12 Portfolio Scene V2 modules + 2 image assets)
