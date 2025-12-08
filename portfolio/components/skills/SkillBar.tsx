"use client";

import { motion } from "framer-motion";

interface SkillBarProps {
  name: string;
  level: number; // 1-5
  category: "technical" | "creative";
  delay?: number;
}

export default function SkillBar({ name, level, category, delay = 0 }: SkillBarProps) {
  const percentage = (level / 5) * 100;
  const colorClass = category === "technical" ? "bg-burgundy" : "bg-sage";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="mb-6"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-inter font-semibold text-charcoal">{name}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((dot) => (
            <motion.div
              key={dot}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: delay + dot * 0.05 }}
              className={`w-2 h-2 rounded-full ${
                dot <= level ? colorClass : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
          className={`h-full ${colorClass} rounded-full`}
        />
      </div>
    </motion.div>
  );
}
