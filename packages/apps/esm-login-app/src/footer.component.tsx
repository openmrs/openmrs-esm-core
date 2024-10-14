import React from 'react';
import { interpolateUrl, useConfig } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { type ConfigSchema } from './config-schema';
import styles from './login/login.scss';

const Footer: React.FC = () => {
  const {t} = useTranslation();
  const config = useConfig<ConfigSchema>();
  const logos = config.footer.additionalLogos || [];

  return (
    <div className={styles.footer}>
      <p className={styles.poweredByTxt}>{t('poweredBy', 'Powered by')}</p>
      <div className={styles.logosContainer}>
        <svg role="img" className={styles.poweredByLogo}>
          <use href="#omrs-logo-partial-mono"></use>
        </svg>
        {logos.map((logo, index) => (
          <img
            key={index}
            alt={logo.alt ? t(logo.alt) : t('footerlogo', 'Footer Logo')}
            className={styles.poweredByLogo}
            src={logo.src}
          />
        ))}
      </div>
    </div>
  );
};

export default Footer;