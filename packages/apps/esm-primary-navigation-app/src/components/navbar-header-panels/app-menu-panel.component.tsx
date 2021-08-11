import React, { useEffect, useRef } from "react";
import { ExtensionSlot } from "@openmrs/esm-framework";
import { HeaderPanel } from "carbon-components-react/es/components/UIShell";
import styles from "./app-menu-panel.component.scss";
import useOnClickOutside from "./useOnClickOutside";

interface AppMenuProps {
  expanded: boolean;
  hidePanel: () => void;
}

const AppMenuPanel: React.FC<AppMenuProps> = ({ expanded, hidePanel }) => {
  const appMenuRef = useRef(null);

  useOnClickOutside(appMenuRef, hidePanel, expanded);

  return (
    <HeaderPanel
      ref={appMenuRef}
      className={styles.headerPanel}
      aria-label="App Menu Panel"
      expanded={expanded}
    >
      <ExtensionSlot
        className={styles.menuLink}
        extensionSlotName="app-menu-slot"
      />
    </HeaderPanel>
  );
};

export default AppMenuPanel;
