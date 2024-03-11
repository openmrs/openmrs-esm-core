import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, SwitcherItem } from '@carbon/react';
import { navigate } from '@openmrs/esm-framework';
import styles from './logout.scss';

export interface LogoutProps {}

const Logout: React.FC<LogoutProps> = () => {
  const { t } = useTranslation();
  const logout = useCallback(() => {
    navigate({ to: '${openmrsSpaBase}/logout' });
  }, []);

  return (
    <SwitcherItem aria-label={t('Logout', 'Logout')}>
      <Button className={styles.logout} onClick={logout} kind="ghost">
        {t('Logout', 'Logout')}
      </Button>
    </SwitcherItem>
  );
};

export default Logout;
