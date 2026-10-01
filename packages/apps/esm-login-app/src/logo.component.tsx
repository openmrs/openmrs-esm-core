import React from 'react';
import { interpolateUrl, type StyleguideConfigObject, useConfig } from '@openmrs/esm-framework';
import { type TFunction } from 'i18next';
import { type ConfigSchema } from './config-schema';
import styles from './login/login.scss';

const Logo: React.FC<{ t: TFunction }> = ({ t }) => {
  const { logo: loginLogo } = useConfig<ConfigSchema>();
  const { logo: styleguideLogo } = useConfig<StyleguideConfigObject>({ externalModuleName: '@openmrs/esm-styleguide' });
  const logo = loginLogo?.src ? loginLogo : styleguideLogo;

  return logo?.src ? (
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
