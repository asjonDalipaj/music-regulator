/**
 * Starfield Shader - Dramatic Universe Background
 * Dense, colorful procedural starfield with shooting stars
 */

export const starfieldVertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

export const starfieldFragmentShader = `
    uniform float uTime;
    uniform float uScroll;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform float uAudio;
    
    varying vec2 vUv;
    varying vec3 vPosition;

    // Hash function for pseudo-random values
    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    // 2D Noise
    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Fractal Brownian Motion for nebula clouds
    float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for(int i = 0; i < 5; i++) {
            value += amplitude * noise(p * frequency);
            frequency *= 2.0;
            amplitude *= 0.5;
        }
        
        return value;
    }

    // Generate star layers with different sizes and densities
    float starLayer(vec2 uv, float scale, float seed, float twinkleSpeed) {
        vec2 grid = uv * scale;
        vec2 gridId = floor(grid);
        vec2 gridUv = fract(grid);
        
        float stars = 0.0;
        
        // Check 3x3 grid for stars (prevents edge artifacts)
        for(float y = -1.0; y <= 1.0; y++) {
            for(float x = -1.0; x <= 1.0; x++) {
                vec2 offset = vec2(x, y);
                vec2 cellId = gridId + offset;
                
                // Random star position within cell
                float starHash = hash(cellId + seed);
                
                // Only spawn stars in ~70% of cells (denser starfield)
                if(starHash > 0.3) {
                    vec2 starPos = vec2(
                        hash(cellId + seed + 10.0),
                        hash(cellId + seed + 20.0)
                    );
                    
                    vec2 toStar = gridUv - offset - starPos;
                    float dist = length(toStar);
                    
                    // Larger star sizes for better visibility
                    float starSize = hash(cellId + seed + 30.0) * 0.008 + 0.003;
                    
                    // Twinkle effect (more pronounced)
                    float twinkle = 0.8 + 0.2 * sin(uTime * twinkleSpeed + starHash * 100.0);
                    
                    // Star brightness with enhanced glow
                    float brightness = smoothstep(starSize * 1.5, 0.0, dist) * twinkle;
                    stars += brightness * 1.5; // Increased brightness multiplier
                }
            }
        }
        
        return stars;
    }

    // Shooting star effect
    float shootingStar(vec2 uv, float time) {
        float shootingStars = 0.0;
        
        // Create 3 shooting stars at different intervals
        for(float i = 0.0; i < 3.0; i++) {
            float offset = i * 37.5; // Spread out timing
            float shootTime = mod(time * 0.15 + offset, 100.0);
            
            // Only visible for brief period
            if(shootTime < 3.0) {
                float t = shootTime / 3.0;
                
                // Random trajectory
                float angleHash = hash(vec2(floor(time * 0.15 + offset), i));
                float angle = angleHash * 6.28318;
                vec2 direction = vec2(cos(angle), sin(angle));
                
                // Random start position
                vec2 startPos = vec2(
                    hash(vec2(floor(time * 0.15 + offset), i + 10.0)),
                    hash(vec2(floor(time * 0.15 + offset), i + 20.0))
                );
                
                // Trail position
                vec2 trailPos = startPos + direction * t * 0.8;
                
                // Distance to trail
                vec2 toTrail = uv - trailPos;
                float projDist = abs(dot(toTrail, vec2(-direction.y, direction.x)));
                float alongTrail = dot(toTrail, direction);
                
                // Create elongated trail
                if(alongTrail < 0.0 && alongTrail > -0.3) {
                    float trailIntensity = smoothstep(0.003, 0.0, projDist) * 
                                          (1.0 - abs(alongTrail) / 0.3) * 
                                          (1.0 - t);
                    shootingStars += trailIntensity;
                }
            }
        }
        
        return shootingStars;
    }

    // Star color variation
    vec3 getStarColor(float intensity, vec2 uv) {
        float colorHash = hash(uv * 100.0);
        vec3 color;
        
        if(colorHash < 0.3) {
            // Blue-white stars
            color = vec3(0.7, 0.85, 1.0);
        } else if(colorHash < 0.6) {
            // Pure white stars
            color = vec3(1.0, 1.0, 1.0);
        } else if(colorHash < 0.8) {
            // Warm yellow-white stars
            color = vec3(1.0, 0.95, 0.8);
        } else {
            // Colorful dramatic stars (cyan, pink, purple)
            float hue = hash(uv * 200.0);
            if(hue < 0.33) {
                color = vec3(0.4, 0.9, 1.0); // Cyan
            } else if(hue < 0.66) {
                color = vec3(1.0, 0.3, 0.7); // Pink
            } else {
                color = vec3(0.8, 0.4, 1.0); // Purple
            }
        }
        
        return color * intensity;
    }

    void main() {
        vec2 uv = vUv;
        
        // Add subtle parallax based on mouse movement
        vec2 parallaxUv = uv + uMouse * 0.02;
        
        // === PURE BLACK BACKGROUND ===
        // Remove nebula colors for pure black space
        vec3 nebula = vec3(0.0, 0.0, 0.0);
        
        // Optional: Add very subtle audio-reactive glow (much dimmer than before)
        float audioGlow = uAudio * 0.05; // Reduced from 0.4 to 0.05
        vec3 glowColor = mix(
            vec3(0.4, 0.9, 1.0),  // Cyan
            vec3(1.0, 0.3, 0.7),  // Pink
            sin(uTime * 2.0) * 0.5 + 0.5
        );
        
        // Add very subtle pulsing glow on audio peaks (optional, barely visible)
        float glowPattern = fbm(parallaxUv * 3.0 + uTime * 0.5);
        vec3 audioGlowLayer = glowColor * glowPattern * audioGlow;
        
        nebula += audioGlowLayer;
        
        // === AUDIO-REACTIVE STAR LAYERS ===
        // Stars twinkle faster with audio
        float audioTwinkleSpeed = 1.0 + uAudio * 3.0;
        
        // Large bright stars
        float starsLarge = starLayer(parallaxUv, 15.0, 1.0, 1.5 * audioTwinkleSpeed);
        
        // Medium stars (most dense layer)
        float starsMedium = starLayer(parallaxUv, 40.0, 2.0, 2.0 * audioTwinkleSpeed);
        
        // Small distant stars
        float starsSmall = starLayer(parallaxUv, 80.0, 3.0, 2.5 * audioTwinkleSpeed);
        
        // Tiny background stars (add depth)
        float starsTiny = starLayer(parallaxUv, 150.0, 4.0, 3.0 * audioTwinkleSpeed);
        
        // Audio-reactive star brightness boost
        float starBrightness = 1.0 + uAudio * 0.5;
        
        // === SHOOTING STARS ===
        float shooting = shootingStar(parallaxUv, uTime);
        
        // === COMBINE ALL ELEMENTS ===
        vec3 finalColor = nebula;
        
        // Add star layers with colors and audio-reactive brightness
        finalColor += getStarColor(starsLarge, parallaxUv * 15.0) * 1.2 * starBrightness;
        finalColor += getStarColor(starsMedium, parallaxUv * 40.0) * 0.8 * starBrightness;
        finalColor += getStarColor(starsSmall, parallaxUv * 80.0) * 0.5 * starBrightness;
        finalColor += getStarColor(starsTiny, parallaxUv * 150.0) * 0.3 * starBrightness;
        
        // Shooting stars (bright white-blue)
        finalColor += vec3(0.8, 0.9, 1.0) * shooting * 1.5;
        
        // Reduced vignette for better star visibility
        float vignette = smoothstep(1.5, 0.2, length(uv - 0.5));
        finalColor *= 0.85 + 0.15 * vignette;
        
        // Subtle color grading for cinematic feel
        finalColor = pow(finalColor, vec3(0.95)); // Slight contrast boost
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;
