import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { UserAvatarIcon, navigate, showModal, useSession } from '@openmrs/esm-framework';
import { Button, SwitcherItem } from '@carbon/react';
import styles from './change-password.scss';

const ChangePasswordLink: React.FC = () => {
  const { t } = useTranslation();

  const launchChangePasswordModal = useCallback(() => showModal('change-password-modal'), []);

  return (
    <SwitcherItem aria-label="Change Password" className={styles.panelItemContainer}>
      <div>
        <UserAvatarIcon size={20} />
        <p>Password</p>
      </div>
      <Button kind="ghost" onClick={launchChangePasswordModal}>
        {t('change', 'Change')}
      </Button>
    </SwitcherItem>
  );
};

export default ChangePasswordLink;
