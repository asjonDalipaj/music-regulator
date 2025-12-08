"use client";

import ScrollReveal from "@/components/animations/ScrollReveal";
import DecorativeDivider from "@/components/decorative/DecorativeDivider";
import CornerFlourish from "@/components/decorative/CornerFlourish";
import SkillCard from "./SkillCard";
import SkillBar from "./SkillBar";

const skillCards = [
  {
    title: "Frontend Development",
    icon: "💻",
    color: "burgundy" as const,
    skills: ["React & Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "Backend & AI",
    icon: "⚙️",
    color: "sage" as const,
    skills: ["Node.js & Python", "AI/ML Integration", "API Design", "Data Processing"],
  },
  {
    title: "Creative Arts",
    icon: "🎭",
    color: "gold" as const,
    skills: ["Poetry & Writing", "Digital Design", "Music Composition", "Visual Arts"],
  },
];

const technicalSkills = [
  { name: "React & Next.js", level: 5 },
  { name: "TypeScript", level: 5 },
  { name: "Node.js", level: 4 },
  { name: "Python & AI/ML", level: 4 },
  { name: "Tailwind CSS", level: 5 },
];

const creativeSkills = [
  { name: "Poetry & Creative Writing", level: 5 },
  { name: "UI/UX Design", level: 4 },
  { name: "Music Theory", level: 4 },
  { name: "Digital Art", level: 3 },
  { name: "Renaissance Art History", level: 4 },
];

export default function Skills() {
  return (
    <section id="skills" className="relative min-h-screen py-24 bg-gradient-to-br from-cream-dark via-cream to-sage-light overflow-hidden">
      {/* Corner Flourishes */}
      <CornerFlourish position="top-left" color="#8a9a7b" />
      <CornerFlourish position="top-right" color="#8a9a7b" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal variant="fadeDown">
          <h2 className="font-playfair text-5xl md:text-6xl font-bold text-burgundy text-center mb-6">
            Skills & Expertise
          </h2>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.2}>
          <p className="font-inter text-xl text-charcoal text-center max-w-3xl mx-auto leading-relaxed mb-4">
            Bridging the gap between technical precision and creative expression—
            a unique blend of engineering prowess and artistic sensibility.
          </p>
        </ScrollReveal>

        <DecorativeDivider variant="ornate" className="my-12" />

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-20">
          {skillCards.map((card, index) => (
            <SkillCard
              key={card.title}
              {...card}
              delay={index * 0.15}
            />
          ))}
        </div>

        <DecorativeDivider variant="simple" className="my-16" />

        {/* Detailed Skill Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          {/* Technical Skills */}
          <ScrollReveal variant="slideRight" delay={0.2}>
            <div className="bg-cream-dark/50 backdrop-blur-sm border-2 border-burgundy/20 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-burgundy rounded-full flex items-center justify-center">
                  <span className="text-xl">🔧</span>
                </div>
                <h3 className="font-playfair text-3xl font-bold text-burgundy">
                  Technical Skills
                </h3>
              </div>
              <div className="space-y-4">
                {technicalSkills.map((skill, index) => (
                  <SkillBar
                    key={skill.name}
                    {...skill}
                    category="technical"
                    delay={0.3 + index * 0.1}
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Creative Skills */}
          <ScrollReveal variant="slideLeft" delay={0.2}>
            <div className="bg-cream-dark/50 backdrop-blur-sm border-2 border-sage/20 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center">
                  <span className="text-xl">✨</span>
                </div>
                <h3 className="font-playfair text-3xl font-bold text-burgundy">
                  Creative Skills
                </h3>
              </div>
              <div className="space-y-4">
                {creativeSkills.map((skill, index) => (
                  <SkillBar
                    key={skill.name}
                    {...skill}
                    category="creative"
                    delay={0.3 + index * 0.1}
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Call to Action */}
        <ScrollReveal variant="fadeUp" delay={0.5}>
          <div className="mt-16 text-center">
            <p className="font-inter text-lg text-charcoal max-w-2xl mx-auto leading-relaxed italic">
              "The intersection of technology and artistry is where true innovation happens—
              where code becomes poetry and systems become experiences."
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
