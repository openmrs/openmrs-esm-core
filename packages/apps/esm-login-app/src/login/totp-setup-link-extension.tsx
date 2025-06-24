import { HeaderGlobalAction } from '@carbon/react';
import { navigate, useSession } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './totp-setup-link.scss';
import { TwoFactorAuthentication } from '@carbon/react/icons';

const TotpSetupLink: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();

  const setupTotp = () => {
    navigate({
      to: `\${openmrsSpaBase}/totp-setup?returnToUrl=${window.location.pathname}`,
    });
  };

  return (
    <HeaderGlobalAction aria-label={t('setupMfa', 'Setup 2FA')} className={styles.setupMfaButton} onClick={setupTotp}>
      <TwoFactorAuthentication size={20} />
      <span className={styles.setupMfaText}>{t('setupMfa', 'Setup 2FA')}</span>
    </HeaderGlobalAction>
  );
};

export default TotpSetupLink;
