import React from "react";
import Switcher20 from "@carbon/icons-react/lib/switcher/20";
import Close20 from "@carbon/icons-react/lib/close/20";
import Search20 from "@carbon/icons-react/lib/search/20";
import UserAvatarFilledAlt20 from "@carbon/icons-react/es/user--avatar--filled--alt/20";
import UserMenuPanel from "../navbar-header-panels/user-menu-panel.component";
import SideMenuPanel from "../navbar-header-panels/side-menu-panel.component";
import Logo from "../logo/logo.component";
import AppMenuPanel from "../navbar-header-panels/app-menu-panel.component";
import styles from "./navbar.component.scss";
import { isDesktop } from "../../utils";
import { useLayoutType, navigate, ExtensionSlot } from "@openmrs/esm-framework";
import {
  HeaderContainer,
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from "carbon-components-react/es/components/UIShell";
import { LoggedInUser, UserSession } from "../../types";
import PatientSearch from "../patient-search/patient-search.component";

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
  const headerRef = React.useRef(null);
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

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        hidePanel();
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, [hidePanel, headerRef]);

  const render = React.useCallback(() => {
    const Icon = isActivePanel("appMenu") ? Close20 : Switcher20;

    return (
      <Header aria-label="OpenMRS">
        {!isDesktop(layout) && (
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
        <HeaderGlobalBar>
          <ExtensionSlot
            extensionSlotName="top-nav-actions-slot"
            className={styles.topNavActionSlot}
          />
          <HeaderGlobalAction
            aria-label="Patient Search"
            isActive={isActivePanel("patientSearch")}
            aria-labelledby="Patient Search"
            onClick={() => togglePanel("patientSearch")}
          >
            <Search20 />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="Users"
            aria-labelledby="Users Avatar Icon"
            style={{ padding: "12px" }}
            name="Users"
            isActive={isActivePanel("userMenu")}
            onClick={() => togglePanel("userMenu")}
          >
            <UserAvatarFilledAlt20 />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="App Menu"
            isActive={isActivePanel("appMenu")}
            aria-labelledby="App Menu"
            onClick={() => togglePanel("appMenu")}
          >
            <Icon />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
        {!isDesktop(layout) && (
          <SideMenuPanel
            hidePanel={hidePanel}
            expanded={isActivePanel("sideMenu")}
          />
        )}
        <AppMenuPanel expanded={isActivePanel("appMenu")} />
        <UserMenuPanel
          user={user}
          session={session}
          expanded={isActivePanel("userMenu")}
          allowedLocales={allowedLocales}
          onLogout={onLogout}
        />
        <PatientSearch
          showPatientSearch={isActivePanel("patientSearch")}
          hidePanel={hidePanel}
        />
      </Header>
    );
  }, [
    session,
    user,
    allowedLocales,
    isActivePanel,
    layout,
    hidePanel,
    togglePanel,
  ]);

  return (
    <div ref={headerRef}>{session && <HeaderContainer render={render} />}</div>
  );
};

export default Navbar;
