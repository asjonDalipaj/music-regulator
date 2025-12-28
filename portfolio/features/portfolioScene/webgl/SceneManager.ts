/**
 * Scene Manager V2 - Shopify-Inspired Cinematic Experience
 * Core Three.js scene management with texture-based plane
 * Features: Camera dolly zoom, elegant glitch effects, audio reactivity
 */

import * as THREE from 'three';
import { SceneConfig } from './config';
import { vertexShader, fragmentShader } from './shaders';
import { starfieldVertexShader, starfieldFragmentShader } from './StarfieldShader';
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
      // Skip texture loading for starfield (procedural)
      if (layer.path === 'starfield') {
        console.log(`✅ Layer ${index} using procedural starfield`);
        return;
      }
      
      this.textureLoader.load(
        layer.path,
        (texture) => {
          // Enable proper alpha channel support
          texture.format = THREE.RGBAFormat;
          texture.needsUpdate = true;
          
          // Add high-quality texture filtering for smooth edges
          texture.minFilter = THREE.LinearMipMapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = true;
          
          // Enable anisotropic filtering for better quality at angles
          const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
          texture.anisotropy = maxAnisotropy;
          
          this.textures[index] = texture;
          this.materials[index].uniforms.uTexture.value = texture;
          this.materials[index].needsUpdate = true;
          console.log(`✅ Layer ${index} texture loaded with filtering:`, layer.path);
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
      // Starfield needs much larger geometry to fill entire viewport
      const isStarfield = layer.path === 'starfield';
      const planeWidth = isStarfield ? 30 : this.config.texture.width;
      const planeHeight = isStarfield ? 30 : this.config.texture.height;
      
      const geometry = new THREE.PlaneGeometry(
        planeWidth,
        planeHeight,
        32,  // Width segments for smooth distortion
        32   // Height segments
      );

      let material: THREE.ShaderMaterial;
      
      // Check if this is the starfield layer
      if (isStarfield) {
        // Create starfield shader material
        material = new THREE.ShaderMaterial({
          vertexShader: starfieldVertexShader,
          fragmentShader: starfieldFragmentShader,
          uniforms: {
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uAudio: { value: 0 },
          },
          transparent: false,
          side: THREE.DoubleSide,
          depthWrite: true,
          depthTest: true,
        });
      } else {
        // Create standard texture shader material
        material = new THREE.ShaderMaterial({
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
            uBlurAmount: { value: layer.blurAmount },
            uEdgeFade: { value: layer.edgeFade },
          },
          transparent: true,               // Enable transparency for layering
          side: THREE.DoubleSide,          // Render both sides
          depthWrite: false,               // Prevent z-fighting between layers
          depthTest: true,                 // Enable depth testing for proper layering
          blending: THREE.NormalBlending,  // Use normal alpha blending
        });
      }

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
   * Elastic easing function for dramatic Shopify-style motion
   */
  private easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 3;
    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  }

  /**
   * Update scene state (call this in RAF loop)
   */
  update(timeS: number, audio01: number): void {
    if (this.isDisposed) return;

    // Dramatic spring physics for mouse movement (faster, more responsive)
    const mouseLerpSpeed = 0.12; // Increased from 0.05 for snappier response
    this.mouseCurrent.x = THREE.MathUtils.lerp(this.mouseCurrent.x, this.mouseTarget.x, mouseLerpSpeed);
    this.mouseCurrent.y = THREE.MathUtils.lerp(this.mouseCurrent.y, this.mouseTarget.y, mouseLerpSpeed);
    
    // Slower, smooth lerp for scroll
    this.scrollCurrent = THREE.MathUtils.lerp(this.scrollCurrent, this.scrollTarget, 0.05);

    // Track scroll velocity (disabled glitch effects but keeping for potential future use)
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

    // Apply dramatic 3D parallax motion to each layer
    this.planes.forEach((plane, index) => {
      const layer = this.config.texture.layers[index];
      
      // === VERTICAL PARALLAX (scroll-based) ===
      // INVERSE parallax: background moves MORE than foreground
      plane.position.y = this.scrollCurrent * layer.parallaxSpeed * 2.0;
      
      // === HORIZONTAL PARALLAX (mouse X-axis) ===
      // Dramatic movement range (3x increase)
      plane.position.x = this.mouseCurrent.x * layer.parallaxSpeed * 1.0;
      
      // === NEW: VERTICAL MOUSE PARALLAX (mouse Y-axis) ===
      // Add Y-axis mouse movement for true 3D depth
      const mouseYOffset = this.mouseCurrent.y * layer.parallaxSpeed * 0.5;
      plane.position.y += mouseYOffset;
      
      // === NEW: 3D ROTATION/TILT (Card Effect) ===
      // Rotate planes based on mouse position for dramatic 3D tilt
      const rotationX = -this.mouseCurrent.y * 0.2 * layer.rotationIntensity;
      const rotationY = this.mouseCurrent.x * 0.2 * layer.rotationIntensity;
      
      // Apply rotation with spring-like smoothing
      plane.rotation.x = THREE.MathUtils.lerp(plane.rotation.x, rotationX, 0.08);
      plane.rotation.y = THREE.MathUtils.lerp(plane.rotation.y, rotationY, 0.08);
      
      // === NEW: DYNAMIC SCALE (Depth Enhancement) ===
      // Subtle scale variation based on mouse distance from center
      const mouseDist = Math.sqrt(this.mouseCurrent.x ** 2 + this.mouseCurrent.y ** 2);
      const scaleVariation = 1.0 + (mouseDist * 0.03 * layer.rotationIntensity);
      plane.scale.setScalar(THREE.MathUtils.lerp(plane.scale.x, scaleVariation, 0.08));
    });

    // Glitch effects disabled - set to zero
    const totalAberration = 0;
    const totalDistortion = 0;

    // Update shader uniforms for all layers
    this.materials.forEach((material, index) => {
      const layer = this.config.texture.layers[index];
      
      // Update common uniforms
      material.uniforms.uTime.value = timeS;
      material.uniforms.uScroll.value = this.scrollCurrent;
      
      // Starfield-specific uniforms
      if (layer.path === 'starfield') {
        material.uniforms.uMouse.value.set(this.mouseCurrent.x, this.mouseCurrent.y);
        material.uniforms.uAudio.value = THREE.MathUtils.lerp(
          material.uniforms.uAudio.value,
          audio01,
          0.1
        );
      }
      // Standard texture layer uniforms
      else {
        material.uniforms.uScrollVelocity.value = this.scrollVelocity;
        material.uniforms.uAudio.value = THREE.MathUtils.lerp(
          material.uniforms.uAudio.value,
          audio01,
          0.1
        );
        material.uniforms.uChromaticAberration.value = totalAberration;
        material.uniforms.uUVDistortion.value = totalDistortion;
      }
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
