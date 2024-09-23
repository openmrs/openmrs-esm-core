import React from 'react';
import { SwitcherItem } from '@carbon/react';
import { UserAvatarIcon, useSession } from '@openmrs/esm-framework';

const UserPanelSwitcher: React.FC = () => {
  const session = useSession();
  return (
    <SwitcherItem aria-label="User">
      <UserAvatarIcon size={20} />
      <p>{session?.user?.person?.display}</p>
    </SwitcherItem>
  );
};

export default UserPanelSwitcher;
