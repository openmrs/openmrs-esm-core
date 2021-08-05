import React, { useCallback, useMemo, useState } from "react";
import {
  LoggedInUser,
  useLayoutType,
  navigate,
  ExtensionSlot,
  useAssignedExtensionIds,
} from "@openmrs/esm-framework";
import {
  HeaderContainer,
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from "carbon-components-react/es/components/UIShell";
import Close20 from "@carbon/icons-react/lib/close/20";
import Switcher20 from "@carbon/icons-react/lib/switcher/20";
import UserAvatarFilledAlt20 from "@carbon/icons-react/es/user--avatar--filled--alt/20";
import AppMenuPanel from "../navbar-header-panels/app-menu-panel.component";
import UserMenuPanel from "../navbar-header-panels/user-menu-panel.component";
import NotificationsMenuPanel from "../navbar-header-panels/notifications-menu-panel.component";
import SideMenuPanel from "../navbar-header-panels/side-menu-panel.component";
import Logo from "../logo/logo.component";
import styles from "./navbar.component.scss";
import { isDesktop } from "../../utils";
import { UserSession } from "../../types";
import OfflineBanner from "../offline-banner/offline-banner.component";

const HeaderLink: any = HeaderName;

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
          <HeaderLink
            prefix=""
            onClick={() => {
              navigate({ to: "${openmrsSpaBase}/home" });
              hidePanel();
            }}
          >
            <Logo />
          </HeaderLink>
          <ExtensionSlot
            className={styles.dividerOverride}
            extensionSlotName="top-nav-info-slot"
          />
          <HeaderGlobalBar className={styles.headerGlobalBar}>
            <ExtensionSlot
              extensionSlotName="top-nav-actions-slot"
              className={styles.topNavActionSlot}
              state={{ isActive: isActivePanel("") }}
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
              style={{ padding: "12px" }}
              name="Users"
              isActive={isActivePanel("userMenu")}
              onClick={() => togglePanel("userMenu")}
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
              aria-labelledby="App Menu"
              onClick={() => togglePanel("appMenu")}
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
          {isActivePanel("appMenu") && (
            <AppMenuPanel
              expanded={isActivePanel("appMenu")}
              hidePanel={hidePanel}
            />
          )}
          <NotificationsMenuPanel
            expanded={isActivePanel("notificationsMenu")}
          />
          {isActivePanel("userMenu") && (
            <UserMenuPanel
              user={user}
              session={session}
              expanded={isActivePanel("userMenu")}
              allowedLocales={allowedLocales}
              onLogout={onLogout}
              hidePanel={hidePanel}
            />
          )}
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
