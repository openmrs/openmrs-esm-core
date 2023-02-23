import React from "react";
import {
  ExtensionSlot,
  LoggedInUser,
  useOnClickOutside,
} from "@openmrs/esm-framework";
import { HeaderPanel, HeaderPanelProps } from "@carbon/react";
import { UserSession } from "../../types";
import styles from "../../root.scss";

interface UserMenuPanelProps extends HeaderPanelProps {
  expanded: boolean;
  user: LoggedInUser | false | null;
  allowedLocales: any;
  onLogout(): void;
  session: UserSession;
  hidePanel: () => void;
}

const UserMenuPanel: React.FC<UserMenuPanelProps> = ({
  expanded,
  user,
  allowedLocales,
  onLogout,
  session,
  hidePanel,
}) => {
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
          user: user,
          allowedLocales: allowedLocales,
          onLogout: onLogout,
          referer: window.location.pathname,
          currentLocation: session?.sessionLocation?.display,
        }}
      />
    </HeaderPanel>
  );
};

export default UserMenuPanel;
