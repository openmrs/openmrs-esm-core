import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, SwitcherItem } from '@carbon/react';
import { PasswordIcon, showModal } from '@openmrs/esm-framework';
import styles from './change-password.scss';

const ChangePasswordLink: React.FC = () => {
  const { t } = useTranslation();

  const launchChangePasswordModal = useCallback(() => {
    const dispose = showModal('change-password-modal', {
      closeModal: () => dispose(),
      size: 'sm',
    });
  }, []);  

  return (
    <SwitcherItem aria-label={t('changePassword', 'ChangePassword')} className={styles.panelItemContainer}>
      <div>
        <PasswordIcon size={20} />
        <p>{t('password', 'Password')}</p>
      </div>
      <Button kind="ghost" onClick={launchChangePasswordModal}>
        {t('change', 'Change')}
      </Button>
    </SwitcherItem>
  );
};

export default ChangePasswordLink;
