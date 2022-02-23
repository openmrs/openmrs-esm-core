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
  useExtensionInternalStore,
  useStore,
} from "@openmrs/esm-framework";
import {
  Button,
  TextInput,
  Toggle,
  Grid,
  Column,
  Row,
} from "carbon-components-react";
import { useTranslation } from "react-i18next";
import { implementerToolsStore, ImplementerToolsStore } from "../store";
import { ConfigTree } from "./config-tree.component";
import { Description } from "./description.component";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import styles from "./configuration.styles.scss";

function isLeaf(configNode: Config) {
  return (
    configNode.hasOwnProperty("_default") ||
    configNode["_type"] ||
    configNode.hasOwnProperty("_value") ||
    configNode.hasOwnProperty("_source")
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
  const extensionStore = useExtensionInternalStore();
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
      if (slot.moduleName) {
        if (!result[slot.moduleName].extensions) {
          result[slot.moduleName].extensions = {};
        }
        if (!result[slot.moduleName].extensions[slot.name]) {
          result[slot.moduleName].extensions[slot.name] = {};
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
        <div className={styles.toggleToolbarButton}>
          <OpenOrCloseButton
            isConfigToolbarOpen={isConfigToolbarOpen}
            toggleIsToolbarOpen={toggleIsToolbarOpen}
          />
        </div>
        {isConfigToolbarOpen ? (
          <Grid style={{ padding: "0.5em 1.5em" }}>
            <Row>
              <Column sm={1} md={2}>
                <TextInput
                  id="extensionSearch"
                  labelText="Search configuration"
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
      </div>
      <div
        className={styles.mainContent}
        style={{
          height: isConfigToolbarOpen
            ? "calc(50vh - 7rem)"
            : "calc(50vh - 2rem)",
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
