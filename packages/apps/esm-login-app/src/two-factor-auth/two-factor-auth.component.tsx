import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tile, Tag } from '@carbon/react';
import {
  PageHeader,
  PageHeaderContent,
  ServiceQueuesPictogram,
  useConfig,
  showModal,
  MobileCheckIcon,
  useSession,
} from '@openmrs/esm-framework';
import type { ConfigSchema } from '../config-schema';
import styles from './two-factor-auth.scss';

interface TwoFactorAuthProps {
  title?: string | JSX.Element;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ title }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigSchema>();
  const { dashboardTitle } = config.twoFactorAuth;
  const session = useSession();

  const userProperties = session.user?.userProperties;
  const secondaryAuthTypes = userProperties?.['authentication.secondaryType'] || '';
  const isTotpEnabled = secondaryAuthTypes.includes('totp');

  const launchTotpModal = React.useCallback(() => {
    const dispose = showModal('totp-enrollment-modal', {
      closeModal: () => dispose(),
      size: 'sm',
    });
  }, []);

  return (
    <div>
      <PageHeader className={styles.header}>
        <PageHeaderContent
          title={title ? title : t(dashboardTitle.key, dashboardTitle.value)}
          illustration={<ServiceQueuesPictogram />}
        />
      </PageHeader>

      <main className={styles.pageContainer}>
        <div className={styles.mainCard}>
          <div className={styles.descriptionText}>
            <h3>{t('protectAccountTitle', 'Protect your account with an extra verification step.')}</h3>
            <p>
              {t(
                'protectAccountDescription',
                'After signing in with your password, you will verify your identity using a second method.',
              )}
            </p>
            <p>{t('protectAccountReason', 'This helps keep your account secure.')}</p>
          </div>
          <Tile className={styles.methodTile}>
            <div className={styles.iconContainer}>
              <MobileCheckIcon size={34} />
            </div>
            <div className={styles.textContainer}>
              <div className={styles.titleRow}>
                <h4>{t('authenticatorApp', 'Authenticator App')}</h4>
                {isTotpEnabled && (
                  <Tag type="green" size="sm">
                    {t('enabled', 'Enabled')}
                  </Tag>
                )}
              </div>
              <p>{t('authenticatorAppDescription', 'Use an authentication app to generate one-time codes')}</p>
            </div>
            <div>
              {isTotpEnabled ? (
                <Button kind="danger--ghost">{t('remove', 'Remove')}</Button>
              ) : (
                <Button kind="ghost" onClick={launchTotpModal}>
                  {t('setup', 'Setup')}
                </Button>
              )}
            </div>
          </Tile>
        </div>
      </main>
    </div>
  );
};

export default TwoFactorAuth;
