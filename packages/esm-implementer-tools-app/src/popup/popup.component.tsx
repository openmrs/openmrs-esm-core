import React, { useState, useEffect } from "react";
import { Button, Tabs, Tab } from "carbon-components-react";
import { Close16 } from "@carbon/icons-react";
import styles from "./popup.styles.css";
import Configuration from "../configuration/configuration.component";
import BackendModule from "../backend-dependencies/backend-dependecies.component";

export default function Popup(props: DevToolsPopupProps) {
  const [configHasAlert, setConfigHasAlert] = useState(false);
  const [backendHasAlert, setBackendHasAlert] = useState(false);

  useEffect(() => {
    props.setHasAlert(configHasAlert || backendHasAlert);
  }, [backendHasAlert, configHasAlert]);

  return (
    <div className={styles.popup}>
      <div className={styles.topBar} />
      <Tabs>
        <Tab
          id="configuration-tab"
          label="Configuration"
          style={{ position: "fixed" }}
        >
          <Configuration setHasAlert={setConfigHasAlert} />
        </Tab>
        <Tab
          id="backend-modules-tab"
          label="Backend Modules"
          style={{ position: "fixed", marginLeft: "160px" }}
        >
          <BackendModule setHasAlert={setBackendHasAlert} />
        </Tab>
      </Tabs>
      <div className={styles.farRight}>
        <Button
          className={styles.closeButton}
          kind="secondary"
          renderIcon={Close16}
          iconDescription="Close"
          onClick={props.close}
          hasIconOnly
        />
      </div>
    </div>
  );
}

type DevToolsPopupProps = {
  close(): void;
  setHasAlert(value: boolean): void;
};
