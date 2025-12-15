"use client";

import { motion } from "framer-motion";
import RenaissanceDecorations from "./hero/RenaissanceDecorations";
import TypewriterPoetry from "./hero/TypewriterPoetry";
import FluidDistortion from "./effects/FluidDistortion";
import {
  containerVariants,
  letterVariants,
  taglineContainerVariants,
  taglineSegmentVariants,
  bulletContainerVariants,
  pulsingBulletAnimation,
  pulsingBulletTransition,
  scrollIndicatorAnimation,
  scrollDotAnimation,
  scrollTransition
} from "./hero/animations";

export default function Hero() {
  const name = "Asjon Dalipaj";
  const nameLetters = name.split("");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      
      {/* Colorful Floating Shapes - Paint Splatter Style */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Coral Blob */}
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #FF6B6B 0%, #FF8787 50%, transparent 70%)",
            top: "10%",
            left: "5%",
            filter: "blur(60px)"
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Cyan Blob */}
        <motion.div
          className="absolute w-80 h-80 rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, #4ECDC4 0%, #7EDDD8 50%, transparent 70%)",
            top: "60%",
            right: "10%",
            filter: "blur(50px)"
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* Yellow Blob */}
        <motion.div
          className="absolute w-72 h-72 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #FFE66D 0%, #FFF0A3 50%, transparent 70%)",
            bottom: "15%",
            left: "15%",
            filter: "blur(55px)"
          }}
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 25, 0],
            y: [0, -35, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Purple Blob */}
        <motion.div
          className="absolute w-64 h-64 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #A78BFA 0%, #C4B5FD 50%, transparent 70%)",
            top: "40%",
            right: "20%",
            filter: "blur(45px)"
          }}
          animate={{
            scale: [1, 1.25, 1],
            x: [0, -20, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />

        {/* Small accent dots */}
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-coral opacity-30"
          style={{
            top: "20%",
            right: "30%",
            filter: "blur(25px)"
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute w-40 h-40 rounded-full bg-cyan opacity-25"
          style={{
            bottom: "30%",
            left: "40%",
            filter: "blur(30px)"
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.25, 0.4, 0.25]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>

      {/* Renaissance Decorative Elements - Now with vibrant colors */}
      <RenaissanceDecorations />

      <motion.div 
        className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Name - Letter by Letter with gradient */}
        <div className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
          <motion.div
            className="inline-block bg-gradient-to-r from-charcoal via-coral to-purple bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {nameLetters.map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block"
                style={{ display: letter === " " ? "inline" : "inline-block" }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Tagline with Staggered Animation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={taglineContainerVariants}
          className="mb-4"
        >
          <motion.p 
            variants={taglineSegmentVariants}
            className="font-inter text-xl md:text-2xl text-charcoal"
          >
            Full Stack Developer & Creative Engineer
          </motion.p>
        </motion.div>

        {/* Tagline segments with colorful rotating bullets */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={bulletContainerVariants}
          className="flex items-center justify-center gap-2 text-charcoal-light font-inter text-lg mb-12"
        >
          <motion.span variants={taglineSegmentVariants}>Software Engineer</motion.span>
          <motion.span 
            variants={taglineSegmentVariants}
            animate={{
              scale: [1, 1.3, 1],
              color: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A78BFA", "#FF6B6B"]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            •
          </motion.span>
          <motion.span variants={taglineSegmentVariants}>Digital Artist</motion.span>
          <motion.span 
            variants={taglineSegmentVariants}
            animate={{
              scale: [1, 1.3, 1],
              color: ["#4ECDC4", "#FFE66D", "#A78BFA", "#FF6B6B", "#4ECDC4"]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            •
          </motion.span>
          <motion.span variants={taglineSegmentVariants}>Music Therapy Innovator</motion.span>
        </motion.div>

        {/* Decorative Divider - Vibrant colors */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 4, ease: "easeOut" }}
          className="w-32 h-1 bg-gradient-to-r from-coral via-cyan to-purple mx-auto mb-12 rounded-full"
        />

        {/* Typewriter Poetry Component */}
        <TypewriterPoetry />

        {/* CTA Button - Vibrant Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 5.5 }}
          className="mt-12"
        >
          <motion.a
            href="#projects"
            className="inline-block px-8 py-4 text-white font-inter font-semibold rounded-full shadow-xl relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #FF6B6B 0%, #A78BFA 100%)"
            }}
            whileHover={{ 
              scale: 1.08,
              boxShadow: "0 25px 50px rgba(255, 107, 107, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated gradient overlay on hover */}
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(135deg, #A78BFA 0%, #4ECDC4 100%)"
              }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              Explore My Work
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                →
              </motion.span>
            </span>
            
            {/* Ripple effect */}
            <motion.span
              className="absolute inset-0 bg-white/30 rounded-full"
              initial={{ scale: 0, opacity: 1 }}
              whileHover={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          </motion.a>
        </motion.div>

        {/* Scroll Indicator - Vibrant colors */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={scrollIndicatorAnimation}
            transition={scrollTransition}
            className="w-6 h-10 border-2 rounded-full flex justify-center"
            style={{
              borderColor: "#FF6B6B"
            }}
          >
            <motion.div
              animate={{
                ...scrollDotAnimation,
                backgroundColor: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A78BFA", "#FF6B6B"]
              }}
              transition={{
                ...scrollTransition,
                backgroundColor: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
              className="w-1 h-3 rounded-full mt-2"
              style={{
                backgroundColor: "#FF6B6B"
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
