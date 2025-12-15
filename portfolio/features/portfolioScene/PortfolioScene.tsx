/**
 * Portfolio Scene V2
 * Main orchestrator component - connects all modules
 * Uses feature-based architecture with separation of concerns
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SceneManager } from './webgl/SceneManager';
import { AudioManager } from './webgl/AudioManager';
import { sceneConfig } from './webgl/config';
import { Loader } from './ui/Loader';
import { UILayer } from './ui/UILayer';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ContactSection } from './sections/ContactSection';
import styles from './PortfolioScene.module.css';

export default function PortfolioScene() {
  // Refs
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const audioManagerRef = useRef<AudioManager>(new AudioManager());
  const rafIdRef = useRef<number | null>(null);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Initialize Three.js scene
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Create scene manager
    const sceneManager = new SceneManager(container, sceneConfig);
    sceneManagerRef.current = sceneManager;

    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);

    // Animation loop
    const animate = () => {
      const timeS = performance.now() * 0.001;
      const audioLevel = audioManagerRef.current.getFrequencyData();

      sceneManager.update(timeS, audioLevel);
      sceneManager.render();

      rafIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      sceneManager.dispose();
      audioManagerRef.current.dispose();
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (sceneManagerRef.current) {
        sceneManagerRef.current.resize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (sceneManagerRef.current) {
        const bodyHeight = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = bodyHeight > 0 ? window.scrollY / bodyHeight : 0;
        sceneManagerRef.current.setScrollTarget(scrollProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sceneManagerRef.current) {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        sceneManagerRef.current.setMouseTarget({ x: mouseX, y: mouseY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle audio toggle
  const handleAudioToggle = () => {
    if (isAudioPlaying) {
      audioManagerRef.current.stop();
      setIsAudioPlaying(false);
    } else {
      audioManagerRef.current.play();
      setIsAudioPlaying(true);
    }
  };

  return (
    <div className={styles.container}>
      {/* Loading Screen */}
      <Loader isLoading={isLoading} />

      {/* WebGL Canvas */}
      <div ref={canvasContainerRef} className={styles.canvasContainer} />

      {/* UI Layer with Logo and Audio Toggle */}
      <UILayer isAudioPlaying={isAudioPlaying} onAudioToggle={handleAudioToggle} />

      {/* Content Sections */}
      <main className={styles.content}>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  );
}
