"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Poem {
  lines: string[];
  author: string;
}

export default function TypewriterPoetry() {
  const [currentPoem, setCurrentPoem] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const poems: Poem[] = [
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

  // Typewriter effect for poetry
  useEffect(() => {
    setTypedText("");
    setIsTypingComplete(false);
    
    const currentPoemLines = poems[currentPoem].lines;
    let lineIndex = 0;
    let charIndex = 0;
    let currentText = "";

    const typeInterval = setInterval(() => {
      if (lineIndex < currentPoemLines.length) {
        const currentLineText = currentPoemLines[lineIndex];
        
        if (charIndex < currentLineText.length) {
          currentText += currentLineText[charIndex];
          setTypedText(currentText);
          charIndex++;
        } else {
          // Move to next line
          currentText += "\n";
          setTypedText(currentText);
          lineIndex++;
          charIndex = 0;
        }
      } else {
        setIsTypingComplete(true);
        clearInterval(typeInterval);
      }
    }, 60); // 60ms per character

    return () => clearInterval(typeInterval);
  }, [currentPoem]);

  // Auto-advance poems
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoem((prev) => (prev + 1) % poems.length);
    }, 12000); // 12 seconds
    return () => clearInterval(interval);
  }, [poems.length]);

  return (
    <>
      {/* Typewriter Poetry Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 4.5 }}
        className="relative min-h-[240px] flex items-center justify-center"
      >
        <motion.div
          whileHover={{ 
            scale: 1.02,
            rotateX: 2,
            rotateY: 2
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="max-w-2xl px-8 py-6 bg-white/40 backdrop-blur-sm rounded-lg border-2 border-gold/30 shadow-xl"
          style={{ perspective: 1000 }}
        >
          <div className="font-playfair text-xl md:text-2xl text-burgundy-dark italic leading-relaxed whitespace-pre-line min-h-[140px]">
            {typedText}
            {!isTypingComplete && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-0.5 h-6 bg-burgundy ml-1"
              />
            )}
          </div>
          {isTypingComplete && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-inter text-sm text-charcoal mt-4 text-right"
            >
              {poems[currentPoem].author}
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* Poem Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 5 }}
        className="flex justify-center gap-2 mt-8"
      >
        {poems.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentPoem(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              currentPoem === index
                ? 'bg-burgundy w-8'
                : 'bg-burgundy/30 hover:bg-burgundy/50 w-3'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`View poem ${index + 1}`}
          />
        ))}
      </motion.div>
    </>
  );
}
