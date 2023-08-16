import React, { memo, useCallback, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  HeaderContainer,
  Header,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from "@carbon/react";
import { Close, Switcher, UserAvatarFilledAlt } from "@carbon/react/icons";
import {
  LoggedInUser,
  useLayoutType,
  ExtensionSlot,
  ConfigurableLink,
  useAssignedExtensions,
  useSession,
} from "@openmrs/esm-framework";
import { isDesktop } from "../../utils";
import AppMenuPanel from "../navbar-header-panels/app-menu-panel.component";
import Logo from "../logo/logo.component";
import NotificationsMenuPanel from "../navbar-header-panels/notifications-menu-panel.component";
import OfflineBanner from "../offline-banner/offline-banner.component";
import UserMenuPanel from "../navbar-header-panels/user-menu-panel.component";
import SideMenuPanel from "../navbar-header-panels/side-menu-panel.component";
import styles from "./navbar.scss";

const Navbar: React.FC = () => {
  const session = useSession();
  const [user, setUser] = useState<LoggedInUser | null | false>(
    session?.user ?? null
  );
  const [activeHeaderPanel, setActiveHeaderPanel] = useState<string>(null);
  const allowedLocales = session?.allowedLocales ?? null;
  const layout = useLayoutType();
  const navMenuItems = useAssignedExtensions(
    "patient-chart-dashboard-slot"
  ).map((e) => e.id);
  const openmrsSpaBase = window["getOpenmrsSpaBase"]();

  const isActivePanel = useCallback(
    (panelName: string) => activeHeaderPanel === panelName,
    [activeHeaderPanel]
  );

  const togglePanel = useCallback(
    (panelName: string) =>
      setActiveHeaderPanel((activeHeaderPanel) =>
        activeHeaderPanel === panelName ? null : panelName
      ),
    []
  );

  const logout = useCallback(() => setUser(false), []);

  const hidePanel = useCallback(() => {
    setActiveHeaderPanel(null);
  }, []);

  const showHamburger = useMemo(
    () => !isDesktop(layout) && navMenuItems.length > 0,
    [navMenuItems.length, layout]
  );

  const HeaderItems = () => (
    <>
      <OfflineBanner />
      <Header aria-label="OpenMRS">
        {showHamburger && (
          <HeaderMenuButton
            aria-label="Open menu"
            isCollapsible
            className={styles.headerMenuButton}
            onClick={(event) => {
              togglePanel("sideMenu");
              event.stopPropagation();
            }}
            isActive={isActivePanel("sideMenu")}
          />
        )}
        <ConfigurableLink to="${openmrsSpaBase}/home">
          <div className={showHamburger ? "" : styles.spacedLogo}>
            <Logo />
          </div>
        </ConfigurableLink>
        <ExtensionSlot
          className={styles.dividerOverride}
          name="top-nav-info-slot"
        />
        <HeaderGlobalBar className={styles.headerGlobalBar}>
          <ExtensionSlot
            name="top-nav-actions-slot"
            className={styles.topNavActionsSlot}
          />
          <ExtensionSlot
            name="notifications-menu-button-slot"
            state={{
              isActivePanel: isActivePanel,
              togglePanel: togglePanel,
            }}
          />
          <HeaderGlobalAction
            aria-label="Users"
            aria-labelledby="Users Avatar Icon"
            className={`${
              isActivePanel("userMenu")
                ? styles.headerGlobalBarButton
                : styles.activePanel
            }`}
            enterDelayMs={500}
            name="Users"
            isActive={isActivePanel("userMenu")}
            onClick={(event) => {
              togglePanel("userMenu");
              event.stopPropagation();
            }}
          >
            {isActivePanel("userMenu") ? (
              <Close size={20} />
            ) : (
              <UserAvatarFilledAlt size={20} />
            )}
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="App Menu"
            aria-labelledby="App Menu"
            enterDelayMs={500}
            isActive={isActivePanel("appMenu")}
            tooltipAlignment="end"
            className={`${
              isActivePanel("appMenu")
                ? styles.headerGlobalBarButton
                : styles.activePanel
            }`}
            onClick={(event) => {
              togglePanel("appMenu");
              event.stopPropagation();
            }}
          >
            {isActivePanel("appMenu") ? (
              <Close size={20} />
            ) : (
              <Switcher size={20} />
            )}
          </HeaderGlobalAction>
        </HeaderGlobalBar>
        {!isDesktop(layout) && (
          <SideMenuPanel
            hidePanel={hidePanel}
            expanded={isActivePanel("sideMenu")}
          />
        )}
        <AppMenuPanel
          expanded={isActivePanel("appMenu")}
          hidePanel={hidePanel}
        />
        <NotificationsMenuPanel expanded={isActivePanel("notificationsMenu")} />
        <UserMenuPanel
          user={user}
          session={session}
          expanded={isActivePanel("userMenu")}
          allowedLocales={allowedLocales}
          onLogout={logout}
          hidePanel={hidePanel}
        />
      </Header>
    </>
  );

  if (user && session) {
    return session.sessionLocation ? (
      <HeaderContainer render={memo(HeaderItems)}></HeaderContainer>
    ) : (
      <Navigate
        to={`${openmrsSpaBase}login/location`}
        state={{
          referrer: window.location.pathname.slice(
            window.location.pathname.indexOf(openmrsSpaBase) +
              openmrsSpaBase.length -
              1
          ),
        }}
      />
    );
  }

  return (
    <Navigate
      to={`${openmrsSpaBase}login`}
      state={{
        referrer: window.location.pathname.slice(
          window.location.pathname.indexOf(openmrsSpaBase) +
            openmrsSpaBase.length -
            1
        ),
      }}
    />
  );
};

export default Navbar;
