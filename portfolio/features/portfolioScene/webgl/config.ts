/**
 * Scene Configuration
 * Centralized configuration for the Three.js scene
 */

export interface TextureLayer {
  path: string;
  parallaxSpeed: number;  // 0.0 - 1.0+ (lower = slower/farther)
  zPosition: number;      // Depth position (negative = behind, positive = front)
  disableDistortion?: boolean;  // Optional: disable UV distortion for clean rendering
}

export interface SceneConfig {
  colors: {
    bg: string;
    accentA: string;
    accentB: string;
    base: string;
  };
  camera: {
    fov: number;
    zStart: number;  // Zoomed in position
    zEnd: number;    // Zoomed out position
    scrollThreshold: number; // Scroll % where camera stops (0.5 = 50%)
  };
  texture: {
    layers: TextureLayer[];
    aspectRatio: number;
    width: number;
    height: number;
  };
  effects: {
    chromaticAberration: {
      base: number;
      scrollMax: number;
      audioMax: number;
    };
    uvDistortion: {
      base: number;
      scrollMax: number;
      audioMax: number;
    };
    scrollVelocity: {
      threshold: number;
      multiplier: number;
    };
  };
  performance: {
    maxDPR: number;
    reduceMotion: boolean;
  };
}

/**
 * Default scene configuration instance - Shopify-style cinematic experience
 */
export const sceneConfig: SceneConfig = {
  colors: {
    bg: '#050505',
    accentA: '#ff2a6d',  // Electric Red/Pink
    accentB: '#ffcc00',  // Bright Yellow
    base: '#05d9e8'      // Vibrant Cyan/Blue
  },
  camera: {
    fov: 40,
    zStart: 3.5,         // Tight crop on headphones
    zEnd: 8.0,           // Full character reveal
    scrollThreshold: 0.5 // Camera locks at 50% scroll
  },
  texture: {
    layers: [
      {
        path: '/img/headphones-girl-bg.png',  // Background layer (window)
        parallaxSpeed: 0.4,  // Moves slower - appears farther away
        zPosition: -0.5,     // Positioned behind foreground
        disableDistortion: true  // No distortion for clean multi-layer effect
      },
      {
        path: '/img/headphones-girl-fg.png',  // Foreground layer (girl + chair + headphones)
        parallaxSpeed: 1.0,  // Moves at full speed - appears closer
        zPosition: 0.0,      // Positioned in front
        disableDistortion: true  // No distortion for clean multi-layer effect
      }
    ],
    aspectRatio: 16 / 9,  // Landscape format
    width: 6.0,           // Wide format for landscape
    height: 3.375         // Maintains 16:9 ratio
  },
  effects: {
    chromaticAberration: {
      base: 0.0,          // Disabled for clean multi-layer parallax
      scrollMax: 0.0,     // No scroll aberration
      audioMax: 0.001     // Minimal audio pulse only
    },
    uvDistortion: {
      base: 0.0,          // Disabled for clean parallax
      scrollMax: 0.0,     // No scroll distortion
      audioMax: 0.0       // No audio distortion
    },
    scrollVelocity: {
      threshold: 0.01,    // Only on fast scrolling
      multiplier: 0.5     // Gentle glitch response
    }
  },
  performance: {
    maxDPR: 2,
    reduceMotion: false
  }
};

export const CONFIG: SceneConfig = sceneConfig;

/**
 * Get adaptive config based on device and user preferences
 */
export function getAdaptiveConfig(): SceneConfig {
  const config = { ...CONFIG };
  
  // Check for reduced motion preference
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    config.performance.reduceMotion = prefersReducedMotion;
    
    if (prefersReducedMotion) {
      // Reduce effect intensities
      config.effects.chromaticAberration.scrollMax = 0.001;
      config.effects.uvDistortion.scrollMax = 0.02;
    }
    
    // Reduce quality on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      config.performance.maxDPR = 1.5;
      // Reduce effect intensity on mobile for better performance
      config.effects.chromaticAberration.audioMax = 0.002;
      config.effects.uvDistortion.audioMax = 0.05;
    }
  }
  
  return config;
}
