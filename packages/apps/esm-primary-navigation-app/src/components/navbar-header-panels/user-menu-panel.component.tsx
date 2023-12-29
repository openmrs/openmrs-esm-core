import React from 'react';
import type { LoggedInUser, Session } from '@openmrs/esm-framework';
import { ExtensionSlot, useOnClickOutside } from '@openmrs/esm-framework';
import type { HeaderPanelProps } from '@carbon/react';
import { HeaderPanel } from '@carbon/react';
import styles from '../../root.scss';

interface UserMenuPanelProps extends HeaderPanelProps {
  expanded: boolean;
  onLogout(): void;
  hidePanel: () => void;
}

const UserMenuPanel: React.FC<UserMenuPanelProps> = ({ expanded, onLogout, hidePanel }) => {
  const userMenuRef = useOnClickOutside<HTMLDivElement>(hidePanel, expanded);

  return (
    <HeaderPanel
      ref={userMenuRef as any}
      className={styles.headerPanel}
      expanded={expanded}
      aria-label="Location"
      aria-labelledby="Location Icon"
    >
      <ExtensionSlot
        name="user-panel-slot"
        state={{
          onLogout: onLogout,
        }}
      />
      <ExtensionSlot name="user-panel-actions-slot" />
    </HeaderPanel>
  );
};

export default UserMenuPanel;
