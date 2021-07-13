import React from "react";
import UserAvatarFilledAlt20 from "@carbon/icons-react/es/user--avatar--filled--alt/20";
import Switcher from "carbon-components-react/lib/components/UIShell/Switcher";
import SwitcherDivider from "carbon-components-react/lib/components/UIShell/SwitcherDivider";
import styles from "./user-panel-switcher.component.scss";
import Logout from "../logout/logout.component";
import { LoggedInUser } from "@openmrs/esm-framework";

export interface UserPanelSwitcherItemProps {
  user: LoggedInUser;
  isLogoutEnabled: boolean;
}

const UserPanelSwitcher: React.FC<UserPanelSwitcherItemProps> = ({
  user,
  isLogoutEnabled,
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
          <Logout />
        </Switcher>
      </>
    )}
  </div>
);

export default UserPanelSwitcher;
