import React from "react";
import TrashCan16 from "@carbon/icons-react/es/trash-can/16";
import Download16 from "@carbon/icons-react/es/download/16";
import ChevronDown16 from "@carbon/icons-react/es/chevron--down/16";
import ChevronUp16 from "@carbon/icons-react/es/chevron--up/16";
import Button from "carbon-components-react/es/components/Button";
import Toggle from "carbon-components-react/es/components/Toggle";
import styles from "./configuration.styles.css";
import {
  ConfigInternalStore,
  configInternalStore,
  implementerToolsConfigStore,
  temporaryConfigStore,
  useStore,
} from "@openmrs/esm-framework";
import { Column, Grid, Row } from "carbon-components-react/es/components/Grid";
import { ConfigTree } from "./config-tree.component";
import { Description } from "./description.component";
import { implementerToolsStore, ImplementerToolsStore } from "../store";

export type ConfigurationProps = {
  setHasAlert(value: boolean): void;
};

const actions = {
  toggleIsUIEditorEnabled({ isUIEditorEnabled }: ImplementerToolsStore) {
    return { isUIEditorEnabled: !isUIEditorEnabled };
  },
  toggleIsToolbarOpen({ isConfigToolbarOpen }: ImplementerToolsStore) {
    return { isConfigToolbarOpen: !isConfigToolbarOpen };
  },
};

const configActions = {
  toggleDevDefaults({ devDefaultsAreOn }: ConfigInternalStore) {
    return { devDefaultsAreOn: !devDefaultsAreOn };
  },
};

export function Configuration({ setHasAlert }: ConfigurationProps) {
  const {
    isUIEditorEnabled,
    toggleIsUIEditorEnabled,
    isConfigToolbarOpen,
    toggleIsToolbarOpen,
  } = useStore(implementerToolsStore, actions);
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
        {isConfigToolbarOpen ? (
          <Grid style={{ margin: "0.25rem", padding: "0.5em 1.5em" }}>
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
                  id="uiEditorSwitch"
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
        ) : null}
        <div className={styles.toggleToolbarButton}>
          <OpenOrCloseButton
            isConfigToolbarOpen={isConfigToolbarOpen}
            toggleIsToolbarOpen={toggleIsToolbarOpen}
          />
        </div>
      </div>
      <div
        className={styles.mainContent}
        style={{
          marginTop: isConfigToolbarOpen ? "72px" : "25px",
          height: isConfigToolbarOpen
            ? "calc(50vh - 114px)"
            : "calc(50vh - 68px)",
        }}
      >
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

function OpenOrCloseButton({ isConfigToolbarOpen, toggleIsToolbarOpen }) {
  return (
    <Button
      hasIconOnly
      renderIcon={isConfigToolbarOpen ? ChevronUp16 : ChevronDown16}
      onClick={toggleIsToolbarOpen}
      kind="ghost"
      size="small"
      iconDescription={`${isConfigToolbarOpen ? "Hide" : "Show"} toolbar`}
    ></Button>
  );
}
