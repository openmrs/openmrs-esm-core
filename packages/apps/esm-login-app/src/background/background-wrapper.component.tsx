import React, { useMemo } from 'react';
import { useConfig } from '@openmrs/esm-framework';
import { type ConfigSchema } from '../config-schema';
import styles from './background-wrapper.scss';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
  const config = useConfig<ConfigSchema>();
  const { background } = config;

  const backgroundStyles = useMemo(() => {
    const style: React.CSSProperties = {};

    if (background.color) {
      style.backgroundColor = background.color;
    }

    if (background.imageUrl) {
      style.backgroundImage = `url(${background.imageUrl})`;
      style.backgroundSize = 'cover';
      style.backgroundPosition = 'center';
      style.backgroundRepeat = 'no-repeat';
    }

    return style;
  }, [background]);

  const hasCustomBackground = background.color || background.imageUrl;

  return (
    <div
      className={`${styles.backgroundWrapper} ${hasCustomBackground ? styles.customBackground : ''}`}
      style={backgroundStyles}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default BackgroundWrapper;
