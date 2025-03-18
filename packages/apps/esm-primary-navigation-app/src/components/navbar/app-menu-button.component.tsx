import { HeaderGlobalAction } from '@carbon/react';
import { CloseIcon, SwitcherIcon, useAssignedExtensions } from '@openmrs/esm-framework';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AppMenuPanel from '../navbar-header-panels/app-menu-panel.component';
import styles from './navbar.scss';
import { type MenuButtonProps } from './navbar.resources';

/**
 * This component displays the app menu button and the menu itself (when toggled on)
 */
const AppMenuButton: React.FC<MenuButtonProps> = ({ isActivePanel, togglePanel, hidePanel }) => {
  const appMenuItems = useAssignedExtensions('app-menu-slot');
  const showAppMenu = useMemo(() => appMenuItems.length > 0, [appMenuItems.length]);
  const { t } = useTranslation();

  return (
    showAppMenu && (
      <>
        <HeaderGlobalAction
          aria-label={t('AppMenuTooltip', 'App Menu')}
          aria-labelledby="App Menu"
          className={classNames({
            [styles.headerGlobalBarButton]: isActivePanel('appMenu'),
            [styles.activePanel]: !isActivePanel('appMenu'),
          })}
          enterDelayMs={500}
          isActive={isActivePanel('appMenu')}
          tooltipAlignment="end"
          onClick={() => {
            togglePanel('appMenu');
          }}
        >
          {isActivePanel('appMenu') ? <CloseIcon size={20} /> : <SwitcherIcon size={20} />}
        </HeaderGlobalAction>
        <AppMenuPanel expanded={isActivePanel('appMenu')} hidePanel={hidePanel('appMenu')} />
      </>
    )
  );
};

export default AppMenuButton;
