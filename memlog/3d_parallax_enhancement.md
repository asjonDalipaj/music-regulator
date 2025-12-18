# 3D Parallax Enhancement - Shopify Winter 2026 Style

## Date: 18/12/2025

## Overview
Enhanced the parallax system to create a dramatic 3D depth effect inspired by Shopify Editions Winter 2026.

## Changes Implemented

### 1. Configuration Updates (`config.ts`)
- **Added new TextureLayer properties:**
  - `rotationIntensity` (0.0-1.0): Controls 3D tilt rotation amount
  - `blurAmount` (0.0-1.0): Depth-based blur for atmospheric perspective
  - `edgeFade` (0.0-1.0): Soft edge vignette to fix pixelation

- **Layer Configuration Changes:**
  - **Background Layer:**
    - `parallaxSpeed: 1.5` (INVERSE - moves MORE for dramatic depth)
    - `rotationIntensity: 0.8` (strong 3D tilt)
    - `blurAmount: 0.3` (depth-of-field blur)
    - `edgeFade: 0.0` (no edge fade)
  
  - **Foreground Layer:**
    - `parallaxSpeed: 0.5` (moves LESS - closer objects)
    - `rotationIntensity: 0.3` (subtle rotation)
    - `blurAmount: 0.0` (sharp/clear)
    - `edgeFade: 0.2` (soft edge fade to fix pixelation)

### 2. Shader Enhancements (`shaders.ts`)

#### Fragment Shader Additions:
- **Depth-Based Gaussian Blur:**
  - 9-tap Gaussian kernel for background layer
  - Optimized for performance
  - Applied conditionally based on `uBlurAmount`

- **Edge Fade/Soft Vignette:**
  - Radial distance calculation from center
  - Smooth alpha gradient at edges
  - Fixes foreground pixelation issue

- **New Uniforms:**
  - `uBlurAmount`: Controls blur intensity per layer
  - `uEdgeFade`: Controls edge fade intensity per layer

### 3. Scene Manager Updates (`SceneManager.ts`)

#### New 3D Parallax Features:
- **Vertical Mouse Parallax (Y-axis):**
  - Mouse Y position now affects layer Y position
  - Different intensities per layer based on `parallaxSpeed`
  - Creates true multi-axis depth

- **3D Rotation/Tilt (Card Effect):**
  - Layers rotate on X and Y axes based on mouse position
  - Intensity controlled by `rotationIntensity` per layer
  - Smooth spring-like motion (0.08 lerp speed)
  - Background rotates MORE than foreground

- **Dynamic Scale Variation:**
  - Layers subtly scale based on mouse distance from center
  - Creates depth enhancement effect
  - Smooth interpolation

- **Enhanced Physics:**
  - Mouse movement: Faster lerp speed (0.12) for snappy response
  - Rotation: Spring-like smoothing (0.08 lerp)
  - Scale: Smooth interpolation (0.08 lerp)
  - Added `easeOutElastic()` function for future use

#### Parallax Improvements:
- **Horizontal parallax:** 3x increase in movement range (1.0 multiplier)
- **Vertical mouse parallax:** Added Y-axis mouse tracking
- **Inverse parallax:** Background moves MORE than foreground
- **Combined scroll + mouse:** Layers respond to both scroll and mouse

## Visual Results

✅ **Dramatic 3D Depth:** Background moves opposite to foreground creating strong parallax illusion
✅ **Smooth Edges:** Foreground fades naturally at edges (fixes pixelation)
✅ **3D Rotation:** Layers tilt and rotate following mouse like floating cards
✅ **Depth of Field:** Background slightly blurred, foreground sharp
✅ **Responsive Motion:** Snappier mouse tracking with spring physics
✅ **Atmospheric Depth:** Subtle depth cues through blur and scale

## Performance Optimizations
- Conditional blur rendering (only applied when `blurAmount > 0.01`)
- Optimized 9-tap Gaussian kernel (balanced quality/performance)
- Smooth lerp speeds to prevent jitter
- Efficient shader branching

## User Requirements Met
1. ✅ No additional image layers (works with existing 2 layers)
2. ✅ Dramatic 3D effect (inverse parallax + rotation)
3. ✅ No gyroscope support (desktop/mouse only)
4. ✅ Edge fading for foreground (fixes pixelation)

## Technical Details

### Parallax Speed Logic:
- **Background (distant):** Higher parallaxSpeed = moves MORE (inverse)
- **Foreground (close):** Lower parallaxSpeed = moves LESS
- This creates correct depth perception

### Rotation Intensity Logic:
- **Background:** Higher rotationIntensity = rotates MORE
- **Foreground:** Lower rotationIntensity = rotates LESS
- Prevents foreground from over-rotating

### Shader Performance:
- Blur: ~9 texture samples (only for background)
- Edge fade: Single distance calculation
- Total overhead: Minimal, GPU-friendly

## Files Modified
1. `portfolio/features/portfolioScene/webgl/config.ts`
2. `portfolio/features/portfolioScene/webgl/shaders.ts`
3. `portfolio/features/portfolioScene/webgl/SceneManager.ts`

## Next Steps (Optional Future Enhancements)
- [ ] Fine-tune rotation/scale intensities based on user feedback
- [ ] Add boundary constraints to prevent extreme rotations
- [ ] Implement momentum/overshoot physics
- [ ] Add mobile optimizations (reduce effects on low-power devices)
- [ ] Consider adding atmospheric fog shader for extreme depth
