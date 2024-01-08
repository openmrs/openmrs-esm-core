import React from 'react';
import { UserAvatarFilledAlt } from '@carbon/react/icons';
import { SwitcherItem } from '@carbon/react';
import { useSession } from '@openmrs/esm-framework';

const UserPanelSwitcher: React.FC = () => {
  const session = useSession();
  return (
    <SwitcherItem aria-label="User">
      <UserAvatarFilledAlt size={20} />
      <p>{session?.user?.person?.display}</p>
    </SwitcherItem>
  );
};

export default UserPanelSwitcher;
