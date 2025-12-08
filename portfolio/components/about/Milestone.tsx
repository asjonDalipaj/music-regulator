"use client";

import { motion } from "framer-motion";

interface MilestoneProps {
  year: string;
  title: string;
  description: string;
  icon: string;
  position: "left" | "right";
  index: number;
}

export default function Milestone({
  year,
  title,
  description,
  icon,
  position,
  index,
}: MilestoneProps) {
  const isLeft = position === "left";

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`flex items-center gap-8 mb-16 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
    >
      {/* Content Card */}
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.3 }}
        className={`flex-1 bg-cream-dark border-2 border-gold/30 rounded-lg p-6 shadow-lg relative ${
          isLeft ? "text-right" : "text-left"
        }`}
      >
        <div className="absolute -top-3 left-6 bg-burgundy text-cream px-4 py-1 rounded-full font-inter font-semibold text-sm">
          {year}
        </div>
        <h3 className="font-playfair text-2xl font-bold text-burgundy mt-2 mb-2">
          {title}
        </h3>
        <p className="font-inter text-charcoal leading-relaxed">{description}</p>
      </motion.div>

      {/* Timeline Node */}
      <div className="relative flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
          className="w-16 h-16 bg-gradient-to-br from-burgundy to-burgundy-dark rounded-full flex items-center justify-center border-4 border-gold shadow-lg z-10 relative"
        >
          <span className="text-3xl">{icon}</span>
        </motion.div>
        
        {/* Vertical Line */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-gold to-transparent" />
      </div>

      {/* Spacer for opposite side */}
      <div className="flex-1" />
    </motion.div>
  );
}
