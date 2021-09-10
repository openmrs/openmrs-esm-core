import React from "react";
import styles from "./app-menu-panel.component.scss";
import { ExtensionSlot, useOnClickOutside } from "@openmrs/esm-framework";
import { HeaderPanel } from "carbon-components-react";

interface AppMenuProps {
  expanded: boolean;
  hidePanel: () => void;
}

const AppMenuPanel: React.FC<AppMenuProps> = ({ expanded, hidePanel }) => {
  const appMenuRef = useOnClickOutside(hidePanel, expanded);

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
