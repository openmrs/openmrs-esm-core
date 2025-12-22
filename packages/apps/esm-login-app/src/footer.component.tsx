import React, { useCallback } from 'react';
import { Link, Tile } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useConfig, ArrowRightIcon } from '@openmrs/esm-framework';
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
      <Tile className={styles.poweredByTile}>
        <div className={styles.poweredByContainer}>
          <span className={styles.poweredByText}>{t('builtWith', 'Built with')}</span>
          <svg aria-label={t('openmrsLogo', 'OpenMRS Logo')} className={styles.poweredByLogo} role="img">
            <use href="#omrs-logo-full-color"></use>
          </svg>
          <span className={`${styles.poweredByText} ${styles.poweredBySubtext}`}>
            {t('poweredBySubtext', 'An open-source medical record system and global community')}
          </span>
          <Link
            className={styles.learnMoreButton}
            href="https://openmrs.org"
            rel="noopener noreferrer"
            renderIcon={() => <ArrowRightIcon size={16} aria-label="Arrow right icon" />}
            target="_blank"
          >
            {t('learnMore', 'Learn more')}
          </Link>
        </div>
      </Tile>

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
