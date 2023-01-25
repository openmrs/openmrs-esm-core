import React, { useMemo, useState } from "react";
import {
  Button,
  Column,
  FlexGrid,
  Row,
  TextInput,
  Toggle,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  ChevronUp,
  Download,
  TrashCan,
} from "@carbon/react/icons";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import {
  Config,
  getExtensionInternalStore,
  implementerToolsConfigStore,
  temporaryConfigStore,
  useStore,
  useStoreWithActions,
} from "@openmrs/esm-framework/src/internal";
import { ConfigTree } from "./interactive-editor/config-tree.component";
import { Description } from "./interactive-editor/description.component";
import { implementerToolsStore, ImplementerToolsStore } from "../store";
import styles from "./configuration.styles.scss";

const JsonEditor = React.lazy(
  () => import("./json-editor/json-editor.component")
);

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
  toggleIsJsonModeEnabled({ isJsonModeEnabled }: ImplementerToolsStore) {
    return { isJsonModeEnabled: !isJsonModeEnabled };
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
    renderIcon={isConfigToolbarOpen ? ChevronUp : ChevronDown}
    onClick={toggleIsToolbarOpen}
    kind="ghost"
    size="sm"
    tooltipPosition="left"
    iconDescription={`${isConfigToolbarOpen ? "Hide" : "Show"} toolbar`}
  />
);

export interface ConfigurationProps {}

export const Configuration: React.FC<ConfigurationProps> = () => {
  const { t } = useTranslation();
  const {
    isUIEditorEnabled,
    toggleIsUIEditorEnabled,
    isJsonModeEnabled,
    toggleIsJsonModeEnabled,
    isConfigToolbarOpen,
    toggleIsToolbarOpen,
  } = useStoreWithActions(implementerToolsStore, actions);
  const { config } = useStore(implementerToolsConfigStore);
  const extensionStore = useStore(getExtensionInternalStore());
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
        if (!result[slot.moduleName].extensionSlots) {
          result[slot.moduleName].extensionSlots = {};
        }
        if (!result[slot.moduleName].extensionSlots[slot.name]) {
          result[slot.moduleName].extensionSlots[slot.name] = {};
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

  const mainContentHeight = isConfigToolbarOpen
    ? "calc(50vh - 7rem)"
    : "calc(50vh - 2rem)";
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
          <FlexGrid style={{ padding: "0.5em 1.5em" }}>
            <Row className={styles.row}>
              <Column>
                <TextInput
                  id="extensionSearch"
                  labelText="Search configuration"
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </Column>
              <Column className={styles.toggleButtons}>
                <Toggle
                  className={styles.toggle}
                  id="jsonModeSwitch"
                  labelText={t("jsonEditor", "JSON Editor")}
                  onToggle={toggleIsJsonModeEnabled}
                  toggled={isJsonModeEnabled}
                />
                <Toggle
                  className={styles.toggle}
                  id="uiEditorSwitch"
                  labelText={t("uiEditor", "UI Editor")}
                  toggled={isUIEditorEnabled}
                  onToggle={toggleIsUIEditorEnabled}
                />
              </Column>
              <Column className={styles.actionButtons}>
                <Button
                  kind="danger"
                  iconDescription="Clear local config"
                  renderIcon={(props) => <TrashCan size={16} {...props} />}
                  onClick={() => {
                    temporaryConfigStore.setState({ config: {} });
                  }}
                >
                  {t("clearConfig", "Clear Local Config")}
                </Button>
                <Button
                  kind="secondary"
                  iconDescription="Download config"
                  renderIcon={(props) => <Download size={16} {...props} />}
                >
                  <a
                    className={styles.downloadLink}
                    download="temporary_config.json"
                    href={window.URL.createObjectURL(tempConfigObjUrl)}
                  >
                    {t("downloadConfig", "Download Config")}
                  </a>
                </Button>
              </Column>
            </Row>
          </FlexGrid>
        ) : null}
      </div>
      <div className={styles.mainContent} style={{ height: mainContentHeight }}>
        {isJsonModeEnabled ? (
          <JsonEditor height={mainContentHeight} />
        ) : (
          <>
            <div className={styles.configTreePane}>
              <ConfigTree config={filteredConfig} />
            </div>
            <div className={styles.descriptionPane}>
              <Description />
            </div>
          </>
        )}
      </div>
    </>
  );
};
