import React from 'react';
import { interpolateUrl, useConfig } from '@openmrs/esm-framework';
import styles from './logo.scss';


const Logo: React.FC = () => {
  const { logo } = useConfig();
  const logoWidth = logo?.width || 110;
  //Maximum width for the logo
  const maxWidth = 300;

  return (
    <>
      {logo?.src ? (
        <img
          className={styles.logo}
          src={interpolateUrl(logo.src)}
          alt={logo.alt}
          width={Math.min( logoWidth, maxWidth)} // Adjusted width logic
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
