/**
 * Scene Manager
 * Core Three.js scene management with imperative API
 * Handles renderer, scene, camera, mesh, particles, and animation
 */

import * as THREE from 'three';
import { SceneConfig } from './config';
import { vertexShader, fragmentShader } from './shaders';
import { MousePosition } from './types';

export class SceneManager {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private mesh: THREE.Mesh;
  private particles: THREE.Points;
  private material: THREE.ShaderMaterial;
  
  // State
  private scrollTarget: number = 0;
  private scrollCurrent: number = 0;
  private mouseTarget: MousePosition = { x: 0, y: 0 };
  private mouseCurrent: MousePosition = { x: 0, y: 0 };
  
  // Animation
  private rafId: number | null = null;
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
    this.scene.fog = new THREE.FogExp2(config.colors.bg, 0.05);

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      config.camera.fov,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    this.camera.position.z = config.camera.z;

    // Create mesh
    this.mesh = this.createMesh();
    this.scene.add(this.mesh);

    // Create particles
    this.particles = this.createParticles();
    this.scene.add(this.particles);

    // Store material reference for updates
    this.material = this.mesh.material as THREE.ShaderMaterial;
  }

  /**
   * Create the main fluid mesh
   */
  private createMesh(): THREE.Mesh {
    const geometry = new THREE.IcosahedronGeometry(
      this.config.mesh.radius,
      this.config.mesh.subdivisions
    );

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uAudio: { value: 0 },
        uColorA: { value: new THREE.Color(this.config.colors.accentA) },
        uColorB: { value: new THREE.Color(this.config.colors.accentB) },
        uBaseColor: { value: new THREE.Color(this.config.colors.base) },
        cameraPosition: { value: this.camera.position }
      },
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 2;

    return mesh;
  }

  /**
   * Create particle system
   */
  private createParticles(): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    const count = this.config.particles.count;
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorPalette = [
      new THREE.Color(this.config.colors.accentA),
      new THREE.Color(this.config.colors.accentB),
      new THREE.Color(this.config.colors.base)
    ];

    for (let i = 0; i < count * 3; i += 3) {
      // Random positions in a large cube
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
      
      // Random colors from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: this.config.particles.size,
      vertexColors: true,
      transparent: true,
      opacity: this.config.particles.opacity,
      sizeAttenuation: true
    });

    return new THREE.Points(geometry, material);
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
   * Smoothstep interpolation
   */
  private smoothstep(min: number, max: number, value: number): number {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
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

    // Update shader uniforms
    this.material.uniforms.uTime.value = timeS;
    this.material.uniforms.uScroll.value = this.scrollCurrent;
    this.material.uniforms.uAudio.value = THREE.MathUtils.lerp(
      this.material.uniforms.uAudio.value,
      audio01,
      0.1
    );

    // Mesh movement based on scroll path
    const pathX = Math.cos(this.scrollCurrent * Math.PI * 1.5) * 2.5;
    this.mesh.position.x = pathX + (this.mouseCurrent.x * 0.5);
    this.mesh.position.y = this.mouseCurrent.y * 0.5;

    // Mesh rotation
    this.mesh.rotation.y = timeS * 0.1 + (this.scrollCurrent * Math.PI);
    this.mesh.rotation.x = this.mouseCurrent.y * 0.5;

    // Mesh scale based on scroll (grows at the end)
    const scale = 1 + this.smoothstep(0.8, 1.0, this.scrollCurrent) * 0.5;
    this.mesh.scale.set(scale, scale, scale);

    // Particle rotation and vertical movement
    if (!this.config.performance.reduceMotion) {
      this.particles.rotation.y = timeS * 0.02 + this.scrollCurrent * 0.2;
      this.particles.position.y = this.scrollCurrent * 5;
    }
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

    // Dispose geometries
    if (this.mesh.geometry) {
      this.mesh.geometry.dispose();
    }
    if (this.particles.geometry) {
      this.particles.geometry.dispose();
    }

    // Dispose materials
    if (this.mesh.material) {
      (this.mesh.material as THREE.Material).dispose();
    }
    if (this.particles.material) {
      (this.particles.material as THREE.Material).dispose();
    }

    // Remove from scene
    this.scene.remove(this.mesh);
    this.scene.remove(this.particles);

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
