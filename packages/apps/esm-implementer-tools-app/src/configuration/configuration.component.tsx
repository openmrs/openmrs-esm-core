import React, { useMemo, useState } from "react";
import ChevronDown16 from "@carbon/icons-react/es/chevron--down/16";
import ChevronUp16 from "@carbon/icons-react/es/chevron--up/16";
import Download16 from "@carbon/icons-react/es/download/16";
import TrashCan16 from "@carbon/icons-react/es/trash-can/16";
import {
  Config,
  ConfigInternalStore,
  configInternalStore,
  implementerToolsConfigStore,
  temporaryConfigStore,
  useExtensionStore,
  useStore,
} from "@openmrs/esm-framework";
import Button from "carbon-components-react/es/components/Button";
import { Column, Grid, Row } from "carbon-components-react/es/components/Grid";
import TextInput from "carbon-components-react/es/components/TextInput";
import Toggle from "carbon-components-react/es/components/Toggle";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import { useTranslation } from "react-i18next";
import { implementerToolsStore, ImplementerToolsStore } from "../store";
import { ConfigTree } from "./config-tree.component";
import styles from "./configuration.styles.css";
import { Description } from "./description.component";

function isLeaf(configNode: Config) {
  return (
    typeof configNode == "object" &&
    !Array.isArray(configNode) &&
    (configNode["_default"] || configNode["_type"])
  );
}

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

interface OpenOrCloseButtonProps {
  isConfigToolbarOpen: boolean;
  toggleIsToolbarOpen(): void;
}

const OpenOrCloseButton: React.FC<OpenOrCloseButtonProps> = ({
  isConfigToolbarOpen,
  toggleIsToolbarOpen,
}) => (
  <Button
    hasIconOnly
    renderIcon={isConfigToolbarOpen ? ChevronUp16 : ChevronDown16}
    onClick={toggleIsToolbarOpen}
    kind="ghost"
    size="small"
    iconDescription={`${isConfigToolbarOpen ? "Hide" : "Show"} toolbar`}
  />
);

export interface ConfigurationProps {}

export const Configuration: React.FC<ConfigurationProps> = () => {
  const { t } = useTranslation();
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
  const extensionStore = useExtensionStore();
  const tempConfigStore = useStore(temporaryConfigStore);
  const [filterText, setFilterText] = useState("");
  const tempConfig = tempConfigStore.config;
  const tempConfigObjUrl = new Blob(
    [JSON.stringify(tempConfig, undefined, 2)],
    {
      type: "application/json",
    }
  );

  const combinedConfig = useMemo(() => {
    const result = cloneDeep(config);
    for (let slot of Object.values(extensionStore.slots)) {
      for (let moduleName of Object.keys(slot.instances)) {
        if (!result[moduleName].extensions) {
          result[moduleName].extensions = {};
        }
        if (!result[moduleName].extensions[slot.name]) {
          result[moduleName].extensions[slot.name] = {};
        }
      }
    }
    return result;
  }, [config, extensionStore]);

  const filteredConfig = useMemo(() => {
    function getRelatedBranches(inputTree: Config, filterText: string) {
      const result = {};
      for (let k of Object.keys(inputTree)) {
        if (k.includes(filterText)) {
          result[k] = cloneDeep(inputTree[k]);
        } else {
          if (!isLeaf(inputTree[k])) {
            const kSubtreeResult = getRelatedBranches(inputTree[k], filterText);
            if (!isEmpty(kSubtreeResult)) {
              result[k] = kSubtreeResult;
            }
          }
        }
      }
      return result;
    }
    return filterText
      ? getRelatedBranches(combinedConfig, filterText)
      : combinedConfig;
  }, [filterText, combinedConfig]);

  return (
    <>
      <div className={styles.tools}>
        {isConfigToolbarOpen ? (
          <Grid style={{ margin: "0.25rem", padding: "0.5em 1.5em" }}>
            <Row>
              <Column sm={1} md={2}>
                <TextInput
                  id="extensionSearch"
                  labelText="Search extensions"
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </Column>
              <Column sm={1} md={1}>
                <Toggle
                  id="devConfigSwitch"
                  labelText={t("devConfig", "Dev Config")}
                  onToggle={toggleDevDefaults}
                  toggled={devDefaultsAreOn}
                />
              </Column>
              <Column sm={1} md={1} className={styles.actionButton}>
                <Toggle
                  id="uiEditorSwitch"
                  labelText={t("uiEditor", "UI Editor")}
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
                  {t("clearTemporaryConfig", "Clear Temporary Config")}
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
                    {t("downloadTemporaryConfig", "Download Temporary Config")}
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
          <ConfigTree config={filteredConfig} />
        </div>
        <div className={styles.descriptionPane}>
          <Description />
        </div>
      </div>
    </>
  );
};
