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
    z: number;
  };
  particles: {
    count: number;
    size: number;
    opacity: number;
  };
  mesh: {
    subdivisions: number;
    radius: number;
  };
  performance: {
    maxDPR: number;
    reduceMotion: boolean;
  };
}

/**
 * Default scene configuration instance
 */
export const sceneConfig: SceneConfig = {
  colors: {
    bg: '#050505',
    accentA: '#ff2a6d',
    accentB: '#ffcc00',
    base: '#05d9e8'
  },
  camera: {
    fov: 40,
    z: 7
  },
  mesh: {
    radius: 1.5,
    subdivisions: 120
  },
  particles: {
    count: 1000,
    size: 0.04,
    opacity: 0.6
  },
  performance: {
    maxDPR: 2,
    reduceMotion: false
  }
};

export const CONFIG: SceneConfig = {
  colors: {
    bg: '#050505',
    accentA: '#ff2a6d',  // Electric Red/Pink
    accentB: '#ffcc00',  // Bright Yellow
    base: '#05d9e8'      // Vibrant Cyan/Blue
  },
  camera: {
    fov: 40,
    z: 7
  },
  particles: {
    count: 1000,
    size: 0.04,
    opacity: 0.6
  },
  mesh: {
    subdivisions: 64, // Reduced from 120 for better performance
    radius: 1.5
  },
  performance: {
    maxDPR: 2,
    reduceMotion: false
  }
};

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
      config.particles.count = 300; // Reduce particles
      config.mesh.subdivisions = 32; // Reduce geometry complexity
    }
    
    // Reduce quality on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      config.particles.count = Math.min(config.particles.count, 600);
      config.performance.maxDPR = 1.5;
    }
  }
  
  return config;
}
