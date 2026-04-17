import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, SwitcherItem } from '@carbon/react';
import { navigate } from '@openmrs/esm-framework';
import styles from './logout.scss';

const Logout: React.FC = () => {
  const { t } = useTranslation();

  const handleLogout = useCallback(() => {
    navigate({ to: '${openmrsSpaBase}/logout' });
  }, []);

  return (
    <SwitcherItem aria-label={t('logout', 'Logout')}>
      <Button className={styles.logout} onClick={handleLogout} kind="ghost">
        {t('logout', 'Logout')}
      </Button>
    </SwitcherItem>
  );
};

export default Logout;
