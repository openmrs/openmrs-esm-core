import React, { useState, useEffect } from "react";
import { Button, ContentSwitcher, Switch } from "carbon-components-react";
import { Close16 } from "@carbon/icons-react";
import styles from "./popup.styles.css";
import Configuration from "../configuration/configuration.component";
import { ModuleDiagnostics } from "../backend-dependencies/backend-dependecies.component";
import { MissingBackendModules } from "../backend-dependencies/openmrs-backend-dependencies";

export default function Popup(props: DevToolsPopupProps) {
  const [configHasAlert, setConfigHasAlert] = useState(false);
  const [diagnosticsHasAlert, setDiagnosticsHasAlert] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    props.setHasAlert(configHasAlert || diagnosticsHasAlert);
  }, [diagnosticsHasAlert, configHasAlert]);

  return (
    <div className={styles.popup}>
      <div className={styles.topBar}>
        <div className={styles.tabs}>
          <ContentSwitcher
            onChange={(c) => {
              setActiveTab((c as any).index);
            }}
          >
            <Switch
              name="configuration-tab"
              text="Configuration"
              onClick={() => {}}
              onKeyDown={() => {}}
            />
            <Switch
              name="backend-modules-tab"
              text="Backend Modules"
              onClick={() => {}}
              onKeyDown={() => {}}
            />
          </ContentSwitcher>
        </div>
        <div>
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
      <div className={styles.content}>
        {activeTab == 0 ? (
          <Configuration setHasAlert={setConfigHasAlert} />
        ) : (
          <ModuleDiagnostics
          setHasAlert={setDiagnosticsHasAlert}
          modulesWithMissingBackendModules={
            props.modulesWithMissingBackendModules
          }
          modulesWithWrongBackendModulesVersion={
            props.modulesWithWrongBackendModulesVersion
          }
        />
        )}
      </div>
    </div>
  );
}

type DevToolsPopupProps = {
  close(): void;
  setHasAlert(value: boolean): void;
  modulesWithMissingBackendModules: Array<MissingBackendModules>;
  modulesWithWrongBackendModulesVersion: Array<MissingBackendModules>;
  visibleTabIndex?: number;
};
