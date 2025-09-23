import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tile } from '@carbon/react';
import { useConfig } from '@openmrs/esm-framework';
import { type ConfigSchema } from '../config-schema';
import styles from './custom-content.scss';

interface CustomContentProps {
  position: 'top' | 'bottom' | 'side' | 'footer' | 'sidebar';
}

const CustomContent: React.FC<CustomContentProps> = ({ position }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigSchema>();

  const renderWelcomeMessage = () => {
    const { welcome } = config.customContent;

    if (!welcome.enabled || welcome.position !== position) {
      return null;
    }

    return (
      <Tile className={styles.welcomeMessage}>
        {welcome.title && <h2 className={styles.welcomeTitle}>{t(welcome.title)}</h2>}
        {welcome.message && (
          <div
            className={styles.welcomeContent}
            dangerouslySetInnerHTML={{
              __html: t(welcome.message),
            }}
          />
        )}
      </Tile>
    );
  };

  const renderDisclaimer = () => {
    const { disclaimer } = config.customContent;

    if (!disclaimer.enabled || disclaimer.position !== position) {
      return null;
    }

    return (
      <div className={styles.disclaimer}>
        <div
          className={styles.disclaimerContent}
          dangerouslySetInnerHTML={{
            __html: t(disclaimer.text),
          }}
        />
      </div>
    );
  };

  const welcomeContent = renderWelcomeMessage();
  const disclaimerContent = renderDisclaimer();

  if (!welcomeContent && !disclaimerContent) {
    return null;
  }

  return (
    <div className={`${styles.customContentContainer} ${styles[`position-${position}`]}`}>
      {welcomeContent}
      {disclaimerContent}
    </div>
  );
};

export default CustomContent;
