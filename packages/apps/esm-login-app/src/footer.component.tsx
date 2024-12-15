import React from 'react';
import { useConfig, ArrowRightIcon } from '@openmrs/esm-framework';
import { Tile, Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { type ConfigSchema } from './config-schema';
import styles from './login/login.scss';

const Footer: React.FC = () => {
  const {t} = useTranslation();
  const config = useConfig<ConfigSchema>();
  const logos = config.footer.additionalLogos || [];

  return (
    <div className={styles.footer}>
      <Tile className={styles.poweredByTile}>
        <div className={styles.poweredByContainer}>
          <span className={styles.poweredByText}>{t('builtWith', 'Built with')}</span>
            <svg role="img" className={styles.poweredByLogo}>
              <use href="#omrs-logo-full-color"></use>
            </svg>
          <span className={styles.poweredByText}>
            {t('poweredBySubtext', 'An open-source medical record system and global community')}
          </span>
          <Button
            className={styles.learnMore}
            iconDescription={t('learnMore', 'Learn More')}
            kind="ghost"
            onClick={() => window.open('https://openmrs.org', '_blank')}
            renderIcon={(props) => <ArrowRightIcon {...props} size={20} className={styles.arrowRightIcon}/>}
          >
            <span>{t('learnMore', 'Learn More')}</span>
          </Button>
        </div>
      </Tile>

      <div className={styles.logosContainer}>
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