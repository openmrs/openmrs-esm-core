import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderPanel, type HeaderPanelProps, Switcher, SwitcherDivider } from '@carbon/react';
import { ExtensionSlot } from '@openmrs/esm-framework';
import styles from './user-menu-panel.scss';

interface UserMenuPanelProps extends HeaderPanelProps {
  expanded: boolean;
  hidePanel: () => void;
}

/**
 * Extensions attaching to `user-panel-slot` or `user-panel-bottom-slot` should in
 * general be wrapped in the `SwitcherItem` Carbon component.
 */
const UserMenuPanel: React.FC<UserMenuPanelProps> = ({ expanded, hidePanel }) => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'inline' }}>
      <HeaderPanel className={styles.headerPanel} expanded={expanded} aria-label={t('userMenu', 'User menu')}>
        <Switcher className={styles.userPanelSwitcher} aria-label={t('userMenuOptions', 'User menu options')}>
          <ExtensionSlot className={styles.fullWidth} name="user-panel-slot" />
          <SwitcherDivider className={styles.divider} aria-hidden="true" />
          <ExtensionSlot className={styles.fullWidth} name="user-panel-bottom-slot" />
        </Switcher>
      </HeaderPanel>
    </div>
  );
};

export default UserMenuPanel;
