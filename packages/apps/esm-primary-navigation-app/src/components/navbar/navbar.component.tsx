import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { type SingleSpaCustomEventDetail } from 'single-spa';
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

const defaultLeftNavSlot = 'default-left-nav-slot';

const HeaderItems: React.FC = () => {
  const { t } = useTranslation();
  const config = useConfig();
  const [activeHeaderPanel, setActiveHeaderPanel] = useState<string>(null);
  const layout = useLayoutType();
  const appMenuItems = useConnectedExtensions('app-menu-slot');

  const [pageLeftNavSlot, setPageLeftNavSlot] = useState<string | null>(null);
  const leftNavItems = useConnectedExtensions(pageLeftNavSlot);
  const defaultLeftNavItems = useConnectedExtensions(defaultLeftNavSlot);
  const userMenuItems = useConnectedExtensions('user-panel-slot');
  const isActivePanel = useCallback((panelName: string) => activeHeaderPanel === panelName, [activeHeaderPanel]);

  /*
   * Utility callback used to set or unset the active panel
   */
  const togglePanel = useCallback((panelName: string) => {
    setActiveHeaderPanel((activeHeaderPanel) => (activeHeaderPanel === panelName ? null : panelName));
  }, []);

  /*
   * Utility call back used to hide the named panel if it is the active panel.
   */
  const hidePanel = useCallback(
    (panelName: string) => () => {
      setActiveHeaderPanel((activeHeaderPanel) => (activeHeaderPanel === panelName ? null : activeHeaderPanel));
    },
    [],
  );

  /*
   * The left nav is driven by which main page is active. This hook sets the slot name for the current screen
   * based on page. We add an event listener to listen to single-spa app changes to update the left nav accordingly.
   */
  useEffect(() => {
    {
      const activePages = getActiveAppNames();
      setPageLeftNavSlot(activePages && activePages.length > 0 ? `${activePages[0]}-left-nav-slot` : null);
    }

    return window.addEventListener('single-spa:app-change', (evt: Event & { detail: SingleSpaCustomEventDetail }) => {
      if (evt.detail.totalAppChanges > 0) {
        const activePages = getActiveAppNames(undefined, evt.detail.appsByNewStatus['MOUNTED']);
        setPageLeftNavSlot(activePages && activePages.length > 0 ? `${activePages[0]}-left-nav-slot` : null);
      }
    });
  }, []);

  /*
   * In addition to the logic based on which apps are active, we implement a default left nav slot that is used
   * if either the page has no corresponding left nav slot or the left nav slot is empty. This means that the
   * default left nav slot can be used to provide a default for every application.
   */
  const leftNavSlot = useMemo(() => {
    if (leftNavItems.length > 0) {
      return pageLeftNavSlot;
    } else if (defaultLeftNavItems.length > 0) {
      return defaultLeftNavSlot;
    }

    return null;
  }, [leftNavItems.length, defaultLeftNavSlot.length, pageLeftNavSlot]);

  // in desktop mode, the left nav is rendered if either the page slot or the default slot has extensions
  const showLeftNav = useMemo(() => isDesktop(layout) && leftNavSlot !== null, [layout, leftNavSlot]);
  // in non-desktop mode, the left nav is rendered as a hamburger menu if either the page slot or default slot has extensions
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
          <div className={classNames({ [styles.spacedLogo]: showHamburgerMenu })}>
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
