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
  private plane: THREE.Mesh;
  private material: THREE.ShaderMaterial;
  private texture: THREE.Texture | null = null;
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

    // Create plane (will be textured after loading)
    this.plane = this.createPlane();
    this.scene.add(this.plane);

    // Store material reference for updates
    this.material = this.plane.material as THREE.ShaderMaterial;

    // Load texture asynchronously
    this.loadTexture();
  }

  /**
   * Load the hero image texture
   */
  private loadTexture(): void {
    this.textureLoader.load(
      this.config.texture.path,
      (texture) => {
        this.texture = texture;
        this.material.uniforms.uTexture.value = texture;
        this.material.needsUpdate = true;
        console.log('✅ Texture loaded successfully:', this.config.texture.path);
      },
      undefined,
      (error) => {
        console.error('❌ Error loading texture:', error);
        // Create fallback gradient texture
        this.createFallbackTexture();
      }
    );
  }

  /**
   * Create a fallback gradient texture if image fails to load
   */
  private createFallbackTexture(): void {
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
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Add your image here:', canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText(this.config.texture.path, canvas.width / 2, canvas.height / 2 + 30);
    
    this.texture = new THREE.CanvasTexture(canvas);
    this.material.uniforms.uTexture.value = this.texture;
    this.material.needsUpdate = true;
  }

  /**
   * Create the main image plane with shaders
   */
  private createPlane(): THREE.Mesh {
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
      transparent: false,
    });

    return new THREE.Mesh(geometry, material);
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

    // Subtle mouse parallax on plane
    this.plane.position.x = this.mouseCurrent.x * 0.2;
    this.plane.position.y = this.mouseCurrent.y * 0.2;

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

    // Update shader uniforms
    this.material.uniforms.uTime.value = timeS;
    this.material.uniforms.uScroll.value = this.scrollCurrent;
    this.material.uniforms.uScrollVelocity.value = this.scrollVelocity;
    this.material.uniforms.uAudio.value = THREE.MathUtils.lerp(
      this.material.uniforms.uAudio.value,
      audio01,
      0.1
    );
    this.material.uniforms.uChromaticAberration.value = totalAberration;
    this.material.uniforms.uUVDistortion.value = totalDistortion;
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

    // Dispose texture
    if (this.texture) {
      this.texture.dispose();
    }

    // Dispose geometry
    if (this.plane.geometry) {
      this.plane.geometry.dispose();
    }

    // Dispose material
    if (this.plane.material) {
      (this.plane.material as THREE.Material).dispose();
    }

    // Remove from scene
    this.scene.remove(this.plane);

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
