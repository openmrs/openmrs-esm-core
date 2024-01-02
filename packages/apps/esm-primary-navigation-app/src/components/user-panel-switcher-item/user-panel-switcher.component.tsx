import React from 'react';
import { Switcher } from '@carbon/react';
import { UserAvatarFilledAlt } from '@carbon/react/icons';
import type { LoggedInUser } from '@openmrs/esm-framework';
import styles from './user-panel-switcher.scss';
import { PatientName } from '@openmrs/esm-framework';

export interface UserPanelSwitcherItemProps {
  user: LoggedInUser;
}

const UserPanelSwitcher: React.FC<UserPanelSwitcherItemProps> = ({ user }) => (
  <div className={styles.switcherContainer}>
    <Switcher aria-label="Switcher Container">
      <UserAvatarFilledAlt size={20} />
      <p>
        <PatientName patientUuid={user?.person?.uuid} />
      </p>
    </Switcher>
  </div>
);

export default UserPanelSwitcher;
