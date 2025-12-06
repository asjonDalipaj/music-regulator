# 🎵 Real-Time Music Regulator

**A Digital Therapeutic (DTx) Demonstration for Adaptive Music Therapy**

---

## 📋 Project Overview

The Real-Time Music Regulator is a portfolio-ready demonstration of an evidence-based, adaptive music intervention system. It showcases how AI/ML and biofeedback can be integrated to deliver personalized music therapy in real-time.

### Key Features

- 🧠 **Simulated Biofeedback**: Realistic physiological data generation (heart rate, HRV, arousal, valence)
- 🎼 **Adaptive Music Engine**: Three therapeutic algorithms (ISO-principle, entrainment, progressive)
- 🤖 **AI Emotion Recognition**: Multi-modal emotion classification (physiological + facial simulation)
- 📊 **Real-Time Adaptation**: Music parameters adjust dynamically based on patient state
- 🏥 **Clinical Grounding**: Evidence-based design following music therapy research

---

## 🏗️ Architecture

### Current Structure (v0.2.0)

```
music-regulator/
├── memlog/                          # Project tracking & documentation
│   ├── tasks.log                    # Task management
│   ├── changelog.md                 # Development history
│   ├── file_dependencies.md         # Module relationships
│   ├── stability_checklist.md       # Quality assurance
│   └── potential_issues.md          # Risk tracking
│
├── src/
│   ├── data/
│   │   └── biofeedback-profiles.json    # Physiological state profiles
│   │
│   ├── simulators/
│   │   ├── BiofeedbackSimulator.ts      # Realistic biosignal generation
│   │   └── EmotionRecognition.ts        # AI emotion classification (simulated)
│   │
│   ├── music/
│   │   └── AdaptiveMusicEngine.ts       # Core therapeutic music adaptation
│   │
│   ├── ai/                              # [PLANNED] ML simulation layer
│   └── components/                      # [PLANNED] React components
│
├── docs/                                # [PLANNED] Technical documentation
├── index.html                           # Original demo (to be refactored)
└── README.md                            # This file
```

---

## 🔬 Technical Components

### 1. Biofeedback Simulation (`src/simulators/BiofeedbackSimulator.ts`)

**Purpose**: Generate realistic physiological data streams

**Features**:
- 6 predefined emotional states (relaxed, focused, stressed, anxious, energized, fatigued)
- Natural variability using noise generation
- Smooth transitions between states
- Scenario-based playback (e.g., 30-minute stress reduction session)

**Metrics Simulated**:
- Heart Rate (BPM)
- Heart Rate Variability (HRV)
- Arousal Level (0-100)
- Valence (emotional positivity, 0-100)
- Respiration Rate
- Skin Conductance
- Muscle Tension

**Usage Example**:
```typescript
const simulator = new BiofeedbackSimulator('focused');
simulator.subscribe((reading) => {
  console.log(reading.heartRate, reading.arousal);
});
simulator.start();
simulator.transitionTo('relaxed'); // Smooth 50-second transition
```

### 2. Emotion Recognition (`src/simulators/EmotionRecognition.ts`)

**Purpose**: Simulate AI-powered emotion detection from biofeedback

**Features**:
- Arousal-valence model for emotion classification
- Multi-modal fusion (physiological + facial)
- Confidence scores with realistic variability
- Trend analysis over time

**Emotion Categories**:
- Happy, Sad, Anxious, Calm, Focused, Frustrated, Energized

**Usage Example**:
```typescript
const recognizer = new EmotionRecognizer();
const prediction = await recognizer.recognizeMultimodal(biofeedbackReading);
console.log(prediction.emotion, prediction.confidence);
```

### 3. Adaptive Music Engine (`src/music/AdaptiveMusicEngine.ts`)

**Purpose**: Generate therapeutic music parameters based on biofeedback

**Therapeutic Algorithms**:

1. **ISO-Principle** (Default)
   - Matches current emotional state
   - Gradually guides toward therapeutic target
   - Evidence: Most effective for stress/anxiety reduction

2. **Entrainment**
   - Directly sets target physiological state via music
   - Evidence: Effective for sleep induction, meditation

3. **Progressive**
   - Step-wise adaptation based on biofeedback trends
   - Evidence: Good for long-term monitoring sessions

**Music Parameters Controlled**:
- Tempo (BPM)
- Harmony (consonant/complex/dissonant)
- Volume
- Note Density
- Timbre (soft/neutral/bright)
- Rhythm Complexity

**Therapeutic Goals**:
- Relaxation
- Focus Enhancement
- Energy Boost
- Mood Elevation

**Usage Example**:
```typescript
const engine = new AdaptiveMusicEngine({ 
  type: 'relaxation', 
  intensity: 70 
});
engine.setAlgorithm('iso_principle');

const params = engine.update(biofeedbackReading);
// Apply params.tempo, params.harmony, etc. to audio engine
```

---

## 📊 Biofeedback Profiles

Six clinically-inspired emotional states:

| Profile | Arousal | Valence | HR (bpm) | Use Case |
|---------|---------|---------|----------|----------|
| **Relaxed** | 20 | 80 | 65 | Meditation baseline |
| **Focused** | 45 | 60 | 72 | Productive work state |
| **Stressed** | 85 | 30 | 95 | Acute stress response |
| **Anxious** | 75 | 35 | 88 | Chronic worry |
| **Energized** | 80 | 75 | 92 | Positive arousal |
| **Fatigued** | 25 | 35 | 70 | Mental exhaustion |

---

## 🎯 Therapeutic Scenarios

Pre-defined intervention timelines:

1. **Stress Reduction** (30 min)
   - Stressed → Anxious → Focused → Relaxed
   - Demonstrates ISO-principle effectiveness

2. **Focus Enhancement** (15 min)
   - Fatigued → Focused (sustained)
   - Demonstrates entrainment for concentration

3. **Anxiety Management** (20 min)
   - Anxious → Focused → Relaxed
   - Progressive calming intervention

---

## 🚀 Roadmap

### Phase 1: Core Foundation ✅ (Current)
- [x] Memlog system setup
- [x] Biofeedback simulation
- [x] Emotion recognition simulation
- [x] Adaptive music engine

### Phase 2: AI/ML Layer (In Progress)
- [ ] Playlist recommendation system
- [ ] Reinforcement learning simulation
- [ ] Personalization engine

### Phase 3: Portfolio Integration
- [ ] Next.js portfolio website
- [ ] React component refactoring
- [ ] Interactive demo embedding
- [ ] Project showcase page

### Phase 4: Enhancement
- [ ] Real Tone.js integration
- [ ] Data visualization dashboard
- [ ] Session analytics
- [ ] Clinical documentation

### Phase 5: Future (Real ML Integration)
- [ ] Python backend (Flask/FastAPI)
- [ ] Real emotion detection models
- [ ] Spotify API integration
- [ ] User personalization learning

---

## 🧪 Development Principles

Following user-defined rules (`.clinerules`):

1. **File Size Limit**: Max 400 lines per file
2. **Modular Design**: Clear separation of concerns
3. **Documentation**: Comprehensive inline comments
4. **Error Handling**: Graceful degradation
5. **Type Safety**: TypeScript strict mode

---

## 📚 Clinical Evidence Base

This project draws from:

- **Music Therapy Research**: Tempo-heart rate entrainment, harmonic tension effects
- **Affective Computing**: Arousal-valence circumplex model
- **Biofeedback Therapy**: Real-time physiological monitoring
- **Digital Therapeutics**: Evidence-based intervention design

**Note**: This is a demonstration/proof-of-concept. No clinical validation has been performed.

---

## 🔒 Privacy & Security

- **Simulated Data Only**: No real patient data collected
- **HIPAA-Aligned Design**: Architecture follows privacy principles
- **Transparent Simulation**: Clear labeling of AI/ML simulation vs real models

---

## 🛠️ Technology Stack

**Current**:
- TypeScript (type safety)
- JSON (data storage)
- Modular ES6+ architecture

**Planned**:
- Next.js 14+ (React framework)
- Tailwind CSS (styling)
- Tone.js (audio synthesis)
- Framer Motion (animations)

---

## 📖 Getting Started

**Prerequisites**: Modern browser with ES6+ support

**Current Demo**:
```bash
# Open in browser
open index.html
```

**Future (Next.js)**:
```bash
npm install
npm run dev
```

---

## 👤 Author

Portfolio project demonstrating expertise in:
- Digital Health / Digital Therapeutics
- AI/ML Integration
- Music Technology
- Evidence-Based Design

---

## 📄 License

Portfolio demonstration project - All rights reserved

---

## 🙏 Acknowledgments

- Music therapy research community
- Open-source audio/ML libraries
- Evidence-based healthcare practitioners

---

**Last Updated**: 2025-06-12  
**Version**: 0.2.0  
**Status**: Active Development
