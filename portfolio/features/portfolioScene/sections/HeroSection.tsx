/**
 * Hero Section
 * Opening section with main headline
 */

import React from 'react';
import styles from '../PortfolioScene.module.css';

export const HeroSection: React.FC = () => {
  return (
    <section className={`${styles.section} ${styles.left}`}>
      <div className={styles.sectionContent}>
        <h2>
          Building <br />
          <span style={{ color: 'var(--color-accent-b, #ffcc00)' }}>Electric</span> Dreams
        </h2>
        <p>
          Full-Stack Engineer crafting fluid, high-performance web interfaces. 
          Architecture that scales, interactions that explode with energy.
        </p>
      </div>
    </section>
  );
};
