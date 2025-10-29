import React, { useCallback } from 'react';
import { Tile } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@openmrs/esm-framework';
import styles from './footer.scss';
import { type ConfigSchema } from '../config-schema';

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
      {logos.length > 0 && (
        <div className={styles.leftSection}>
          <Tile className={styles.poweredByTile}>
            <div className={styles.poweredByContainer}>
              <div className={styles.logosContainer}>
                {logos.map((logo, index) => (
                  <React.Fragment key={logo.src}>
                    <img
                      alt={logo.alt ? t(logo.alt) : t('footerlogo', 'Footer Logo')}
                      className={styles.poweredByLogo}
                      onError={handleImageLoadError}
                      src={logo.src}
                    />
                    {index < logos.length - 1 && <div className={styles.divider} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </Tile>
        </div>
      )}

      <div className={styles.centerSection}>
        <Tile className={styles.copyrightTile}>
          <div className={styles.openmrsContainer}>
            <svg
              aria-label={t('openmrsLogo', 'OpenMRS Logo')}
              className={styles.openmrsLogo}
              role="img"
              viewBox="0 0 200 40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <use xlinkHref="#omrs-logo-full-color"></use>
            </svg>
          </div>
        </Tile>
      </div>
    </div>
  );
};

export default Footer;
