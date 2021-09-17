import React from "react";
import UserAvatarFilledAlt20 from "@carbon/icons-react/es/user--avatar--filled--alt/20";
import styles from "./user-panel-switcher.component.scss";
import { Switcher } from "carbon-components-react";
import { ExtensionSlot, LoggedInUser } from "@openmrs/esm-framework";

export interface UserPanelSwitcherItemProps {
  user: LoggedInUser;
}

const UserPanelSwitcher: React.FC<UserPanelSwitcherItemProps> = ({ user }) => (
  <div className={styles.switcherContainer}>
    <Switcher aria-label="Switcher Container">
      <UserAvatarFilledAlt20 />
      <p>{user.person.display}</p>
    </Switcher>
    <ExtensionSlot extensionSlotName="user-panel-actions-slot" />
  </div>
);

export default UserPanelSwitcher;
