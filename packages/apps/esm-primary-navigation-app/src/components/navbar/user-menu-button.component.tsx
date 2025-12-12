import { HeaderGlobalAction } from '@carbon/react';
import { CloseIcon, useAssignedExtensions, UserAvatarIcon, useOnClickOutside } from '@openmrs/esm-framework';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import UserMenuPanel from '../navbar-header-panels/user-menu-panel.component';
import { type MenuButtonProps } from './types';
import styles from './navbar.scss';

/**
 * This component displays the user menu button and the menu itself (when toggled on)
 */
const UserMenuButton: React.FC<MenuButtonProps> = ({ isActivePanel, togglePanel, hidePanel }) => {
  const userMenuItems = useAssignedExtensions('user-panel-slot');
  const showUserMenu = useMemo(() => userMenuItems.length > 0, [userMenuItems.length]);
  const { t } = useTranslation();
  const userMenuRef = useOnClickOutside<HTMLDivElement>(hidePanel('userMenu'), isActivePanel('userMenu'));

  return (
    showUserMenu && (
      <div ref={userMenuRef} className={styles.panelWrapper}>
        <HeaderGlobalAction
          aria-label={t('userMenuTooltip', 'My Account')}
          aria-labelledby="Users Avatar Icon"
          className={classNames({
            [styles.headerGlobalBarButton]: isActivePanel('userMenu'),
            [styles.activePanel]: !isActivePanel('userMenu'),
          })}
          // @ts-ignore - `name` is not a valid prop for the HeaderGlobalAction component, but we need the name prop for user onboarding app to work correctly
          name="User"
          isActive={isActivePanel('userMenu')}
          onClick={() => {
            togglePanel('userMenu');
          }}
        >
          {isActivePanel('userMenu') ? <CloseIcon size={20} /> : <UserAvatarIcon size={20} />}
        </HeaderGlobalAction>
        <UserMenuPanel expanded={isActivePanel('userMenu')} hidePanel={hidePanel('userMenu')} />
      </div>
    )
  );
};

export default UserMenuButton;
