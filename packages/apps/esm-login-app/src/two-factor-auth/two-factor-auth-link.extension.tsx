import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, SwitcherItem } from '@carbon/react';
import { TwoFactorAuthenticationIcon, navigate as openmrsNavigate, useConfig } from '@openmrs/esm-framework';
import type { ConfigSchema } from '../config-schema';
import styles from './two-factor-auth.scss';

const TwoFactorAuthLink: React.FC = () => {
  const { t } = useTranslation();
  const config = useConfig<ConfigSchema>();

  if (!config.twoFactorAuth.enabled) {
    return null;
  }

  const handle2faSetupClick = () => {
    // Navigate to the Two Factor Authentication Page
    openmrsNavigate({ to: '${openmrsSpaBase}/two-factor-auth' });
    // Simulate a mouse click outside the user menu to close it after navigation.
    // This is a workaround for the issue where the user menu remains open after navigation.
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  };

  return (
    <SwitcherItem aria-label={t('twoFactorAuth', 'Two-Factor Authentication')}>
      <div>
        <TwoFactorAuthenticationIcon size={20} />
      </div>
      <Button kind="ghost" onClick={handle2faSetupClick} className={styles.menuItemButton}>
        <span>{t('twoFactorAuth', 'Two-Factor Authentication')}</span>
      </Button>
    </SwitcherItem>
  );
};

export default TwoFactorAuthLink;
