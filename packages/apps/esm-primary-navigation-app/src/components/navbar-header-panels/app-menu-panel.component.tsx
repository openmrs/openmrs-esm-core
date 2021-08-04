import React, { useEffect, useRef } from "react";
import { ExtensionSlot } from "@openmrs/esm-framework";
import { HeaderPanel } from "carbon-components-react/es/components/UIShell";
import styles from "./app-menu-panel.component.scss";

interface AppMenuProps {
  expanded: boolean;
}

const AppMenuPanel: React.FC<AppMenuProps> = ({ expanded }) => {
  return (
    <HeaderPanel
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
