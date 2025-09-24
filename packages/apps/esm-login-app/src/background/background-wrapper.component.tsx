import React, { useMemo } from 'react';
import { useConfig, interpolateUrl } from '@openmrs/esm-framework';
import { type ConfigSchema } from '../config-schema';
import styles from './background-wrapper.scss';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
  const config = useConfig<ConfigSchema>();

  const backgroundStyles = useMemo(() => {
    const { background } = config;
    const style: React.CSSProperties = {};

    switch (background.type) {
      case 'color':
        if (background.value) {
          style.backgroundColor = background.value;
        }
        break;

      case 'image':
        if (background.value) {
          style.backgroundImage = `url(${interpolateUrl(background.value)})`;
          style.backgroundSize = 'cover';
          style.backgroundPosition = 'center';
          style.backgroundRepeat = 'no-repeat';
        }
        break;

      case 'gradient':
        if (background.value) {
          style.background = background.value;
        }
        break;

      default:
        // Use default styling
        break;
    }

    return style;
  }, [config.background]);

  const overlayStyles = useMemo(() => {
    const { background } = config;

    if (!background.overlay.enabled) {
      return {};
    }

    return {
      backgroundColor: background.overlay.color,
      opacity: background.overlay.opacity,
    };
  }, [config.background]);

  const hasCustomBackground = config.background.type !== 'default' && config.background.value;
  const hasOverlay = config.background.overlay.enabled && hasCustomBackground;

  return (
    <div
      className={`${styles.backgroundWrapper} ${hasCustomBackground ? styles.customBackground : ''}`}
      style={backgroundStyles}
    >
      {hasOverlay && <div className={styles.overlay} style={overlayStyles} />}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default BackgroundWrapper;
