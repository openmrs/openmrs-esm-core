import React, { useMemo } from 'react';
import { useConfig } from '@openmrs/esm-framework';
import { type ConfigSchema } from '../config-schema';
import styles from './background-wrapper.scss';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
  const config = useConfig<ConfigSchema>();
  const { layout, background } = config;

  const backgroundStyles = useMemo(() => {
    const style: React.CSSProperties = {};

    switch (background.type) {
      case 'color':
        if (background.value) {
          style.backgroundColor = background.value;
        }
        break;

      case 'image':
        if (background.value) {
          // Simple URL-based approach - let browser handle loading
          style.backgroundImage = `url(${background.value})`;
          style.backgroundSize = background.size || 'cover';
          style.backgroundPosition = background.position || 'center';
          style.backgroundRepeat = background.repeat || 'no-repeat';
          style.backgroundAttachment = background.attachment || 'scroll';
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
  }, [background]);

  const overlayStyles = useMemo(() => {
    if (!background.overlay.enabled) {
      return {};
    }

    return {
      backgroundColor: background.overlay.color,
      opacity: background.overlay.opacity,
      mixBlendMode: background.overlay.blendMode || 'normal',
    };
  }, [background]);

  const hasCustomBackground = background.type !== 'default' && background.value;
  const hasOverlay = background.overlay.enabled && hasCustomBackground;

  // Split-screen layout: Background image on one side, login card on opposite side
  if (layout.type === 'split-screen' && background.type === 'image' && background.value) {
    // Determine which side gets the background image based on columnPosition
    // If card is on left, bg is on right. If card is on right, bg is on left.
    // If card is center, bg is on left by default
    const bgPosition = layout.columnPosition === 'right' ? 'left' : 'right';

    return (
      <div className={`${styles.backgroundWrapper} ${styles.splitScreenContainer}`}>
        <div
          className={`${styles.backgroundPanel} ${styles[`bgPosition-${bgPosition}`]}`}
          style={{
            backgroundImage: `url(${background.value})`,
            backgroundSize: background.size || 'cover',
            backgroundPosition: background.position || 'center',
            backgroundRepeat: background.repeat || 'no-repeat',
          }}
        />
        <div className={styles.content}>{children}</div>
      </div>
    );
  }

  // Default layout: Simple background with optional overlay
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
