import React, { useEffect, useRef } from "react";
import styles from "./side-menu-panel.component.scss";
import { ExtensionSlot } from "@openmrs/esm-framework";
import { SideNav, SideNavProps } from "carbon-components-react";

interface SideMenuPanelProps extends SideNavProps {
  hidePanel: () => void;
}

const SideMenuPanel: React.FC<SideMenuPanelProps> = ({
  expanded,
  hidePanel,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef?.current && !menuRef.current.contains(event.target)) {
        hidePanel();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuRef, hidePanel]);

  React.useEffect(() => {
    window.addEventListener("popstate", hidePanel);
    return window.addEventListener("popstate", hidePanel);
  }, [hidePanel]);

  return (
    expanded && (
      <SideNav
        ref={menuRef}
        expanded
        aria-label="Menu"
        isChildOfHeader={expanded}
        className={styles.link}
      >
        <ExtensionSlot extensionSlotName="nav-menu-slot" />
      </SideNav>
    )
  );
};

export default SideMenuPanel;
