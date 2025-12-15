/**
 * UI Layer
 * Top overlay with logo and audio toggle
 * Uses mix-blend-mode for visual effect
 */

import React from 'react';
import styles from '../PortfolioScene.module.css';

interface UILayerProps {
  isAudioPlaying: boolean;
  onAudioToggle: () => void;
}

export const UILayer: React.FC<UILayerProps> = ({ isAudioPlaying, onAudioToggle }) => {
  return (
    <div className={styles.uiLayer}>
      <div className={styles.logo}>DEV.PORTFOLIO</div>
      <button
        className={styles.soundToggle}
        onClick={onAudioToggle}
        aria-label={isAudioPlaying ? 'Disable Audio' : 'Enable Audio'}
      >
        {isAudioPlaying ? 'Disable Audio' : 'Enable Audio'}
      </button>
    </div>
  );
};
