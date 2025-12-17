/**
 * Scene Manager V2 - Shopify-Inspired Cinematic Experience
 * Core Three.js scene management with texture-based plane
 * Features: Camera dolly zoom, elegant glitch effects, audio reactivity
 */

import * as THREE from 'three';
import { SceneConfig } from './config';
import { vertexShader, fragmentShader } from './shaders';
import { MousePosition } from './types';

export class SceneManager {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private planes: THREE.Mesh[] = [];
  private materials: THREE.ShaderMaterial[] = [];
  private textures: (THREE.Texture | null)[] = [];
  private textureLoader: THREE.TextureLoader;
  
  // State
  private scrollTarget: number = 0;
  private scrollCurrent: number = 0;
  private scrollPrevious: number = 0;
  private scrollVelocity: number = 0;
  private mouseTarget: MousePosition = { x: 0, y: 0 };
  private mouseCurrent: MousePosition = { x: 0, y: 0 };
  
  // Animation
  private isDisposed: boolean = false;

  constructor(container: HTMLElement, private config: SceneConfig) {
    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, config.performance.maxDPR));
    container.appendChild(this.renderer.domElement);

    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(config.colors.bg);

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      config.camera.fov,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    this.camera.position.z = config.camera.zStart;

    // Create texture loader
    this.textureLoader = new THREE.TextureLoader();

    // Create planes for each layer (will be textured after loading)
    this.createPlanes();

    // Load textures asynchronously for all layers
    this.loadTextures();
  }

  /**
   * Load textures for all layers
   */
  private loadTextures(): void {
    this.config.texture.layers.forEach((layer, index) => {
      this.textureLoader.load(
        layer.path,
        (texture) => {
          // Enable proper alpha channel support
          texture.format = THREE.RGBAFormat;
          texture.needsUpdate = true;
          
          this.textures[index] = texture;
          this.materials[index].uniforms.uTexture.value = texture;
          this.materials[index].needsUpdate = true;
          console.log(`✅ Layer ${index} texture loaded:`, layer.path);
        },
        undefined,
        (error) => {
          console.error(`❌ Error loading layer ${index} texture:`, error);
          // Create fallback gradient texture for this layer
          this.createFallbackTexture(index);
        }
      );
    });
  }

  /**
   * Create a fallback gradient texture if image fails to load
   */
  private createFallbackTexture(layerIndex: number): void {
    const layer = this.config.texture.layers[layerIndex];
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 576; // 16:9 ratio
    const ctx = canvas.getContext('2d')!;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, this.config.colors.accentA);
    gradient.addColorStop(0.5, this.config.colors.base);
    gradient.addColorStop(1, this.config.colors.accentB);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Layer ${layerIndex} image missing:`, canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText(layer.path, canvas.width / 2, canvas.height / 2 + 30);
    
    this.textures[layerIndex] = new THREE.CanvasTexture(canvas);
    this.materials[layerIndex].uniforms.uTexture.value = this.textures[layerIndex];
    this.materials[layerIndex].needsUpdate = true;
  }

  /**
   * Create all image planes with shaders (one per layer)
   */
  private createPlanes(): void {
    this.config.texture.layers.forEach((layer, index) => {
      const geometry = new THREE.PlaneGeometry(
        this.config.texture.width,
        this.config.texture.height,
        32,  // Width segments for smooth distortion
        32   // Height segments
      );

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uAudio: { value: 0 },
          uScrollVelocity: { value: 0 },
          uTexture: { value: null }, // Will be set when texture loads
          uColorA: { value: new THREE.Color(this.config.colors.accentA) },
          uColorB: { value: new THREE.Color(this.config.colors.accentB) },
          uChromaticAberration: { value: this.config.effects.chromaticAberration.base },
          uUVDistortion: { value: this.config.effects.uvDistortion.base },
        },
        transparent: true,               // Enable transparency for layering
        side: THREE.DoubleSide,          // Render both sides
        depthWrite: false,               // Prevent z-fighting between layers
        depthTest: true,                 // Enable depth testing for proper layering
        blending: THREE.NormalBlending,  // Use normal alpha blending
      });

      const plane = new THREE.Mesh(geometry, material);
      
      // Position layer at its defined Z-depth
      plane.position.z = layer.zPosition;
      
      // Store references
      this.planes.push(plane);
      this.materials.push(material);
      this.textures.push(null);
      
      // Add to scene
      this.scene.add(plane);
    });
  }

  /**
   * Resize handler
   */
  resize(width: number, height: number): void {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  /**
   * Set scroll target (0..1)
   */
  setScrollTarget(scroll01: number): void {
    this.scrollTarget = scroll01;
  }

  /**
   * Set mouse target (normalized device coordinates)
   */
  setMouseTarget(mouse: MousePosition): void {
    this.mouseTarget = mouse;
  }

  /**
   * Cubic ease-out function for smooth camera movement
   */
  private easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
  }

  /**
   * Update scene state (call this in RAF loop)
   */
  update(timeS: number, audio01: number): void {
    if (this.isDisposed) return;

    // Smooth lerps for natural movement
    this.scrollCurrent = THREE.MathUtils.lerp(this.scrollCurrent, this.scrollTarget, 0.05);
    this.mouseCurrent.x = THREE.MathUtils.lerp(this.mouseCurrent.x, this.mouseTarget.x, 0.05);
    this.mouseCurrent.y = THREE.MathUtils.lerp(this.mouseCurrent.y, this.mouseTarget.y, 0.05);

    // Calculate scroll velocity for glitch effects
    this.scrollVelocity = Math.abs(this.scrollCurrent - this.scrollPrevious);
    this.scrollPrevious = this.scrollCurrent;

    // Camera dolly zoom (0-50% scroll only)
    const scrollThreshold = this.config.camera.scrollThreshold;
    const scrollForCamera = Math.min(this.scrollCurrent / scrollThreshold, 1.0);
    const easedScroll = this.easeOutCubic(scrollForCamera);
    
    const targetZ = THREE.MathUtils.lerp(
      this.config.camera.zStart,
      this.config.camera.zEnd,
      easedScroll
    );
    this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, targetZ, 0.05);

    // Apply parallax motion to each layer based on their parallaxSpeed
    this.planes.forEach((plane, index) => {
      const layer = this.config.texture.layers[index];
      
      // Vertical parallax (scroll-based) - different speed per layer
      plane.position.y = this.scrollCurrent * layer.parallaxSpeed * 2.0;
      
      // Horizontal parallax (mouse-based) - different speed per layer
      plane.position.x = this.mouseCurrent.x * layer.parallaxSpeed * 0.3;
    });

    // Calculate chromatic aberration (scroll + velocity + audio)
    const scrollAberration = THREE.MathUtils.lerp(
      this.config.effects.chromaticAberration.base,
      this.config.effects.chromaticAberration.scrollMax,
      scrollForCamera
    );
    
    const velocityAberration = this.scrollVelocity > this.config.effects.scrollVelocity.threshold
      ? this.scrollVelocity * this.config.effects.scrollVelocity.multiplier
      : 0;
    
    const audioAberration = audio01 * this.config.effects.chromaticAberration.audioMax;
    
    const totalAberration = scrollAberration + velocityAberration + audioAberration;

    // Calculate UV distortion (scroll + audio)
    const scrollDistortion = THREE.MathUtils.lerp(
      this.config.effects.uvDistortion.base,
      this.config.effects.uvDistortion.scrollMax,
      scrollForCamera
    );
    
    const audioDistortion = audio01 * this.config.effects.uvDistortion.audioMax;
    const totalDistortion = scrollDistortion + audioDistortion;

    // Update shader uniforms for all layers
    this.materials.forEach((material) => {
      material.uniforms.uTime.value = timeS;
      material.uniforms.uScroll.value = this.scrollCurrent;
      material.uniforms.uScrollVelocity.value = this.scrollVelocity;
      material.uniforms.uAudio.value = THREE.MathUtils.lerp(
        material.uniforms.uAudio.value,
        audio01,
        0.1
      );
      material.uniforms.uChromaticAberration.value = totalAberration;
      material.uniforms.uUVDistortion.value = totalDistortion;
    });
  }

  /**
   * Render the scene
   */
  render(): void {
    if (this.isDisposed) return;
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Clean up all resources
   */
  dispose(): void {
    if (this.isDisposed) return;
    
    this.isDisposed = true;

    // Dispose all textures
    this.textures.forEach((texture) => {
      if (texture) {
        texture.dispose();
      }
    });

    // Dispose all planes
    this.planes.forEach((plane) => {
      // Dispose geometry
      if (plane.geometry) {
        plane.geometry.dispose();
      }

      // Dispose material
      if (plane.material) {
        (plane.material as THREE.Material).dispose();
      }

      // Remove from scene
      this.scene.remove(plane);
    });

    // Clear arrays
    this.planes = [];
    this.materials = [];
    this.textures = [];

    // Dispose renderer
    this.renderer.dispose();
    
    // Remove canvas from DOM
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }

  /**
   * Get renderer DOM element
   */
  getDomElement(): HTMLCanvasElement {
    return this.renderer.domElement;
  }
}
