import React, { useCallback, useMemo, useState } from "react";
import {
  LoggedInUser,
  useLayoutType,
  ExtensionSlot,
  useAssignedExtensionIds,
  ConfigurableLink,
} from "@openmrs/esm-framework";
import {
  HeaderContainer,
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from "carbon-components-react/es/components/UIShell";
import { isDesktop } from "../../utils";
import { UserSession } from "../../types";
import Close20 from "@carbon/icons-react/es/close/20";
import Switcher20 from "@carbon/icons-react/es/switcher/20";
import UserAvatarFilledAlt20 from "@carbon/icons-react/es/user--avatar--filled--alt/20";
import AppMenuPanel from "../navbar-header-panels/app-menu-panel.component";
import UserMenuPanel from "../navbar-header-panels/user-menu-panel.component";
import NotificationsMenuPanel from "../navbar-header-panels/notifications-menu-panel.component";
import SideMenuPanel from "../navbar-header-panels/side-menu-panel.component";
import Logo from "../logo/logo.component";
import styles from "./navbar.component.scss";
import OfflineBanner from "../offline-banner/offline-banner.component";

export interface NavbarProps {
  user: LoggedInUser;
  allowedLocales: Array<string>;
  onLogout(): void;
  session: UserSession;
}

const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  allowedLocales,
  session,
}) => {
  const layout = useLayoutType();
  const navMenuItems = useAssignedExtensionIds("nav-menu-slot");

  const [activeHeaderPanel, setActiveHeaderPanel] = useState<string>(null);

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

  const hidePanel = useCallback(() => {
    setActiveHeaderPanel(null);
  }, []);

  const showHamburger = useMemo(
    () => !isDesktop(layout) && navMenuItems.length > 0,
    [navMenuItems.length, layout]
  );

  const render = useCallback(() => {
    return (
      <>
        <OfflineBanner />
        <Header className={styles.topNavHeader} aria-label="OpenMRS">
          {showHamburger && (
            <HeaderMenuButton
              aria-label="Open menu"
              isCollapsible
              onClick={(event) => {
                togglePanel("sideMenu");
                event.stopPropagation();
              }}
              isActive={isActivePanel("sideMenu")}
            />
          )}
          <ConfigurableLink
            className="bx--header__name"
            to="${openmrsSpaBase}/home"
          >
            <Logo />
          </ConfigurableLink>
          <ExtensionSlot
            className={styles.dividerOverride}
            extensionSlotName="top-nav-info-slot"
          />
          <HeaderGlobalBar className={styles.headerGlobalBar}>
            <ExtensionSlot
              extensionSlotName="top-nav-actions-slot"
              className={styles.topNavActionsSlot}
            />
            <ExtensionSlot
              extensionSlotName="notifications-menu-button-slot"
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
              name="Users"
              isActive={isActivePanel("userMenu")}
              onClick={(event) => {
                togglePanel("userMenu");
                event.stopPropagation();
              }}
            >
              {isActivePanel("userMenu") ? (
                <Close20 />
              ) : (
                <UserAvatarFilledAlt20 />
              )}
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="App Menu"
              isActive={isActivePanel("appMenu")}
              className={`${
                isActivePanel("appMenu")
                  ? styles.headerGlobalBarButton
                  : styles.activePanel
              }`}
              aria-labelledby="App Menu"
              onClick={(event) => {
                togglePanel("appMenu");
                event.stopPropagation();
              }}
            >
              {isActivePanel("appMenu") ? <Close20 /> : <Switcher20 />}
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
          <NotificationsMenuPanel
            expanded={isActivePanel("notificationsMenu")}
          />
          <UserMenuPanel
            user={user}
            session={session}
            expanded={isActivePanel("userMenu")}
            allowedLocales={allowedLocales}
            onLogout={onLogout}
            hidePanel={hidePanel}
          />
        </Header>
      </>
    );
  }, [
    showHamburger,
    session,
    user,
    allowedLocales,
    isActivePanel,
    layout,
    hidePanel,
    togglePanel,
  ]);

  return <div>{session && <HeaderContainer render={render} />}</div>;
};

export default Navbar;
