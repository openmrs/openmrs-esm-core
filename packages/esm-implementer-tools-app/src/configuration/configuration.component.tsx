import React, { useEffect, useState } from "react";
import {
  ConfigInternalStore,
  configInternalStore,
  implementerToolsConfigStore,
  temporaryConfigStore,
} from "@openmrs/esm-config";
import { Button, Column, Grid, Row, Toggle } from "carbon-components-react";
import { Download16, TrashCan16 } from "@carbon/icons-react";
import styles from "./configuration.styles.css";
import { ConfigTree } from "./config-tree.component";
import { implementerToolsStore, ImplementerToolsStore } from "../store";
import { Description } from "./description.component";
import { useStore } from "@openmrs/esm-react-utils";

export type ConfigurationProps = {
  setHasAlert(value: boolean): void;
};

const actions = {
  toggleIsUIEditorEnabled({ isUIEditorEnabled }: ImplementerToolsStore) {
    return { isUIEditorEnabled: !isUIEditorEnabled };
  },
};

const configActions = {
  toggleDevDefaults({ devDefaultsAreOn }: ConfigInternalStore) {
    return { devDefaultsAreOn: !devDefaultsAreOn };
  },
};

export function Configuration({ setHasAlert }: ConfigurationProps) {
  const { isUIEditorEnabled, toggleIsUIEditorEnabled } = useStore(
    implementerToolsStore,
    actions
  );
  const { devDefaultsAreOn, toggleDevDefaults } = useStore(
    configInternalStore,
    configActions
  );
  const { config } = useStore(implementerToolsConfigStore);
  const tempConfigStore = useStore(temporaryConfigStore);
  const tempConfig = tempConfigStore.config;
  const tempConfigObjUrl = new Blob(
    [JSON.stringify(tempConfig, undefined, 2)],
    {
      type: "application/json",
    }
  );

  return (
    <>
      <div className={styles.tools}>
        <Grid style={{ margin: "0.25rem", padding: 0 }}>
          <Row>
            <Column sm={1} md={1}>
              <Toggle
                id="devConfigSwitch"
                labelText="Dev Config"
                onToggle={toggleDevDefaults}
                toggled={devDefaultsAreOn}
              />
            </Column>
            <Column sm={1} md={1} className={styles.actionButton}>
              <Toggle
                id={"uiEditorSwitch"}
                labelText="UI Editor"
                toggled={isUIEditorEnabled}
                onToggle={toggleIsUIEditorEnabled}
              />
            </Column>
            <Column sm={1} md={2} className={styles.actionButton}>
              <Button
                kind="danger"
                iconDescription="Clear temporary config"
                renderIcon={TrashCan16}
                onClick={() => {
                  temporaryConfigStore.setState({ config: {} });
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
  );
}
