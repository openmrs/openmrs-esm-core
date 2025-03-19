import { HeaderGlobalAction } from '@carbon/react';
import { CloseIcon, useAssignedExtensions, UserAvatarIcon } from '@openmrs/esm-framework';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import styles from './navbar.scss';
import { useTranslation } from 'react-i18next';
import UserMenuPanel from '../navbar-header-panels/user-menu-panel.component';
import { type MenuButtonProps } from './types';

/**
 * This component displays the user menu button and the menu itself (when toggled on)
 */
const UserMenuButton: React.FC<MenuButtonProps> = ({ isActivePanel, togglePanel, hidePanel }) => {
  const userMenuItems = useAssignedExtensions('user-panel-slot');
  const showUserMenu = useMemo(() => userMenuItems.length > 0, [userMenuItems.length]);
  const { t } = useTranslation();

  return (
    showUserMenu && (
      <>
        <HeaderGlobalAction
          aria-label={t('userMenuTooltip', 'My Account')}
          aria-labelledby="Users Avatar Icon"
          className={classNames({
            [styles.headerGlobalBarButton]: isActivePanel('userMenu'),
            [styles.activePanel]: !isActivePanel('userMenu'),
          })}
          enterDelayMs={500}
          name="User"
          isActive={isActivePanel('userMenu')}
          onClick={() => {
            togglePanel('userMenu');
          }}
        >
          {isActivePanel('userMenu') ? <CloseIcon size={20} /> : <UserAvatarIcon size={20} />}
        </HeaderGlobalAction>
        <UserMenuPanel expanded={isActivePanel('userMenu')} hidePanel={hidePanel('userMenu')} />
      </>
    )
  );
};

export default UserMenuButton;
