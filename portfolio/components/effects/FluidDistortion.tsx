"use client";

import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { Fluid } from '@whatisjery/react-fluid-distortion';
import { BlendFunction } from 'postprocessing';

interface FluidDistortionProps {
  intensity?: number;
  colors?: string[];
}

export default function FluidDistortion({ 
  intensity = 2,
  colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA']
}: FluidDistortionProps) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-50">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        style={{ background: 'transparent', pointerEvents: 'auto' }}
      >
        <EffectComposer>
          <Fluid
            fluidColor="#3300ff"
            backgroundColor="#070410"
            showBackground={false}
            blend={5}
            intensity={intensity}
            force={1.1}
            distortion={0.4}
            curl={1.9}
            radius={0.3}
            swirl={4}
            densityDissipation={0.96}
            velocityDissipation={1.0}
            pressure={0.8}
            rainbow={false}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
