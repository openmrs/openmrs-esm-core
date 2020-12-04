import React, { useEffect, useState } from "react";
import {
  getImplementerToolsConfig,
  getAreDevDefaultsOn,
  setAreDevDefaultsOn,
  clearTemporaryConfig,
  getTemporaryConfig,
} from "@openmrs/esm-config";
import { Button, Column, Grid, Row, Toggle } from "carbon-components-react";
import { Download16, TrashCan16 } from "@carbon/icons-react";
import styles from "./configuration.styles.css";
import { ConfigTree } from "./config-tree.component";
import { getStore, ImplementerToolsStore, useStore } from "../store";
import { Description } from "./description.component";

export type ConfigurationProps = {
  setHasAlert(value: boolean): void;
};

const actions = {
  toggleIsUIEditorEnabled({ isUIEditorEnabled }: ImplementerToolsStore) {
    return { isUIEditorEnabled: !isUIEditorEnabled };
  },
};

export function Configuration({ setHasAlert }: ConfigurationProps) {
  const { isUIEditorEnabled, toggleIsUIEditorEnabled } = useStore(
    ["isUIEditorEnabled"],
    actions
  );
  const [config, setConfig] = useState({});
  const [isDevConfigActive, setIsDevConfigActive] = useState(
    getAreDevDefaultsOn()
  );
  const store = getStore();
  const tempConfig = getTemporaryConfig();
  const tempConfigObjUrl = new Blob(
    [JSON.stringify(tempConfig, undefined, 2)],
    {
      type: "application/json",
    }
  );

  const updateConfig = () => {
    getImplementerToolsConfig().then((res) => {
      setConfig(res);
    });
  };

  useEffect(updateConfig, []);

  return (
<<<<<<< HEAD
    <>
      <div className={styles.tools}>
        <Grid style={{ margin: "0.25rem", padding: 0 }}>
          <Row>
            <Column sm={1} md={1}>
              <Toggle
                id="devConfigSwitch"
                labelText="Dev Config"
                onToggle={() => {
                  setAreDevDefaultsOn(!isDevConfigActive);
                  setIsDevConfigActive(!isDevConfigActive);
                }}
                toggled={isDevConfigActive}
              />
            </Column>
            <Column sm={1} md={1} className={styles.actionButton}>
              <Toggle
                id={"uiEditorSwitch"}
                labelText="UI Editor"
                toggled={isUIEditorActive}
                onToggle={() => {
                  setIsUIEditorActive(!isUIEditorActive);
                  setIsUIEditorEnabled(!isUIEditorActive);
                }}
              />
            </Column>
            <Column sm={1} md={2} className={styles.actionButton}>
              <Button
                kind="danger"
                iconDescription="Clear temporary config"
                renderIcon={TrashCan16}
                onClick={() => {
                  clearTemporaryConfig();
                  updateConfig();
                }}
              >
                Clear Temporary Config
              </Button>
            </Column>
            <Column sm={1} md={2} className={styles.actionButton}>
              <Button
                kind="secondary"
                iconDescription="Download temporary config"
                renderIcon={Download16}
              >
                <a
                  className={styles.downloadLink}
                  download="temporary_config.json"
                  href={window.URL.createObjectURL(tempConfigObjUrl)}
                >
                  Download Temporary Config
                </a>
              </Button>
            </Column>
          </Row>
        </Grid>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.configTreePane}>
          <ConfigTree config={config} />
        </div>
        <div className={styles.descriptionPane}>
          <Description />
        </div>
      </div>
    </>
=======
<>
<div className={styles.tools}>
            <Toggle
              id="devConfigSwitch"
              labelText="Dev Config"
              onToggle={() => {
                setAreDevDefaultsOn(!isDevConfigActive);
                setIsDevConfigActive(!isDevConfigActive);
              }}
              toggled={isDevConfigActive}
            />
            <Toggle
              id={"uiEditorSwitch"}
              labelText="UI Editor"
              toggled={isUIEditorEnabled}
              onToggle={toggleIsUIEditorEnabled}
            />
            <Button
              small
              kind="secondary"
              onClick={() => {
                clearTemporaryConfig();
                updateConfig();
              }}
            >
              Clear Temporary Config
            </Button>
            <Button small kind="secondary" renderIcon={Download16}>
              <a
                className={styles.downloadLink}
                download="temporary_config.json"
                href={window.URL.createObjectURL(tempConfigObjUrl)}
              >
                Download Temporary Config
              </a>
            </Button>
            </div>
      <div className={styles.mainContent}>
        <div className={styles.configTreePane}>
          <ConfigTree config={config} />
        </div>
        <div className={styles.descriptionPane}>
          <Description />
        </div>
      </div>
    </>
>>>>>>> c4338a5... Make the UI Editor work via portals
  );
}
