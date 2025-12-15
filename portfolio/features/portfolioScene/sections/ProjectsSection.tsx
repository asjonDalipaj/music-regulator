/**
 * Projects Section
 * Showcasing select projects in a grid layout
 */

import React from 'react';
import styles from '../PortfolioScene.module.css';

const projects = [
  {
    title: 'Pulse Analytics',
    description: 'Real-time data visualization platform processing 10k events/sec with zero latency.',
    tech: 'React / Rust / WebSockets'
  },
  {
    title: 'Sidekick AI',
    description: 'Context-aware coding assistant integration using LLMs and vector embeddings.',
    tech: 'Python / OpenAI / Vector DB'
  },
  {
    title: 'Flow Commerce',
    description: '3D product configurator with liquid metal shaders for luxury brands.',
    tech: 'Three.js / WebGL / Shopify'
  }
];

export const ProjectsSection: React.FC = () => {
  return (
    <section className={`${styles.section} ${styles.center}`}>
      <div className={styles.sectionContent}>
        <h2>Select Projects</h2>
        <div className={styles.projectGrid}>
          {projects.map((project, index) => (
            <div key={index} className={styles.projectCard}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span style={{ 
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-accent-b, #ffcc00)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginTop: '1.5rem',
                display: 'inline-block',
                background: 'rgba(255, 204, 0, 0.1)',
                padding: '4px 12px',
                borderRadius: '20px'
              }}>
                {project.tech}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
