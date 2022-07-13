import React from "react";
import { useTranslation } from "react-i18next";
import { Toggle } from "@carbon/react";
import { Network_3 } from "@carbon/react/icons";
import {
  getCurrentOfflineMode,
  setCurrentOfflineMode,
} from "@openmrs/esm-framework/src/internal";
import styles from "./offline-actions-mode-button.scss";

function doNotCloseMenu(ev: React.SyntheticEvent) {
  ev.stopPropagation();
}

const OfflineActionsModeButton: React.FC = () => {
  const { t } = useTranslation();
  const [active, setActive] = React.useState(
    () => getCurrentOfflineMode().active
  );
  const toggle = React.useCallback(() => {
    setActive((value) => {
      const active = !value;
      setCurrentOfflineMode(active ? "on" : "off");
      return active;
    });
  }, []);

  return (
    <div className={styles.offlineModeButtonContainer}>
      <Network_3 size={20} />
      <div onClick={doNotCloseMenu} role="none">
        <span>{t("offlineReady", "Offline Ready")}</span>
        <Toggle
          className={styles.toggle}
          id="offlineModeSwitch"
          toggled={active}
          onToggle={toggle}
        />
      </div>
    </div>
  );
};

export default OfflineActionsModeButton;
