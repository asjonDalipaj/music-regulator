"use client";

import ScrollReveal from "@/components/animations/ScrollReveal";
import DecorativeDivider from "@/components/decorative/DecorativeDivider";
import CornerFlourish from "@/components/decorative/CornerFlourish";
import Milestone from "./Milestone";

const milestones = [
  {
    year: "2016",
    title: "Engineering Foundation",
    description: "Graduated with a degree in Software Engineering, discovering the power of code to solve complex problems and create innovative solutions.",
    icon: "🎓",
  },
  {
    year: "2019",
    title: "Discovery of Poetry",
    description: "Found my creative voice through poetry, learning to express complex emotions and ideas through the rhythm and imagery of verse.",
    icon: "✍️",
  },
  {
    year: "2021",
    title: "Renaissance Exploration",
    description: "Immersed in Renaissance art and philosophy, finding inspiration in the fusion of science, art, and humanistic values.",
    icon: "🎨",
  },
  {
    year: "2024",
    title: "Music Therapy Innovation",
    description: "Combined technical expertise with therapeutic insights to develop AI-powered music therapy systems that adapt to individual emotional states.",
    icon: "🎵",
  },
];

export default function AboutMe() {
  return (
    <section id="about" className="relative min-h-screen py-24 bg-cream overflow-hidden">
      {/* Corner Flourishes */}
      <CornerFlourish position="top-left" color="#6b2737" />
      <CornerFlourish position="top-right" color="#6b2737" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal variant="fadeDown">
          <h2 className="font-playfair text-5xl md:text-6xl font-bold text-burgundy text-center mb-6">
            About Me
          </h2>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.2}>
          <p className="font-inter text-xl text-charcoal text-center max-w-3xl mx-auto leading-relaxed mb-4">
            A journey through engineering, poetry, Renaissance art, and music therapy—
            where logic meets creativity and innovation serves humanity.
          </p>
        </ScrollReveal>

        <DecorativeDivider variant="ornate" className="my-12" />

        {/* Timeline */}
        <div className="mt-20 max-w-5xl mx-auto">
          {milestones.map((milestone, index) => (
            <Milestone
              key={milestone.year}
              {...milestone}
              position={index % 2 === 0 ? "left" : "right"}
              index={index}
            />
          ))}
        </div>

        {/* Personal Philosophy */}
        <ScrollReveal variant="fadeUp" delay={0.3}>
          <div className="mt-20 max-w-3xl mx-auto bg-gradient-to-br from-cream-dark to-sage-light border-2 border-burgundy/20 rounded-lg p-8 shadow-xl relative">
            <CornerFlourish position="top-left" size={40} color="#c9a961" />
            <CornerFlourish position="bottom-right" size={40} color="#c9a961" />
            
            <h3 className="font-playfair text-3xl font-bold text-burgundy mb-4 text-center">
              My Philosophy
            </h3>
            <DecorativeDivider variant="dots" className="mb-6" />
            <p className="font-inter text-lg text-charcoal leading-relaxed text-center">
              I believe the future of technology lies in its ability to enhance human well-being. 
              By combining analytical thinking with creative expression, I strive to build systems 
              that are not only technically sophisticated but also deeply empathetic—tools that 
              understand and respond to the human experience.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
