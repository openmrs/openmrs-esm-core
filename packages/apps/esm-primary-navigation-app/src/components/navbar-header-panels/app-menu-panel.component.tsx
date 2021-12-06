import React from "react";
import styles from "./app-menu-panel.component.scss";
import {
  ExtensionSlot,
  useOnClickOutside,
  useConfig,
} from "@openmrs/esm-framework";
import { HeaderPanel } from "carbon-components-react";
import Launch16 from "@carbon/icons-react/es/launch/16";

interface AppMenuProps {
  expanded: boolean;
  hidePanel: () => void;
}

const AppMenuPanel: React.FC<AppMenuProps> = ({ expanded, hidePanel }) => {
  const appMenuRef = useOnClickOutside<HTMLDivElement>(hidePanel, expanded);
  const config = useConfig();

  return (
    <HeaderPanel
      ref={appMenuRef as any}
      className={styles.headerPanel}
      aria-label="App Menu Panel"
      expanded={expanded}
    >
      <ExtensionSlot
        className={styles.menuLink}
        extensionSlotName="app-menu-slot"
      />
      {config?.externalRefLinks?.enabled &&
        config?.externalRefLinks?.links.length > 0 && (
          <div className={`${styles.menuLink} ${styles.externalLinks}`}>
            {config?.externalRefLinks?.links?.map(
              (link) =>
                link?.visible && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={link?.redirect}
                  >
                    {link?.title}
                    <Launch16 className={styles.launchIcon} />
                  </a>
                )
            )}
          </div>
        )}
    </HeaderPanel>
  );
};

export default AppMenuPanel;
