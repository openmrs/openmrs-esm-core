import React from 'react';
import { Switcher } from '@carbon/react';
import { UserAvatarFilledAlt } from '@carbon/react/icons';
import { useSession, type LoggedInUser } from '@openmrs/esm-framework';
import styles from './user-panel-switcher.scss';

const UserPanelSwitcher: React.FC = () => {
  const session = useSession();
  const user = session?.user;
  return (
    <div className={styles.switcherContainer}>
      <Switcher aria-label="Switcher Container">
        <UserAvatarFilledAlt size={20} />
        <p>{user.person.display}</p>
      </Switcher>
    </div>
  );
};

export default UserPanelSwitcher;
