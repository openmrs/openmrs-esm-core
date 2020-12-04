import React, { useEffect, useState } from "react";
import {
  getImplementerToolsConfig,
  getAreDevDefaultsOn,
  setAreDevDefaultsOn,
  clearTemporaryConfig,
  getTemporaryConfig,
} from "@openmrs/esm-config";
import { Column, Grid, Row, Toggle, Button } from "carbon-components-react";
import { Download16 } from "@carbon/icons-react";
import { Provider } from "unistore/react";
import styles from "./configuration.styles.css";
import { ConfigTree } from "./config-tree.component";
import {
  getIsUIEditorEnabled,
  setIsUIEditorEnabled,
} from "@openmrs/esm-extensions";
import { getStore } from "../store";
import { Description } from "./description.component";

export default function Configuration(props: ConfigurationProps) {
  const [config, setConfig] = useState({});
  const [isDevConfigActive, setIsDevConfigActive] = useState(
    getAreDevDefaultsOn()
  );
  const [isUIEditorActive, setIsUIEditorActive] = useState(
    getIsUIEditorEnabled()
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
    <Provider store={store}>
      <div className={styles.panel}>
        <Grid>
          <Row>
            <Column className={styles.tools}>
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
                toggled={isUIEditorActive}
                onToggle={() => {
                  setIsUIEditorActive(!isUIEditorActive);
                  setIsUIEditorEnabled(!isUIEditorActive);
                }}
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
            </Column>
          </Row>
          <Row className={styles.mainContent}>
            <Column sm={2} className={styles.configContent}>
              <ConfigTree config={config} />
            </Column>
            <Column sm={2}>
              <Description />
            </Column>
          </Row>
        </Grid>
      </div>
    </Provider>
  );
}

type ConfigurationProps = {
  setHasAlert(value: boolean): void;
};
