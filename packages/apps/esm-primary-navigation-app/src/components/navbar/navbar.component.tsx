import { Header, HeaderContainer, HeaderGlobalBar, HeaderMenuButton } from '@carbon/react';
import {
  ConfigurableLink,
  ExtensionSlot,
  useAssignedExtensions,
  useConfig,
  useLayoutType,
  useLeftNavStore,
  useSession,
} from '@openmrs/esm-framework';
import React, { useCallback, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isDesktop } from '../../utils';
import Logo from '../logo/logo.component';
import NotificationsMenuPanel from '../navbar-header-panels/notifications-menu-panel.component';
import SideMenuPanel from '../navbar-header-panels/side-menu-panel.component';
import styles from './navbar.scss';

const HeaderItems: React.FC = () => {
  const config = useConfig();
  const [activeHeaderPanel, setActiveHeaderPanel] = useState<string>(null);
  const layout = useLayoutType();
  const { slotName, mode } = useLeftNavStore();
  const navMenuItems = useAssignedExtensions(slotName);
  const isActivePanel = useCallback((panelName: string) => activeHeaderPanel === panelName, [activeHeaderPanel]);

  const togglePanel = useCallback((panelName: string) => {
    setActiveHeaderPanel((activeHeaderPanel) => (activeHeaderPanel === panelName ? null : panelName));
  }, []);

  const hidePanel = useCallback(
    (panelName: string) => () => {
      setActiveHeaderPanel((activeHeaderPanel) => (activeHeaderPanel === panelName ? null : activeHeaderPanel));
    },
    [],
  );

  const showHamburger = useMemo(
    () => (!isDesktop(layout) || mode === 'collapsed') && mode !== 'hidden' && navMenuItems.length > 0,
    [navMenuItems.length, layout, mode],
  );

  return (
    <>
      <Header aria-label="OpenMRS" className={styles.topNavHeader}>
        {showHamburger && (
          <HeaderMenuButton
            aria-label="Open menu"
            isCollapsible
            className={styles.headerMenuButton}
            onClick={() => {
              togglePanel('sideMenu');
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            isActive={isActivePanel('sideMenu')}
          />
        )}
        <ConfigurableLink to={config.logo.link}>
          <div className={showHamburger ? '' : styles.spacedLogo}>
            <Logo />
          </div>
        </ConfigurableLink>
        <div className={styles.divider} />
        <ExtensionSlot name="top-nav-info-slot" className={styles.topNavInfoSlot} />
        <HeaderGlobalBar className={styles.headerGlobalBar}>
          <ExtensionSlot
            name="top-nav-actions-slot"
            state={{ isActivePanel, togglePanel, hidePanel }}
            className={styles.topNavActionsSlot}
          />
          <ExtensionSlot
            name="notifications-menu-button-slot"
            state={{
              isActivePanel: isActivePanel,
              togglePanel: togglePanel,
            }}
          />
          <ExtensionSlot
            name="top-nav-app-menu-slot"
            state={{ isActivePanel, togglePanel, hidePanel }}
            className={styles.topNavActionsSlot}
          />
          <SideMenuPanel hidePanel={hidePanel('sideMenu')} expanded={isActivePanel('sideMenu')} />
          <NotificationsMenuPanel expanded={isActivePanel('notificationsMenu')} />
        </HeaderGlobalBar>
      </Header>
    </>
  );
};

const Navbar: React.FC = () => {
  const session = useSession();
  const openmrsSpaBase = window['getOpenmrsSpaBase']();

  if (session?.user?.person) {
    return session.sessionLocation ? (
      <HeaderContainer render={HeaderItems}></HeaderContainer>
    ) : (
      <Navigate
        to={`/login/location`}
        state={{
          referrer: window.location.pathname.slice(
            window.location.pathname.indexOf(openmrsSpaBase) + openmrsSpaBase.length - 1,
          ),
        }}
      />
    );
  }

  return (
    <Navigate
      to={`/login`}
      state={{
        referrer: window.location.pathname.slice(
          window.location.pathname.indexOf(openmrsSpaBase) + openmrsSpaBase.length - 1,
        ),
      }}
    />
  );
};

export default Navbar;
