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
import styles from "./configuration.styles.css";
import ConfigTree from "./config-tree.component";
import {
  getIsUIEditorEnabled,
  setIsUIEditorEnabled,
} from "@openmrs/esm-extensions";
import { getStore, ImplementerToolsStore } from "../store";
import { ConfigValueDescriptor } from "./editable-value.component";
import { get } from "lodash-es";

export default function Configuration(props: ConfigurationProps) {
  const [config, setConfig] = useState({});
  const [isDevConfigActive, setIsDevConfigActive] = useState(
    getAreDevDefaultsOn()
  );
  const [isUIEditorActive, setIsUIEditorActive] = useState(
    getIsUIEditorEnabled()
  );
  const [activeConfigElement, setActiveConfigElement] = useState<{
    path: string[];
    value: ConfigValueDescriptor;
  }>();
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

  useEffect(() => {
    const update = (state: ImplementerToolsStore) => {
      if (state.configPathBeingHovered) {
        setActiveConfigElement({
          path: state.configPathBeingHovered,
          value: get(config, state.configPathBeingHovered),
        });
      }
    };
    update(store.getState());
    return store.subscribe((state) => update(state));
  }, [config]);

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
        <Row className={styles.mainContent}>
          <Column sm={3} className={styles.configContent}>
            <ConfigTree config={config} />
          </Column>
          <Column sm={1}>
            <div className={styles.configDescription}>
              {activeConfigElement?.path?.join(".")}
              {activeConfigElement?.value?._description}
              {activeConfigElement?.value?._source}
            </div>
          </Column>
        </Row>
      </Grid>
    </div>
  );
}

type ConfigurationProps = {
  setHasAlert(value: boolean): void;
};
