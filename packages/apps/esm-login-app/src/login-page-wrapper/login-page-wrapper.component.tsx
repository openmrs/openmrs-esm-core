import React, { useMemo } from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { InlineNotification, Tile } from '@carbon/react';
import { useConfig, interpolateUrl, getCoreTranslation } from '@openmrs/esm-framework';
import type { ConfigSchema } from '../config-schema';
import Logo from '../logo.component';
import Footer from '../footer.component';
import styles from './login-page-wrapper.scss';

interface LoginPageWrapperProps {
  children: React.ReactNode;
  errorMessage?: string;
  onClearError?: () => void;
}

const LoginPageWrapper: React.FC<LoginPageWrapperProps> = ({ children, onClearError, errorMessage }) => {
  const { t } = useTranslation();
  const { announcements = [], background = { image: '', color: '' } } = useConfig<ConfigSchema>();

  const containerClassName = classnames(styles.container, {
    [styles.containerWithImage]: !!background.image,
    [styles.containerWithColor]: !background.image && !!background.color,
  });

  const containerStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (background.image) {
      return { '--login-bg-image': `url(${interpolateUrl(background.image)})` } as React.CSSProperties;
    }
    if (background.color) {
      return { '--login-bg-color': background.color } as React.CSSProperties;
    }
    return undefined;
  }, [background]);

  return (
    <div className={containerClassName} style={containerStyle} data-testid="login-container">
      {announcements.length > 0 && (
        <div className={styles.announcements}>
          {announcements.map((announcement, i) => (
            <InlineNotification
              key={i}
              kind={announcement.kind}
              title={announcement.title ? t(announcement.title) : ''}
              subtitle={t(announcement.text)}
              lowContrast
              hideCloseButton
            />
          ))}
        </div>
      )}

      <Tile className={styles.loginCard}>
        {errorMessage && (
          <div className={styles.errorMessage}>
            <InlineNotification
              kind="error"
              subtitle={t(errorMessage)}
              title={getCoreTranslation('error')}
              onClick={onClearError}
            />
          </div>
        )}

        <div className={styles.center}>
          <Logo t={t} />
        </div>
        {children}
      </Tile>

      <Footer />
    </div>
  );
};

export default LoginPageWrapper;
