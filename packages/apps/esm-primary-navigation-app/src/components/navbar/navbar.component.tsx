import React, { useCallback, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { HeaderContainer, Header, HeaderMenuButton, HeaderGlobalBar, HeaderGlobalAction } from '@carbon/react';
import {
  useLayoutType,
  ExtensionSlot,
  ConfigurableLink,
  useSession,
  useConnectedExtensions,
  useConfig,
  CloseIcon,
  UserAvatarIcon,
  SwitcherIcon,
} from '@openmrs/esm-framework';
import { isDesktop } from '../../utils';
import AppMenuPanel from '../navbar-header-panels/app-menu-panel.component';
import Logo from '../logo/logo.component';
import NotificationsMenuPanel from '../navbar-header-panels/notifications-menu-panel.component';
import OfflineBanner from '../offline-banner/offline-banner.component';
import UserMenuPanel from '../navbar-header-panels/user-menu-panel.component';
import SideMenuPanel from '../navbar-header-panels/side-menu-panel.component';
import styles from './navbar.scss';

const HeaderItems: React.FC = () => {
  const { t } = useTranslation();
  const config = useConfig();
  const [activeHeaderPanel, setActiveHeaderPanel] = useState<string>(null);
  const layout = useLayoutType();
  const navMenuItems = useConnectedExtensions('patient-chart-dashboard-slot').map((e) => e.id);
  const appMenuItems = useConnectedExtensions('app-menu-slot');
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

  const showHamburger = useMemo(() => !isDesktop(layout) && navMenuItems.length > 0, [navMenuItems.length, layout]);
  const showAppMenu = useMemo(() => appMenuItems.length > 0, [appMenuItems.length]);
  const showUserMenu = useMemo(() => userMenuItems.length > 0, [userMenuItems.length]);
  return (
    <>
      <OfflineBanner />
      <Header aria-label="OpenMRS" className={styles.topNavHeader}>
        {showHamburger && (
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
          <div className={showHamburger ? '' : styles.spacedLogo}>
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
              {isActivePanel('userMenu') ? <CloseIcon size={20} /> : <UserAvatarIcon size={20} />}
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
              {isActivePanel('appMenu') ? <CloseIcon size={20} /> : <SwitcherIcon size={20} />}
            </HeaderGlobalAction>
          )}
        </HeaderGlobalBar>
        {!isDesktop(layout) && <SideMenuPanel hidePanel={hidePanel('sideMenu')} expanded={isActivePanel('sideMenu')} />}
        {showAppMenu && <AppMenuPanel expanded={isActivePanel('appMenu')} hidePanel={hidePanel('appMenu')} />}
        <NotificationsMenuPanel expanded={isActivePanel('notificationsMenu')} />
        {showUserMenu && <UserMenuPanel expanded={isActivePanel('userMenu')} hidePanel={hidePanel('userMenu')} />}
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
