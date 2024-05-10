import React, { useCallback, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import classNames from 'classnames';
import { HeaderContainer, Header, HeaderMenuButton, HeaderGlobalBar, HeaderGlobalAction } from '@carbon/react';
import { Close, Switcher, UserAvatarFilledAlt } from '@carbon/react/icons';
import {
  ExtensionSlot,
  ConfigurableLink,
  useConnectedExtensions,
  useConfig,
  useLayoutType,
  useSession,
} from '@openmrs/esm-framework';
import { getActiveAppNames } from '@openmrs/esm-framework/src/internal';
import { useTranslation } from 'react-i18next';
import { isDesktop } from '../../utils';
import AppMenuPanel from '../navbar-header-panels/app-menu-panel.component';
import Logo from '../logo/logo.component';
import LeftNavMenu from '../left-nav/left-nav.component';
import NotificationsMenuPanel from '../navbar-header-panels/notifications-menu-panel.component';
import OfflineBanner from '../offline-banner/offline-banner.component';
import UserMenuPanel from '../navbar-header-panels/user-menu-panel.component';
import SideMenuPanel from '../navbar-header-panels/side-menu-panel.component';
import styles from './navbar.scss';

const defaultLeftNavSlot = 'default-dashboard-slot';

const HeaderItems: React.FC = () => {
  const { t } = useTranslation();
  const config = useConfig();
  const [activeHeaderPanel, setActiveHeaderPanel] = useState<string>(null);
  const layout = useLayoutType();
  const appMenuItems = useConnectedExtensions('app-menu-slot');
  const activePages = getActiveAppNames();
  const pageLeftNavSlot = activePages && activePages.length > 0 ? `${activePages[0]}-dashboard-slot` : undefined;
  const leftNavItems = useConnectedExtensions(pageLeftNavSlot);
  const defaultLeftNavItems = useConnectedExtensions(defaultLeftNavSlot);
  const userMenuItems = useConnectedExtensions('user-panel-slot');
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

  const leftNavSlot = useMemo(() => {
    if (leftNavItems.length > 0) {
      return pageLeftNavSlot;
    } else if (defaultLeftNavItems.length > 0) {
      return defaultLeftNavSlot;
    }

    return null;
  }, [pageLeftNavSlot.length, defaultLeftNavSlot.length]);
  const showLeftNav = useMemo(() => isDesktop(layout) && leftNavSlot !== null, [layout, leftNavSlot]);
  const showHamburgerMenu = useMemo(() => !isDesktop(layout) && leftNavSlot !== null, [layout, leftNavSlot]);
  const showAppMenu = useMemo(() => appMenuItems.length > 0, [appMenuItems.length]);
  const showUserMenu = useMemo(() => userMenuItems.length > 0, [userMenuItems.length]);
  return (
    <>
      <OfflineBanner />
      <Header aria-label="OpenMRS" className={styles.topNavHeader}>
        {showHamburgerMenu && (
          <HeaderMenuButton
            aria-label="Open menu"
            isCollapsible
            className={styles.headerMenuButton}
            onClick={() => {
              togglePanel('sideMenu');
            }}
            isActive={isActivePanel('sideMenu')}
          />
        )}
        <ConfigurableLink to={config.logo.link}>
          <div className={showHamburgerMenu ? '' : styles.spacedLogo}>
            <Logo />
          </div>
        </ConfigurableLink>
        <ExtensionSlot className={styles.dividerOverride} name="top-nav-info-slot" />
        <HeaderGlobalBar className={styles.headerGlobalBar}>
          <ExtensionSlot name="top-nav-actions-slot" className={styles.topNavActionsSlot} />
          <ExtensionSlot
            name="notifications-menu-button-slot"
            state={{
              isActivePanel: isActivePanel,
              togglePanel: togglePanel,
            }}
          />
          {showUserMenu && (
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
              {isActivePanel('userMenu') ? <Close size={20} /> : <UserAvatarFilledAlt size={20} />}
            </HeaderGlobalAction>
          )}
          {showAppMenu && (
            <HeaderGlobalAction
              aria-label="App Menu"
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
              {isActivePanel('appMenu') ? <Close size={20} /> : <Switcher size={20} />}
            </HeaderGlobalAction>
          )}
        </HeaderGlobalBar>
        {showHamburgerMenu && (
          <SideMenuPanel
            hidePanel={hidePanel('sideMenu')}
            expanded={isActivePanel('sideMenu')}
            leftNavSlot={leftNavSlot}
          />
        )}
        {showAppMenu && <AppMenuPanel expanded={isActivePanel('appMenu')} hidePanel={hidePanel('appMenu')} />}
        <NotificationsMenuPanel expanded={isActivePanel('notificationsMenu')} />
        {showUserMenu && <UserMenuPanel expanded={isActivePanel('userMenu')} hidePanel={hidePanel('userMenu')} />}
      </Header>
      {showLeftNav && <LeftNavMenu isChildOfHeader={false} leftNavSlot={leftNavSlot} />}
    </>
  );
};

const Navbar: React.FC = () => {
  const session = useSession();
  const openmrsSpaBase = window.getOpenmrsSpaBase();

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
