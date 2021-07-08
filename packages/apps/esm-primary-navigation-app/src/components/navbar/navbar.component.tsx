import React from "react";
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
import Notification20 from "@carbon/icons-react/es/notification/20";
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

  const [activeHeaderPanel, setActiveHeaderPanel] =
    React.useState<string>(null);

  const isActivePanel = React.useCallback(
    (panelName: string) => activeHeaderPanel === panelName,
    [activeHeaderPanel]
  );

  const togglePanel = React.useCallback(
    (panelName: string) =>
      setActiveHeaderPanel((activeHeaderPanel) =>
        activeHeaderPanel === panelName ? null : panelName
      ),
    []
  );

  const hidePanel = React.useCallback(() => {
    setActiveHeaderPanel(null);
  }, []);

  const showHamburger = React.useMemo(
    () => !isDesktop(layout) && navMenuItems.length > 0,
    [navMenuItems.length, layout]
  );

  const render = React.useCallback(() => {
    return (
      <>
        <OfflineBanner />
        <Header aria-label="OpenMRS" style={{ top: "1.5rem" }}>
          {showHamburger && (
            <HeaderMenuButton
              aria-label="Open menu"
              isCollapsible
              onClick={() => togglePanel("sideMenu")}
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
          <HeaderGlobalBar className={styles.headerGlobalBar}>
            <ExtensionSlot
              extensionSlotName="top-nav-actions-slot"
              className={styles.topNavActionSlot}
              state={{ isActive: isActivePanel("") }}
            />
            <HeaderGlobalAction
              aria-label="Notifications"
              name="Notifications"
              isActive={isActivePanel("notificationsMenu")}
              onClick={() => togglePanel("notificationsMenu")}
            >
              {isActivePanel("notificationsMenu") ? (
                <Close20 />
              ) : (
                <Notification20 />
              )}
            </HeaderGlobalAction>
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
          <AppMenuPanel expanded={isActivePanel("appMenu")} />
          <NotificationsMenuPanel
            expanded={isActivePanel("notificationsMenu")}
          />
          <UserMenuPanel
            user={user}
            session={session}
            expanded={isActivePanel("userMenu")}
            allowedLocales={allowedLocales}
            onLogout={onLogout}
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
