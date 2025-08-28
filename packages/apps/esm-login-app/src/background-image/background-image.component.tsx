import React from 'react';
import { interpolateUrl, useConfig } from '@openmrs/esm-framework';
import { type TFunction } from 'react-i18next';
import styles from '../login/login.scss';
import { type ConfigSchema } from '../config-schema';

const BackgroundImage: React.FC<{ t: TFunction }> = ({ t }) => {
  const { backgroundImage, badgeLogo } = useConfig<ConfigSchema>();

  return (
    <>
      {backgroundImage?.src ? (
        <>
          <img
            alt={backgroundImage.alt ? t(backgroundImage.alt) : t('backgroundImageAlt', 'Background image')}
            className={styles.backgroundImage}
            src={interpolateUrl(backgroundImage.src)}
          />
          <div className={styles.imageOverlay}></div>
        </>
      ) : (
        <div className={styles.imageOverlay} style={{ backgroundColor: 'rgba(128, 128, 128, 0.5)' }}></div>
      )}

      {badgeLogo?.src && (
        <div className={styles.floatingBadge}>
          <img
            alt={badgeLogo.alt ? t(badgeLogo.alt) : t('badgeLogoAlt', 'Badge logo')}
            className={styles.badgeLogo}
            src={interpolateUrl(badgeLogo.src)}
          />
        </div>
      )}
    </>
  );
};

export default BackgroundImage;
