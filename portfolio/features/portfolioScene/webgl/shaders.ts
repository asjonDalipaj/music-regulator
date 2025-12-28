/**
 * GLSL Shaders for Portfolio Scene V2
 * Texture-based shaders with elegant distortion effects
 * Shopify-inspired cinematic experience
 */

export const vertexShader = `
    uniform float uTime;
    uniform float uScroll;
    uniform float uAudio;
    
    varying vec2 vUv;
    varying vec3 vPosition;

    // Simple noise for subtle wave displacement
    float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
        vUv = uv;
        vPosition = position;
        
        // Subtle wave displacement on the plane
        float wave = sin(position.x * 2.0 + uTime * 0.5) * 
                     cos(position.y * 2.0 + uTime * 0.3);
        float displacement = wave * (0.02 + uAudio * 0.05);
        
        vec3 newPos = position;
        newPos.z += displacement;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
`;

export const fragmentShader = `
    uniform float uTime;
    uniform float uScroll;
    uniform float uAudio;
    uniform float uScrollVelocity;
    uniform sampler2D uTexture;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    
    // Effect parameters
    uniform float uChromaticAberration;
    uniform float uUVDistortion;
    uniform float uBlurAmount;
    uniform float uEdgeFade;
    
    varying vec2 vUv;
    varying vec3 vPosition;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    void main() {
        vec2 uv = vUv;
        
        // === DEPTH-BASED BLUR (Gaussian) ===
        vec3 color;
        float alpha;
        
        if (uBlurAmount > 0.01) {
            // Multi-sample Gaussian blur for background depth
            vec3 blurredColor = vec3(0.0);
            float totalAlpha = 0.0;
            float blurRadius = uBlurAmount * 0.003; // Blur radius
            
            // 9-tap Gaussian kernel (optimized for performance)
            blurredColor += texture2D(uTexture, uv + vec2(-blurRadius, -blurRadius)).rgb * 0.075;
            blurredColor += texture2D(uTexture, uv + vec2(0.0, -blurRadius)).rgb * 0.124;
            blurredColor += texture2D(uTexture, uv + vec2(blurRadius, -blurRadius)).rgb * 0.075;
            
            blurredColor += texture2D(uTexture, uv + vec2(-blurRadius, 0.0)).rgb * 0.124;
            vec4 centerSample = texture2D(uTexture, uv);
            blurredColor += centerSample.rgb * 0.204;
            blurredColor += texture2D(uTexture, uv + vec2(blurRadius, 0.0)).rgb * 0.124;
            
            blurredColor += texture2D(uTexture, uv + vec2(-blurRadius, blurRadius)).rgb * 0.075;
            blurredColor += texture2D(uTexture, uv + vec2(0.0, blurRadius)).rgb * 0.124;
            blurredColor += texture2D(uTexture, uv + vec2(blurRadius, blurRadius)).rgb * 0.075;
            
            color = blurredColor;
            alpha = centerSample.a;
        } else {
            // No distortion or chromatic aberration - clean rendering
            vec4 texSample = texture2D(uTexture, uv);
            color = texSample.rgb;
            alpha = texSample.a;
        }
        
        // === EDGE FADE / SOFT VIGNETTE ===
        if (uEdgeFade > 0.01) {
            // Multi-directional edge fade for smoother pixelation removal
            vec2 edgeDist = abs(vUv - 0.5) * 2.0;
            
            // Horizontal edge fade
            float horizontalFade = 1.0 - smoothstep(1.0 - uEdgeFade, 1.0, edgeDist.x);
            
            // Vertical edge fade
            float verticalFade = 1.0 - smoothstep(1.0 - uEdgeFade, 1.0, edgeDist.y);
            
            // Radial fade from center
            float distFromCenter = length(vUv - 0.5) * 2.0;
            float radialFade = 1.0 - smoothstep(1.0 - uEdgeFade * 0.8, 1.0, distFromCenter);
            
            // Combine all fades with weighted average for ultra-smooth edges
            float edgeMask = (horizontalFade * 0.4 + verticalFade * 0.4 + radialFade * 0.2);
            
            // Apply smooth fade curve for anti-aliasing effect
            edgeMask = smoothstep(0.0, 1.0, edgeMask);
            
            alpha *= edgeMask;
        }
        
        // Subtle vignette for cinematic feel
        vec2 vignetteUV = vUv * (1.0 - vUv.yx);
        float vignette = vignetteUV.x * vignetteUV.y * 15.0;
        vignette = pow(vignette, 0.3);
        
        color *= vignette;
        
        // Subtle color accent on edges based on audio
        float edgeFactor = 1.0 - vignette;
        vec3 accentColor = mix(uColorA, uColorB, sin(uTime * 0.5) * 0.5 + 0.5);
        color += accentColor * edgeFactor * uAudio * 0.1;
        
        gl_FragColor = vec4(color, alpha);
    }
`;
