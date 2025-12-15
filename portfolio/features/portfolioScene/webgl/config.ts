/**
 * Scene Configuration
 * Centralized configuration for the Three.js scene
 */

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
    path: string;
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
    path: '/img/HeadphonesGirl2.png',
    aspectRatio: 16 / 9,  // Landscape format
    width: 6.0,           // Wide format for landscape
    height: 3.375         // Maintains 16:9 ratio
  },
  effects: {
    chromaticAberration: {
      base: 0.0008,       // Very subtle at rest
      scrollMax: 0.002,   // Gentle during scroll
      audioMax: 0.003     // Slight pulse on audio
    },
    uvDistortion: {
      base: 0.02,         // Minimal ripple
      scrollMax: 0.05,    // Elegant wave during movement
      audioMax: 0.08      // Responsive but refined
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
