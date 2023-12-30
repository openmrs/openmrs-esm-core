import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { navigate } from '@openmrs/esm-framework';
import styles from './logout.scss';
import { SwitcherItem } from '@carbon/react';

export interface LogoutProps {}

const Logout: React.FC<LogoutProps> = () => {
  const { t } = useTranslation();
  const logout = useCallback(() => {
    navigate({ to: '${openmrsSpaBase}/logout' });
  }, []);

  return (
    <SwitcherItem>
      <Button className={styles.logout} onClick={logout} aria-labelledby="Logout" kind="ghost">
        {t('Logout', 'Logout')}
      </Button>
    </SwitcherItem>
  );
};

export default Logout;
