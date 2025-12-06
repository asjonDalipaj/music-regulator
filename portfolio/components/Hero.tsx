"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  const [currentPoem, setCurrentPoem] = useState(0);

  const poems = [
    {
      lines: [
        "Where logic meets the muse,",
        "In code, the heart's rhythm flows,",
        "Art and science fuse."
      ],
      author: "- On Creative Engineering"
    },
    {
      lines: [
        "From steel to soft verse,",
        "Engineering dreams take flight,",
        "Renaissance rebirth."
      ],
      author: "- Journey of Transformation"
    },
    {
      lines: [
        "In bytes and melodies,",
        "Healing algorithms dance,",
        "Tech serves humanity."
      ],
      author: "- Music Therapy Vision"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoem((prev) => (prev + 1) % poems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [poems.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream via-cream-dark to-sage-light">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-burgundy rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sage rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-burgundy mb-6">
            Asjon Dalipaj
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="font-inter text-xl md:text-2xl text-charcoal mb-4">
            Full Stack Developer & Creative Engineer
          </p>
          <div className="flex items-center justify-center gap-2 text-sage-dark font-inter text-lg">
            <span>Engineering</span>
            <span className="text-gold">•</span>
            <span>Poetry</span>
            <span className="text-gold">•</span>
            <span>Music Therapy</span>
          </div>
        </motion.div>

        {/* Decorative Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-32 h-1 bg-gradient-to-r from-burgundy via-gold to-sage mx-auto my-12"
        ></motion.div>

        {/* Animated Poetry Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative h-48 flex items-center justify-center"
        >
          {poems.map((poem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: currentPoem === index ? 1 : 0,
                y: currentPoem === index ? 0 : 20,
              }}
              transition={{ duration: 0.6 }}
              className={`absolute inset-0 flex flex-col items-center justify-center ${
                currentPoem === index ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
            >
              <div className="max-w-2xl px-8 py-6 bg-white/40 backdrop-blur-sm rounded-lg border-2 border-gold/30 shadow-xl">
                {poem.lines.map((line, lineIndex) => (
                  <motion.p
                    key={lineIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: currentPoem === index ? 1 : 0,
                      x: currentPoem === index ? 0 : -20,
                    }}
                    transition={{ duration: 0.5, delay: lineIndex * 0.2 }}
                    className="font-playfair text-xl md:text-2xl text-burgundy-dark italic leading-relaxed"
                  >
                    {line}
                  </motion.p>
                ))}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: currentPoem === index ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="font-inter text-sm text-charcoal mt-4 text-right"
                >
                  {poem.author}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Poem Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex justify-center gap-2 mt-8"
        >
          {poems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPoem(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentPoem === index
                  ? 'bg-burgundy w-8'
                  : 'bg-burgundy/30 hover:bg-burgundy/50'
              }`}
              aria-label={`View poem ${index + 1}`}
            />
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12"
        >
          <a
            href="#projects"
            className="inline-block px-8 py-4 bg-burgundy text-cream font-inter font-semibold rounded-lg hover:bg-burgundy-light transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explore My Work
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-burgundy rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-burgundy rounded-full mt-2"
            ></motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
