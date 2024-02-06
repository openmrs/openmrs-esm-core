import React from 'react';
import { interpolateUrl, useConfig } from '@openmrs/esm-framework';
import styles from './logo.scss';

const Logo: React.FC = () => {
  const { logo } = useConfig();
  const maxWidth = 300; // Maximum width of the logo

   // Preload image to get dimensions
      const img = new Image();
      img.src = interpolateUrl(logo.src);

    const logoWidth = img.width || 110; //default width 


  return (
    <>
      {logo?.src ? (
        <img
          className={styles.logo}
          src={interpolateUrl(logo.src)}
          alt={logo.alt}
          width={logoWidth}
          height={40}
        />
      ) : logo?.name ? (
        logo.name
      ) : (
        <svg role="img" width={logoWidth} height={40}>
          <use xlinkHref="#omrs-logo-white"></use>
        </svg>
      )}
    </>
  );
};

export default Logo;
