import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// --- STYLES (Embedded to ensure single-file portability) ---
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');

:root {
    --bg-color: #050505;
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
    --accent-glow: #ffcc00;
    --accent-hot: #ff2a6d;
    --glass-bg: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(255, 255, 255, 0.08);
    --font-main: 'Inter', sans-serif;
}

.portfolio-wrapper {
    background-color: var(--bg-color);
    color: var(--text-primary);
    font-family: var(--font-main);
    overflow-x: hidden;
    width: 100%;
    min-height: 100vh;
    position: relative;
}

#canvas-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 0;
}

.ui-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    mix-blend-mode: difference;
}

.logo { font-weight: 800; letter-spacing: -1px; font-size: 1.2rem; }

.sound-toggle { 
    pointer-events: auto; 
    cursor: pointer; 
    font-size: 0.8rem;
    font-weight: 600;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 20px;
    padding: 0.5rem 1.2rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
}

main { position: relative; z-index: 1; width: 100%; }

section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 10%;
    position: relative;
    pointer-events: none;
}

section > * { pointer-events: auto; }

h1 { 
    font-size: clamp(3.5rem, 9vw, 7rem); 
    margin-bottom: 1.5rem; 
    background: linear-gradient(135deg, #fff 0%, #ffcc00 50%, #ff2a6d 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
}

h2 { font-size: clamp(2rem, 5vw, 4rem); color: var(--text-primary); margin-bottom: 2rem; font-weight: 800; }
p { font-size: 1.1rem; line-height: 1.7; max-width: 550px; color: var(--text-secondary); margin-bottom: 2rem; }

.layout-left { align-items: flex-start; text-align: left; }
.layout-right { align-items: flex-end; text-align: right; }
.layout-center { align-items: center; text-align: center; }

.project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
    margin-top: 3rem;
}

.card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    padding: 2.5rem;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    cursor: pointer;
    text-align: left;
}

.card:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: var(--accent-glow);
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.card h3 { font-size: 1.5rem; margin-bottom: 1rem; color: var(--text-primary); }

.card .tech-stack { 
    font-size: 0.75rem; 
    font-weight: 600;
    color: var(--accent-glow); 
    text-transform: uppercase; 
    letter-spacing: 1px;
    margin-top: 1.5rem; 
    display: inline-block;
    background: rgba(255, 204, 0, 0.1);
    padding: 4px 12px;
    border-radius: 20px;
}

.highlight { color: var(--accent-glow); }
.contact-link { font-size: 1.5rem; text-decoration: none; border-bottom: 2px solid var(--accent-glow); }

#loader {
    position: fixed;
    inset: 0;
    background: var(--bg-color);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
}

.loader-bar {
    width: 200px;
    height: 2px;
    background: rgba(255,255,255,0.1);
    position: relative;
    overflow: hidden;
}

.loader-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 50%;
    background: var(--accent-glow);
    animation: load 1.5s infinite ease-in-out;
}

@keyframes load { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
`;

// --- SHADERS & CONFIG ---
const CONFIG = {
    colors: {
        bg: '#050505',
        accentA: '#ff2a6d',  // Electric Red/Pink
        accentB: '#ffcc00',  // Bright Yellow
        base: '#05d9e8'      // Vibrant Cyan/Blue
    },
    camera: { fov: 40, z: 7 }
};

const vertexShader = `
    uniform float uTime;
    uniform float uScroll;
    uniform float uAudio;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vDisplace;

    // Simplex Noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 0.142857142857; 
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z); 
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ ); 
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
        vUv = uv;
        vNormal = normal;
        float noise = snoise(vec3(position.x * 1.2, position.y * 1.2, uTime * 0.3));
        float noise2 = snoise(vec3(position.x * 2.0 + uTime, position.y * 2.0, uTime * 0.5));
        float displacement = noise * (0.3 + uScroll * 0.2 + uAudio * 1.0) + noise2 * 0.1;
        vDisplace = displacement;
        vec3 newPos = position + normal * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
`;

const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uBaseColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vDisplace;

    void main() {
        vec3 viewDir = normalize(cameraPosition - vNormal); 
        float fresnel = dot(viewDir, vNormal);
        fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
        fresnel = pow(fresnel, 2.0);
        vec3 color = mix(uBaseColor, uColorA, vDisplace * 2.0 + 0.5);
        color = mix(color, uColorB, fresnel);
        float specular = step(0.9, fresnel);
        gl_FragColor = vec4(color + specular * 0.2, 1.0);
    }
`;

// --- AUDIO MANAGER CLASS ---
class AudioManager {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.oscillators = [];
        this.gainNodes = [];
        this.analyser = null;
        this.dataArray = null;
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.8;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }

    play() {
        if (!this.ctx) this.init();
        this.ctx.resume();
        const freqs = [87.31, 130.81, 174.61, 261.63]; // F2, C3, F3, C4
        
        freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(f, this.ctx.currentTime);
            osc.detune.value = (Math.random() - 0.5) * 10;

            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 2);

            osc.connect(gain);
            gain.connect(this.analyser);
            this.analyser.connect(this.ctx.destination);
            osc.start();
            this.oscillators.push(osc);
            this.gainNodes.push(gain);
        });
        this.isPlaying = true;
    }

    stop() {
        if(this.ctx) {
            this.gainNodes.forEach(g => g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1));
            setTimeout(() => {
                this.oscillators.forEach(o => o.stop());
                this.oscillators = [];
            }, 1000);
            this.isPlaying = false;
        }
    }

    getFrequencyData() {
        if (this.analyser) {
            this.analyser.getByteFrequencyData(this.dataArray);
            let sum = 0;
            for(let i = 0; i < this.dataArray.length; i++) sum += this.dataArray[i];
            return sum / (this.dataArray.length * 255);
        }
        return 0;
    }
}

// --- MAIN REACT COMPONENT ---
export default function PortfolioScene() {
    const mountRef = useRef(null);
    const audioManagerRef = useRef(new AudioManager());
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [loading, setLoading] = useState(true);

    const toggleAudio = () => {
        if (isAudioPlaying) {
            audioManagerRef.current.stop();
        } else {
            audioManagerRef.current.play();
        }
        setIsAudioPlaying(!isAudioPlaying);
    };

    // Inject Styles on Mount
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    useEffect(() => {
        // --- SCENE MANAGER LOGIC ---
        const container = mountRef.current;
        if (!container) return;

        let width = container.clientWidth;
        let height = container.clientHeight;
        let animationFrameId;

        // 1. Setup
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(CONFIG.colors.bg, 0.05);

        const camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, width / height, 0.1, 100);
        camera.position.z = CONFIG.camera.z;

        // 2. Objects
        // Fluid Entity
        const geometry = new THREE.IcosahedronGeometry(1.5, 120);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uScroll: { value: 0 },
                uAudio: { value: 0 },
                uColorA: { value: new THREE.Color(CONFIG.colors.accentA) },
                uColorB: { value: new THREE.Color(CONFIG.colors.accentB) },
                uBaseColor: { value: new THREE.Color(CONFIG.colors.base) }
            },
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 2;
        scene.add(mesh);

        // Particles
        const particlesGeom = new THREE.BufferGeometry();
        const count = 1000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const colorPalette = [
            new THREE.Color(CONFIG.colors.accentA),
            new THREE.Color(CONFIG.colors.accentB),
            new THREE.Color(CONFIG.colors.base)
        ];

        for(let i=0; i<count*3; i+=3) {
            positions[i] = (Math.random() - 0.5) * 20; 
            positions[i+1] = (Math.random() - 0.5) * 20; 
            positions[i+2] = (Math.random() - 0.5) * 20; 
            const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i] = c.r;
            colors[i+1] = c.g;
            colors[i+2] = c.b;
        }
        particlesGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const particlesMat = new THREE.PointsMaterial({
            size: 0.04,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });
        const particles = new THREE.Points(particlesGeom, particlesMat);
        scene.add(particles);

        // 3. Interaction State
        let scrollPos = 0;
        let targetScroll = 0;
        let mouse = new THREE.Vector2();
        let targetMouse = new THREE.Vector2();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        const handleScroll = () => {
            const bodyH = document.body.scrollHeight - window.innerHeight;
            // Prevent division by zero
            targetScroll = bodyH > 0 ? window.scrollY / bodyH : 0;
        };

        const handleMouseMove = (e) => {
            targetMouse.x = (e.clientX / width) * 2 - 1;
            targetMouse.y = -(e.clientY / height) * 2 + 1;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        // Helper
        function smoothstep(min, max, value) {
            var x = Math.max(0, Math.min(1, (value-min)/(max-min)));
            return x*x*(3 - 2*x);
        }

        // 4. Animation Loop
        const animate = () => {
            const time = performance.now() * 0.001;

            // Smooth Lerps
            scrollPos = THREE.MathUtils.lerp(scrollPos, targetScroll, 0.05);
            mouse.x = THREE.MathUtils.lerp(mouse.x, targetMouse.x, 0.05);
            mouse.y = THREE.MathUtils.lerp(mouse.y, targetMouse.y, 0.05);

            // Shader Updates
            material.uniforms.uTime.value = time;
            material.uniforms.uScroll.value = scrollPos;

            // Audio Updates
            if (audioManagerRef.current.isPlaying) {
                const freq = audioManagerRef.current.getFrequencyData();
                material.uniforms.uAudio.value = THREE.MathUtils.lerp(
                    material.uniforms.uAudio.value,
                    freq,
                    0.1
                );
            }

            // Path Logic
            let targetX = 2;
            if(scrollPos > 0.6) targetX = 0;
            else if(scrollPos > 0.2) targetX = -2 + (scrollPos - 0.2) * 5;
            
            const pathX = Math.cos(scrollPos * Math.PI * 1.5) * 2.5; 
            mesh.position.x = pathX + (mouse.x * 0.5); 
            mesh.position.y = (mouse.y * 0.5);

            mesh.rotation.y = time * 0.1 + (scrollPos * Math.PI);
            mesh.rotation.x = mouse.y * 0.5;
            
            const scale = 1 + smoothstep(0.8, 1.0, scrollPos) * 0.5;
            mesh.scale.set(scale, scale, scale);

            particles.rotation.y = time * 0.02 + scrollPos * 0.2;
            particles.position.y = scrollPos * 5;

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        // Start
        animate();
        setLoading(false);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            if (container && renderer.domElement) container.removeChild(renderer.domElement);
            // Also stop audio if component unmounts
            audioManagerRef.current.stop(); 
        };
    }, []);

    return (
        <div className="portfolio-wrapper">
            {loading && (
                <div id="loader">
                    <div className="loader-bar"></div>
                </div>
            )}

            <div ref={mountRef} id="canvas-container" />

            <div className="ui-layer">
                <div className="logo">DEV.PORTFOLIO</div>
                <div 
                    className="sound-toggle" 
                    onClick={toggleAudio}
                    style={{
                        background: isAudioPlaying ? CONFIG.colors.accentA : 'transparent',
                        borderColor: isAudioPlaying ? CONFIG.colors.accentA : 'rgba(255,255,255,0.3)',
                        color: isAudioPlaying ? '#fff' : '#fff'
                    }}
                >
                    {isAudioPlaying ? 'Disable Audio' : 'Enable Audio'}
                </div>
            </div>

            <main>
                <section className="layout-left">
                    <h1>Building <br /> <span className="highlight">Electric</span> Dreams</h1>
                    <p>Full-Stack Engineer crafting fluid, high-performance web interfaces. Architecture that scales, interactions that explode with energy.</p>
                </section>

                <section className="layout-right">
                    <h2>Vibrant Logic</h2>
                    <p>Modern software should be adaptable, not rigid. My approach combines robust backend architecture with reactive, WebGL-powered frontends.</p>
                    <p>Inspired by the seamless state management of modern commerce engines.</p>
                </section>

                <section className="layout-center">
                    <h2>Select Projects</h2>
                    <div className="project-grid">
                        <div className="card">
                            <h3>Pulse Analytics</h3>
                            <p>Real-time data visualization platform processing 10k events/sec with zero latency.</p>
                            <span className="tech-stack">React / Rust / WebSockets</span>
                        </div>
                        <div className="card">
                            <h3>Sidekick AI</h3>
                            <p>Context-aware coding assistant integration using LLMs and vector embeddings.</p>
                            <span className="tech-stack">Python / OpenAI / Vector DB</span>
                        </div>
                        <div className="card">
                            <h3>Flow Commerce</h3>
                            <p>3D product configurator with liquid metal shaders for luxury brands.</p>
                            <span className="tech-stack">Three.js / WebGL / Shopify</span>
                        </div>
                    </div>
                </section>

                <section className="layout-left">
                    <h2>Connect</h2>
                    <p>Open for technical leadership roles and creative technology commissions.</p>
                    <a href="mailto:hello@example.com" className="highlight contact-link">hello@example.com</a>
                </section>
            </main>
        </div>
    );
}