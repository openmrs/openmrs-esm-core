import React from "react";
import {
  getImplementerToolsConfig,
  getAreDevDefaultsOn,
  setAreDevDefaultsOn,
  clearTemporaryConfig,
  getTemporaryConfig,
} from "@openmrs/esm-config";
import { Column, Grid, Row, Toggle, Button } from "carbon-components-react";
import { Download16 } from "@carbon/icons-react";
import styles from "./configuration.styles.css";
import ConfigTree from "./config-tree.component";
import {
  getIsUIEditorEnabled,
  setIsUIEditorEnabled,
} from "@openmrs/esm-extensions";

export default function Configuration(props: ConfigurationProps) {
  const [config, setConfig] = React.useState({});
  const [isDevConfigActive, setIsDevConfigActive] = React.useState(
    getAreDevDefaultsOn()
  );
  const [isUIEditorActive, setIsUIEditorActive] = React.useState(
    getIsUIEditorEnabled()
  );
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

  React.useEffect(updateConfig, []);

  return (
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
        <Row>
          <Column className={styles.configContent}>
            <ConfigTree config={config} />
          </Column>
        </Row>
      </Grid>
    </div>
  );
}

type ConfigurationProps = {
  setHasAlert(value: boolean): void;
};
