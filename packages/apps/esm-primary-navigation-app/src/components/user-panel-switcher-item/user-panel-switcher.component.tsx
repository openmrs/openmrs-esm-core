import React from "react";
import UserAvatarFilledAlt20 from "@carbon/icons-react/es/user--avatar--filled--alt/20";
import Switcher from "carbon-components-react/es/components/UIShell/Switcher";
import SwitcherDivider from "carbon-components-react/es/components/UIShell/SwitcherDivider";
import styles from "./user-panel-switcher.component.scss";
import Logout from "../logout/logout.component";
import { LoggedInUser } from "@openmrs/esm-framework";

export interface UserPanelSwitcherItemProps {
  user: LoggedInUser;
  isLogoutEnabled: boolean;
  onLogout(): void;
}

const UserPanelSwitcher: React.FC<UserPanelSwitcherItemProps> = ({
  user,
  isLogoutEnabled,
  onLogout,
}) => (
  <div className={styles.switcherContainer}>
    <Switcher aria-label="Switcher Container">
      <UserAvatarFilledAlt20 />
      <p>{user.person.display}</p>
    </Switcher>
    {isLogoutEnabled && (
      <>
        <SwitcherDivider className={styles.divider} />
        <Switcher aria-label="Switcher Container">
          <Logout onLogout={onLogout} />
        </Switcher>
      </>
    )}
  </div>
);

export default UserPanelSwitcher;
