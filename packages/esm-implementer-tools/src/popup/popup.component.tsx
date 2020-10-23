import React, { useState, useEffect } from "react";
import styles from "./popup.styles.css";
import Configuration from "../configuration/configuration.component";
import BackendModule from "../backend-dependencies/backend-dependecies.component";

export default function Popup(props: DevToolsPopupProps) {
  const [configHasAlert, setConfigHasAlert] = useState(false);
  const [backendHasAlert, setBackendHasAlert] = useState(false);
  const [visibleTabIndex, setVisibleTabIndex] = useState(0);

  useEffect(() => {
    props.setHasAlert(configHasAlert || backendHasAlert);
  }, [backendHasAlert, configHasAlert]);

  return (
    <div className={styles.popup}>
      <nav className={styles.tabs}>
        <button
          className={visibleTabIndex == 0 ? styles.selectedTab : ""}
          onClick={() => setVisibleTabIndex(0)}
        >
          Configuration
        </button>
        <button
          className={visibleTabIndex == 1 ? styles.selectedTab : ""}
          onClick={() => setVisibleTabIndex(1)}
        >
          Backend Modules
        </button>
      </nav>
      <div>
        {visibleTabIndex === 0 && (
          <Configuration setHasAlert={setConfigHasAlert} />
        )}
        {visibleTabIndex === 1 && (
          <BackendModule setHasAlert={setBackendHasAlert} />
        )}
      </div>
      <div className={styles.farRight}>
        <button onClick={props.close} className="omrs-unstyled">
          {"\u24e7"}
        </button>
      </div>
    </div>
  );
}

type DevToolsPopupProps = {
  close(): void;
  setHasAlert(value: boolean): void;
};
