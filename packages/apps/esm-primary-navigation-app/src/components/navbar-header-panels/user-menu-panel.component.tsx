import React from 'react';
import { HeaderPanel, Switcher, SwitcherDivider } from '@carbon/react';
import { ExtensionSlot, useOnClickOutside } from '@openmrs/esm-framework';
import styles from './user-menu-panel.scss';

interface UserMenuPanelProps extends HeaderPanelProps {
  expanded: boolean;
  hidePanel: Parameters<typeof useOnClickOutside>[0];
}

/**
 * Extensions attaching to `user-panel-slot` or `user-panel-bottom-slot` should in
 * general be wrapped in the `SwitcherItem` Carbon component.
 */
const UserMenuPanel: React.FC<UserMenuPanelProps> = ({ expanded, hidePanel }) => {
  const userMenuRef = useOnClickOutside(hidePanel, expanded);

  return (
    <HeaderPanel ref={userMenuRef} className={styles.headerPanel} expanded={expanded} aria-label="User Menu">
      <Switcher className={styles.userPanelSwitcher} aria-label="User Menu Options">
        <ExtensionSlot className={styles.fullWidth} name="user-panel-slot" />
        <SwitcherDivider className={styles.divider} aria-hidden="true" />
        <ExtensionSlot className={styles.fullWidth} name="user-panel-bottom-slot" />
      </Switcher>
    </HeaderPanel>
  );
};

export default UserMenuPanel;
