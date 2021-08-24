import {
  attach,
  detach,
  ExtensionSlot,
  useLayoutType,
} from "@openmrs/esm-framework";
import React, { useEffect } from "react";
import { SideNav } from "carbon-components-react/es/components/UIShell";
import styles from "./desktop-side-nav.styles.scss";

const DesktopSideNav: React.FC = () => {
  const layout = useLayoutType();

  useEffect(() => {
    attach("nav-menu-slot", "offline-tools-nav-items");
    return () => detach("nav-menu-slot", "offline-tools-nav-items");
  }, []);

  return (
    layout === "desktop" && (
      <SideNav expanded aria-label="Menu" className={styles.link}>
        <ExtensionSlot extensionSlotName="nav-menu-slot" />
      </SideNav>
    )
  );
};

export default DesktopSideNav;
