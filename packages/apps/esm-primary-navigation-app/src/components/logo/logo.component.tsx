import React from 'react';
import { interpolateUrl, useConfig } from '@openmrs/esm-framework';
import styles from './logo.scss';

interface LogoProps {
  width?: number; // Optional width property for the logo
}

const Logo: React.FC<LogoProps> = ({ width = 110 }) => {
  const { logo } = useConfig();

  //Maximum width for the logo
  const maxWidth = 300;

  return (
    <>
      {logo?.src ? (
        <img
          className={styles.logo}
          src={interpolateUrl(logo.src)}
          alt={logo.alt}
          width={Math.min(logo.width || width, maxWidth)} // Adjusted width logic
          height={40}
        />
      ) : logo?.name ? (
        logo.name
      ) : (
        <svg role="img" width={width} height={40}>
          <use xlinkHref="#omrs-logo-white"></use>
        </svg>
      )}
    </>
  );
};

export default Logo;
