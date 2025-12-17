# Parallax Multi-Layer Image Guide

## Overview
This guide explains how to create and layer images for the multi-layer parallax effect in the portfolio, similar to the Shopify Winter 2026 presentation style.

## Image Preparation Process

### Step 1: Separate Your Image into Layers

Using **Photoshop** or **GIMP**, separate your source image into distinct depth layers:

1. **Background Layer** (Layer 0)
   - Contains elements that should appear farther away
   - Example: windows, walls, distant objects, scenery
   - Slower parallax movement (0.3 - 0.5 speed)

2. **Foreground Layer** (Layer 1+)
   - Contains main subject and closer elements
   - Example: person, furniture, close objects
   - Faster parallax movement (1.0 - 1.5 speed)

### Step 2: Export with Transparency

**Critical Requirements:**
- ✅ Export as **PNG** format (supports transparency)
- ✅ Ensure **alpha channel** is preserved
- ✅ Keep transparent areas truly transparent (not white/black fill)
- ✅ Use same canvas dimensions for all layers
- ✅ Maintain alignment between layers

**Export Settings:**
- Format: PNG-24 or PNG-32
- Color Mode: RGBA (not RGB)
- Transparency: Enabled
- Background: Transparent (not white)

### Step 3: Example - "Headphones Girl" Image

For the current portfolio image, we separated it into:

**Layer 0 - Background (`headphones-girl-bg.png`):**
- Window frame and exterior view
- Wall sections
- Background environmental elements
- Parallax speed: 0.4 (slower = appears farther)
- Z-position: -0.5 (behind)

**Layer 1 - Foreground (`headphones-girl-fg.png`):**
- Girl with headphones (main subject)
- Chair and immediate furniture
- Close objects
- Parallax speed: 1.0 (faster = appears closer)
- Z-position: 0.0 (front)

## Configuration in Code

### Adding Layers to `config.ts`

```typescript
texture: {
  layers: [
    {
      path: '/img/your-background.png',  // Background layer
      parallaxSpeed: 0.4,  // Moves slower (0.0 - 1.0)
      zPosition: -0.5,     // Behind other layers
      disableDistortion: true  // Clean rendering
    },
    {
      path: '/img/your-foreground.png',  // Foreground layer
      parallaxSpeed: 1.0,  // Moves at normal speed
      zPosition: 0.0,      // In front
      disableDistortion: true
    },
    // Add more layers as needed...
  ],
  aspectRatio: 16 / 9,
  width: 6.0,
  height: 3.375
}
```

### Parallax Speed Guidelines

- **0.0 - 0.3**: Very far background (sky, distant scenery)
- **0.4 - 0.6**: Mid-background (walls, windows, background objects)
- **0.7 - 0.9**: Near-background (furniture, secondary elements)
- **1.0 - 1.3**: Foreground (main subject)
- **1.4 - 2.0**: Extreme foreground (very close objects)

### Z-Position Guidelines

- **-1.0 to -0.5**: Far background layers
- **-0.4 to -0.1**: Mid-background layers
- **0.0**: Main focal plane
- **0.1 to 0.5**: Near foreground layers
- **0.6 to 1.0**: Extreme foreground (rarely used)

## Best Practices

### Image Quality
- ✅ Use high-resolution source images (at least 2000px wide)
- ✅ Maintain consistent lighting across layers
- ✅ Match color grading between layers
- ✅ Clean edges around transparent areas (no halos)

### Layer Design
- ✅ 2-3 layers is usually optimal for performance
- ✅ More layers = more depth but slower performance
- ✅ Ensure visual continuity between layers
- ✅ Test on various screen sizes

### Performance
- ✅ Optimize PNG file sizes (use tools like TinyPNG)
- ✅ Keep individual images under 500KB when possible
- ✅ Consider WebP format for better compression
- ✅ Use appropriate canvas dimensions (not excessive)

## Photoshop Layer Separation Tutorial

### Method 1: Manual Selection
1. Open your image in Photoshop
2. Use **Select > Subject** or **Magic Wand** to select foreground
3. **Layer via Copy** (Ctrl+J / Cmd+J) to create new layer
4. Hide original layer
5. Select background elements on original layer
6. **Layer via Copy** again
7. Delete original layer, keep separated layers
8. Export each layer separately as PNG

### Method 2: Layer Masks
1. Duplicate your base layer twice
2. Add **Layer Mask** to top layer
3. Paint black on mask to hide background elements
4. On bottom layer, paint black on mask to hide foreground
5. Export each layer with transparency

### Method 3: Using Channels (Advanced)
1. Create selection using **Channels** panel
2. Use **Refine Edge** for complex selections
3. Apply mask and separate layers
4. Export with alpha channel preserved

## Common Issues & Solutions

### Issue: Black Background Instead of Transparent
**Solution:** 
- Ensure alpha channel is in shader: `gl_FragColor = vec4(color, alpha);`
- Enable transparency in material: `transparent: true`
- Use `THREE.RGBAFormat` for texture format

### Issue: Layers Not Visible
**Solution:**
- Check z-positions don't overlap exactly
- Verify `depthWrite: false` in material
- Ensure `blending: THREE.NormalBlending`
- Check file paths are correct

### Issue: White Halos Around Edges
**Solution:**
- Use "Defringe" in Photoshop (Layer > Matting > Defringe)
- Refine selection edges before separating
- Use proper alpha channel export settings

### Issue: Layers Move in Sync
**Solution:**
- Check `parallaxSpeed` values are different per layer
- Ensure layer-specific speed is being applied in update loop
- Verify different z-positions are set

## File Naming Convention

Recommended structure:
```
/public/img/
  ├── project-name-bg.png      (Background layer)
  ├── project-name-mid.png     (Mid layer, if needed)
  └── project-name-fg.png      (Foreground layer)
```

## Testing Checklist

- [ ] All layers load without errors (check console)
- [ ] Transparency is preserved (no black/white backgrounds)
- [ ] Layers move at different speeds on scroll
- [ ] Layers move at different speeds on mouse movement
- [ ] No z-fighting or flickering
- [ ] Performance is smooth (60fps target)
- [ ] Looks good on different screen sizes
- [ ] File sizes are optimized

## Advanced: Creating Depth Maps

For even more sophisticated effects, you can create depth maps:

1. Create grayscale version where white = closest, black = farthest
2. Use depth map to control parallax intensity per pixel
3. Implement in shader for ultra-smooth parallax

This is advanced and not currently implemented but possible for future enhancement.

---

**Last Updated:** 2025-12-17  
**Related Files:** 
- `portfolio/features/portfolioScene/webgl/config.ts`
- `portfolio/features/portfolioScene/webgl/SceneManager.ts`
- `portfolio/features/portfolioScene/webgl/shaders.ts`
