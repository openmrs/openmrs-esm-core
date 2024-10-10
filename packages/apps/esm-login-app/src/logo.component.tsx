import React from 'react';
import { interpolateUrl, useConfig } from '@openmrs/esm-framework';
import { type TFunction } from 'react-i18next';
import { type ConfigSchema } from './config-schema';
import styles from './login/login.scss';

const Logo: React.FC<{ t: TFunction }> = ({ t }) => {
  const { logo } = useConfig<ConfigSchema>();
  return logo.src ? (
    <img
      alt={logo.alt ? t(logo.alt) : t('openmrsLogo', 'OpenMRS logo')}
      className={styles.logoImg}
      src={interpolateUrl(logo.src)}
    />
  ) : (
    <svg role="img" className={styles.logo}>
      <title>{t('openmrsLogo', 'OpenMRS logo')}</title>
      <use href="#omrs-logo-full-color"></use>
    </svg> 
  );
};

export default Logo;
