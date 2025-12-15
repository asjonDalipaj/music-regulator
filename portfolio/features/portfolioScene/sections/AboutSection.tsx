/**
 * About Section
 * Philosophy and approach description
 */

import React from 'react';
import styles from '../PortfolioScene.module.css';

export const AboutSection: React.FC = () => {
  return (
    <section className={`${styles.section} ${styles.right}`}>
      <div className={styles.sectionContent}>
        <h2>Vibrant Logic</h2>
        <p>
          Modern software should be adaptable, not rigid. My approach combines 
          robust backend architecture with reactive, WebGL-powered frontends.
        </p>
        <p>
          Inspired by the seamless state management of modern commerce engines.
        </p>
      </div>
    </section>
  );
};
