"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export default function RenaissanceDecorations() {
  // Generate fixed random values to avoid hydration mismatch
  const particles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      initialX: (i * 7.3 + 10) % 100,
      initialY: (i * 11.7 + 20) % 100,
      path1X: (i * 9.1 + 30) % 100,
      path1Y: (i * 13.3 + 40) % 100,
      path2X: (i * 15.7 + 50) % 100,
      path2Y: (i * 17.9 + 60) % 100,
      duration: 20 + (i * 3) % 20,
      shapeType: i % 3
    }));
  }, []);

  return (
    <>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{ 
              x: `${particle.initialX}%`,
              y: `${particle.initialY}%`,
              opacity: 0.05
            }}
            animate={{
              x: [
                `${particle.initialX}%`,
                `${particle.path1X}%`,
                `${particle.path2X}%`
              ],
              y: [
                `${particle.initialY}%`,
                `${particle.path1Y}%`,
                `${particle.path2Y}%`
              ],
              rotate: [0, 360],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {particle.shapeType === 0 ? (
              <div className="w-8 h-8 border-2 border-burgundy rounded-full" />
            ) : particle.shapeType === 1 ? (
              <div className="w-8 h-8 border-2 border-gold" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
            ) : (
              <div className="w-8 h-8 border-2 border-sage transform rotate-45" />
            )}
          </motion.div>
        ))}

        {/* Gradient blobs with pulsing */}
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 bg-burgundy rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-gold rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sage rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Renaissance Decorative Borders (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
        {/* Top-left flourish */}
        <motion.path
          d="M 50 50 Q 100 50 150 100 T 200 200"
          stroke="url(#goldGradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Top-right flourish */}
        <motion.path
          d="M 850 50 Q 800 50 750 100 T 700 200"
          stroke="url(#goldGradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 1.2 }}
        />

        {/* Bottom-left flourish */}
        <motion.path
          d="M 50 550 Q 100 550 150 500 T 200 400"
          stroke="url(#burgundyGradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 1.4 }}
        />

        {/* Bottom-right flourish */}
        <motion.path
          d="M 850 550 Q 800 550 750 500 T 700 400"
          stroke="url(#burgundyGradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 1.6 }}
        />

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c9a961" />
            <stop offset="100%" stopColor="#e6c88a" />
          </linearGradient>
          <linearGradient id="burgundyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b2737" />
            <stop offset="100%" stopColor="#8b3a4f" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}
