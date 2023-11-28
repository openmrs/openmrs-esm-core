import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Toggle, Button, DefinitionTooltip } from "@carbon/react";
import { Network_3 } from "@carbon/react/icons";
import {
  getCurrentOfflineMode,
  setCurrentOfflineMode,
  showModal,
  useConnectivity,
} from "@openmrs/esm-framework/src/internal";
import styles from "./offline-actions-mode-button.scss";

function doNotCloseMenu(ev: React.SyntheticEvent) {
  ev.stopPropagation();
}

const OfflineActionsModeButton: React.FC = () => {
  const { t } = useTranslation();
  const isOnline = useConnectivity();
  const [lastRun, setLastRun] = useState<string>(
    () => getCurrentOfflineMode().lastRun
  );
  const [active, setActive] = useState(() => getCurrentOfflineMode().active);

  const toggle = useCallback(() => {
    if (window.installedModules && window.installedModules.length > 0) {
      const dispose = showModal("offline-tools-offline-ready-modal", {
        items: window.installedModules
          .filter((app) => app.length >= 3)
          .map((app) => app[2]),
        closeModal: (result) => {
          setActive(result);
          setCurrentOfflineMode(result ? "on" : "off");
          dispose();
        },
      });
    } else {
      console.warn("No installed modules found.");
    }
  }, [setActive]);

  const handleRefresh = useCallback(() => {
    toggle();
  }, [toggle]);

  return (
    isOnline && (
      <div className={styles.offlineModeButtonContainer}>
        <Network_3 size={20} />
        <div>
          <DefinitionTooltip
            openOnHover
            align="top"
            definition={`${t("lastRun", "Last Run")}: ${
              active ? lastRun : t("never", "Never")
            }`}
          >
            {t("offlineReady", "Offline Ready")}
          </DefinitionTooltip>
          {active ? (
            <Button kind="ghost" onClick={handleRefresh}>
              {t("refresh", "Refresh")}
            </Button>
          ) : (
            <Toggle toggled={active} onToggle={toggle} />
          )}
        </div>
      </div>
    )
  );
};

export default OfflineActionsModeButton;
