/**
 * Audio Toggle Button
 * Floating button to enable/disable ambient audio
 */

import React from 'react';
import styles from '../PortfolioScene.module.css';

interface AudioToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const AudioToggle: React.FC<AudioToggleProps> = ({ isPlaying, onToggle }) => {
  return (
    <button
      className={`${styles.audioToggle} ${isPlaying ? styles.active : ''}`}
      onClick={onToggle}
      aria-label={isPlaying ? 'Disable Audio' : 'Enable Audio'}
      title={isPlaying ? 'Disable Audio' : 'Enable Audio'}
    >
      <span aria-hidden="true">
        {isPlaying ? '🔊' : '🔇'}
      </span>
    </button>
  );
};
