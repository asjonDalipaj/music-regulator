"use client";

import { motion } from "framer-motion";
import CornerFlourish from "@/components/decorative/CornerFlourish";

interface SkillCardProps {
  title: string;
  icon: string;
  skills: string[];
  color: "burgundy" | "sage" | "gold";
  delay?: number;
}

export default function SkillCard({ title, icon, skills, color, delay = 0 }: SkillCardProps) {
  const colorClasses = {
    burgundy: "border-burgundy/30 hover:border-burgundy/60 hover:shadow-burgundy/20",
    sage: "border-sage/30 hover:border-sage/60 hover:shadow-sage/20",
    gold: "border-gold/30 hover:border-gold/60 hover:shadow-gold/20",
  };

  const iconBgClasses = {
    burgundy: "bg-burgundy",
    sage: "bg-sage",
    gold: "bg-gold",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative bg-cream-dark border-2 ${colorClasses[color]} rounded-lg p-6 shadow-lg transition-all duration-300`}
    >
      <CornerFlourish position="top-left" size={30} color="#c9a961" className="opacity-40" />
      <CornerFlourish position="bottom-right" size={30} color="#c9a961" className="opacity-40" />

      {/* Icon */}
      <div className="flex justify-center mb-4">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className={`w-16 h-16 ${iconBgClasses[color]} rounded-full flex items-center justify-center shadow-md`}
        >
          <span className="text-3xl">{icon}</span>
        </motion.div>
      </div>

      {/* Title */}
      <h3 className="font-playfair text-2xl font-bold text-burgundy text-center mb-4">
        {title}
      </h3>

      {/* Skills List */}
      <ul className="space-y-2">
        {skills.map((skill, index) => (
          <motion.li
            key={skill}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: delay + 0.1 + index * 0.05 }}
            className="font-inter text-charcoal flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            {skill}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
