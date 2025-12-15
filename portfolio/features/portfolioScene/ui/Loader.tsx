/**
 * Loader Component
 * Loading screen with progress bar
 */

import React from 'react';
import styles from '../PortfolioScene.module.css';

interface LoaderProps {
  isLoading: boolean;
  progress?: number;
}

export const Loader: React.FC<LoaderProps> = ({ isLoading, progress = 100 }) => {
  if (!isLoading) return null;

  return (
    <div className={`${styles.loader} ${!isLoading ? styles.fadeOut : ''}`}>
      <div className={styles.loaderText}>INITIALIZING</div>
      <div className={styles.loaderProgress}>
        <div 
          className={styles.loaderBar}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
