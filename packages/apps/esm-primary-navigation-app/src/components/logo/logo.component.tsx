import React from 'react';
import { interpolateUrl, useConfig } from '@openmrs/esm-framework';
import styles from './logo.scss';

const Logo: React.FC = () => {
  const { logo } = useConfig();

    const logoWidth = 110; //default width for the omrs logo

  return (
    <>
      {logo?.src ? (
        <img
          className={styles.logo}
          src={interpolateUrl(logo.src)}
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
