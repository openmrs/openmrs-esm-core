import React, { useEffect, useRef } from "react";
import { ExtensionSlot } from "@openmrs/esm-framework";
import { HeaderPanel } from "carbon-components-react/es/components/UIShell";
import styles from "./app-menu-panel.component.scss";

interface AppMenuProps {
  expanded: boolean;
  hidePanel: () => void;
}

const AppMenuPanel: React.FC<AppMenuProps> = ({ expanded, hidePanel }) => {
  const appMenuRef = useRef(null);

  useEffect(() => {
    if (expanded) {
      const listener = (event: MouseEvent) => {
        if (appMenuRef?.current && !appMenuRef.current.contains(event.target)) {
          hidePanel();
        }
      };
      window.addEventListener("click", listener);
      return () => window.removeEventListener("click", listener);
    }
  }, [appMenuRef?.current]);

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
