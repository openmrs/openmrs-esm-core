import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@openmrs/esm-framework';
import { type ConfigSchema } from './config-schema';
import styles from './footer.scss';

interface Logo {
  src: string;
  alt?: string;
}

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const config = useConfig<ConfigSchema>();
  const logos: Logo[] = config.footer.additionalLogos || [];

  const handleImageLoadError = useCallback((error: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Failed to load image', error);
  }, []);

  return (
    <div className={styles.footer}>
      <div className={styles.logosContainer}>
        {logos.map((logo) => (
          <img
            alt={logo.alt ? t(logo.alt) : t('footerlogo', 'Footer Logo')}
            className={styles.poweredByLogo}
            key={logo.src}
            onError={handleImageLoadError}
            src={logo.src}
          />
        ))}
      </div>
    </div>
  );
};

export default Footer;
