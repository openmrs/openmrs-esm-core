import React from 'react';
import { interpolateUrl, useConfig } from '@openmrs/esm-framework';
import styles from './logo.scss';

const Logo: React.FC = () => {
  const { logo } = useConfig();
  const height = 40; // Fixed Height of the logo
  const maxWidth = 300; // Maximum width of the logo

  const calculateWidth = () => {
    if (logo?.src) {
      // Preload image to get dimensions
      const img = new Image();
      img.src = interpolateUrl(logo.src);

      // Calculate width based on aspect ratio and constraints
      const aspectRatio = img.width / img.height;
      const calculatedWidth = Math.min(maxWidth, height * aspectRatio);

      return calculatedWidth;
    }
    return 110; // If no logo is provided, use a default width 110
  };



  return (
    <>
      {logo?.src ? (
        <img
          className={styles.logo}
          src={interpolateUrl(logo.src)}
          alt={logo.alt}
          width={calculateWidth()}
          height={40}
        />
      ) : logo?.name ? (
        logo.name
      ) : (
        <svg role="img" width={calculateWidth()} height={height}>
          <use xlinkHref="#omrs-logo-white"></use>
        </svg>
      )}
    </>
  );
};

export default Logo;
