import React from "react";
import { useTranslation } from "react-i18next";
import { HeaderPanel } from "@carbon/react";
import { Launch } from "@carbon/react/icons";
import {
  ExtensionSlot,
  useOnClickOutside,
  useConfig,
} from "@openmrs/esm-framework";
import styles from "./app-menu-panel.scss";

interface AppMenuProps {
  expanded: boolean;
  hidePanel: () => void;
}

const AppMenuPanel: React.FC<AppMenuProps> = ({ expanded, hidePanel }) => {
  const appMenuRef = useOnClickOutside<HTMLDivElement>(hidePanel, expanded);
  const config = useConfig();
  const { t } = useTranslation();

  return (
    <HeaderPanel
      ref={appMenuRef as any}
      className={styles.headerPanel}
      aria-label="App Menu Panel"
      expanded={expanded}
      onClick={() => hidePanel()}
    >
      <ExtensionSlot className={styles.menuLink} name="app-menu-slot" />
      {config?.externalRefLinks?.length > 0 && (
        <div className={`${styles.menuLink} ${styles.externalLinks}`}>
          {config?.externalRefLinks?.map((link) => (
            <a target="_blank" rel="noopener noreferrer" href={link?.redirect}>
              {t(link?.title)}
              <Launch size={16} className={styles.launchIcon} />
            </a>
          ))}
        </div>
      )}
    </HeaderPanel>
  );
};

export default AppMenuPanel;
