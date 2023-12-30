import React from 'react';
import { Switcher } from '@carbon/react';
import { UserAvatarFilledAlt } from '@carbon/react/icons';
import { useSession, type LoggedInUser } from '@openmrs/esm-framework';
import styles from './user-panel-switcher.scss';
import { SwitcherItem } from '@carbon/react';

const UserPanelSwitcher: React.FC = () => {
  const session = useSession();
  const user = session?.user;
  return (
    <SwitcherItem aria-label="User">
      <UserAvatarFilledAlt size={20} />
      <p>{user.person.display}</p>
    </SwitcherItem>
  );
};

export default UserPanelSwitcher;
