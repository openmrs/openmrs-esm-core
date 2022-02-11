import React from "react";
import { useTranslation } from "react-i18next";
import { Toggle } from "carbon-components-react";
import Network20 from "@carbon/icons-react/es/network--3/20";
import {
  getCurrentOfflineMode,
  setCurrentOfflineMode,
} from "@openmrs/esm-framework";
import styles from "./offline-actions-mode-button.component.scss";

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
      <Network20 />
      <div onClick={doNotCloseMenu} role="none">
        {t("offlineReady", "Offline Ready")}
        <Toggle
          id="offlineModeSwitch"
          labelA=""
          labelB=""
          toggled={active}
          onToggle={toggle}
        />
      </div>
    </div>
  );
};

export default OfflineActionsModeButton;
