import React from "react";
import {
  ExtensionSlot,
  LoggedInUser,
  CurrentUserSession,
} from "@openmrs/esm-framework";
import { HeaderPanel } from "carbon-components-react/es/components/UIShell";
import { HeaderPanelProps } from "carbon-components-react";
import styles from "../../root.scss";

interface UserMenuPanelProps extends HeaderPanelProps {
  user: LoggedInUser;
  allowedLocales: Array<string>;
  session: CurrentUserSession;
}

const UserMenuPanel: React.FC<UserMenuPanelProps> = ({
  expanded,
  user,
  allowedLocales,
  session,
}) => {
  return (
    <HeaderPanel
      className={styles.headerPanel}
      expanded={expanded}
      aria-label="Location"
      aria-labelledby="Location Icon"
    >
      <ExtensionSlot
        extensionSlotName="user-panel-slot"
        state={{
          user,
          allowedLocales,
          referer: window.location.pathname,
          currentLocation: session?.location?.display,
        }}
      />
    </HeaderPanel>
  );
};

export default UserMenuPanel;
