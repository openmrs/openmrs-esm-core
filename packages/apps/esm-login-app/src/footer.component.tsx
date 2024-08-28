import React from 'react';
import { interpolateUrl, useConfig } from '@openmrs/esm-framework';
import { type TFunction } from 'react-i18next';
import { type ConfigSchema } from './config-schema';
import styles from './login/login.scss';

const Footer: React.FC<{ t: TFunction }> = ({ t }) => {
  const config = useConfig<ConfigSchema>();
  const logos = config.footer.logos || [];

  return (
    <div className={styles.footer}>
      <p className={styles.poweredByTxt}>{t('poweredBy', 'Powered by')}</p>
      <div className={styles.logosContainer}>
        <svg role="img" className={styles.poweredByLogo}>
          <use href="#omrs-logo-full-color"></use>
        </svg>
        {logos.map((logo, index) => (
          <img
            alt={logo.alt ? t(logo.alt) : t('poweredByLogo', 'Powered By Logo')}
            className={styles.poweredByLogo}
            src={interpolateUrl(logo.src)}
          />
        ))}
      </div>
    </div>
  );
};

export default Footer;