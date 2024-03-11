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
    <HeaderPanel
      ref={userMenuRef}
      className={styles.headerPanel}
      expanded={expanded}
      aria-label="Location"
      aria-labelledby="Location Icon"
    >
      <Switcher className={styles.userPanelSwitcher} aria-label="Switcher Container">
        <ExtensionSlot className={styles.fullWidth} name="user-panel-slot" />
        <SwitcherDivider className={styles.divider} />
        <ExtensionSlot className={styles.fullWidth} name="user-panel-bottom-slot" />
      </Switcher>
    </HeaderPanel>
  );
};

export default UserMenuPanel;
