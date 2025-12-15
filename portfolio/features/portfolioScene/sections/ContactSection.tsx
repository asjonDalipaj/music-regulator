/**
 * Contact Section
 * Final section with contact information
 */

import React from 'react';
import styles from '../PortfolioScene.module.css';

export const ContactSection: React.FC = () => {
  return (
    <section className={`${styles.section} ${styles.left}`}>
      <div className={styles.sectionContent}>
        <h2>Connect</h2>
        <p>
          Open for technical leadership roles and creative technology commissions.
        </p>
        <a 
          href="mailto:hello@example.com"
          style={{
            fontSize: '1.5rem',
            textDecoration: 'none',
            borderBottom: '2px solid var(--color-accent-b, #ffcc00)',
            color: 'var(--color-accent-b, #ffcc00)',
            display: 'inline-block',
            marginTop: '1rem'
          }}
        >
          hello@example.com
        </a>
      </div>
    </section>
  );
};
