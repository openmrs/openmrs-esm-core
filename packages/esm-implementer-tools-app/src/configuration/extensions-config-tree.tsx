import React, { useMemo } from "react";
import { ExtensionSlotConfig } from "@openmrs/esm-config";
import { ExtensionSlotInfo, ExtensionStore } from "@openmrs/esm-extensions";
import { Provider, connect } from "unistore/react";
import styles from "./configuration.styles.css";
import EditableValue from "./editable-value.component";
import { ConfigSubtree } from "./config-subtree.component";
import { getGlobalStore } from "@openmrs/esm-api";
import { getStore } from "../store";
import { isEqual } from "lodash-es";

interface ExtensionsConfigTreeProps {
  config: { [key: string]: any };
  moduleName: string;
}

interface ExtensionsConfigTreeImplProps extends ExtensionsConfigTreeProps {
  slots: Record<string, ExtensionSlotInfo>;
}

const ExtensionsConfigTreeImpl = connect(
  (state: ExtensionStore, _: ExtensionsConfigTreeProps) => ({
    slots: state.slots,
  })
)(({ config, moduleName, slots }: ExtensionsConfigTreeImplProps) => {
  const extensionSlotNames = useMemo(
    () =>
      Object.keys(slots).filter((name) => moduleName in slots[name].instances),
    [slots]
  );

  return extensionSlotNames.length ? (
    <div className={styles.treeIndent}>
      extensions:
      {extensionSlotNames.map((slotName) => (
        <div key={slotName} className={styles.treeIndent}>
          <ExtensionSlotConfigTree
            config={config?.[slotName]}
            path={[moduleName, "extensions", slotName]}
          />
        </div>
      ))}
    </div>
  ) : null;
});

export function ExtensionsConfigTree(props) {
  const store = React.useMemo(() => getGlobalStore("extensions"), []);

  return (
    <Provider store={store}>
      <ExtensionsConfigTreeImpl {...props} />
    </Provider>
  );
}

interface ExtensionSlotConfigProps {
  config: ExtensionSlotConfig;
  path: string[];
}

function ExtensionSlotConfigTree({ config, path }: ExtensionSlotConfigProps) {
  const store = getStore();
  const moduleName = path[0];
  const slotName = path[2];

  function setActiveItemDescriptionOnMouseEnter(
    moduleName,
    slotName,
    key,
    value
  ) {
    if (!store.getState().configPathBeingEdited) {
      store.setState({
        activeItemDescription: {
          path: [moduleName, slotName, key],
          source: value?._source,
          description: {
            add: "Add an extension to this slot.",
            remove: "Remove an extension from this slot.",
            order: "Reorder the extensions in this slot.",
            configure:
              "Pass a configuration object directly to one of the extensions in this slot.",
          }[key],
          value: JSON.stringify(value?._value),
        },
      });
    }
  }

  function removeActiveItemDescriptionOnMouseLeave(thisPath) {
    const state = store.getState();
    if (
      isEqual(state.activeItemDescription?.path, thisPath) &&
      !isEqual(state.configPathBeingEdited, thisPath)
    ) {
      store.setState({ activeItemDescription: undefined });
    }
  }

  return (
    <div>
      {slotName}:
      {["add", "remove", "order"].map((key) => (
        <div
          key={path.join(".") + key}
          onMouseEnter={() =>
            setActiveItemDescriptionOnMouseEnter(
              moduleName,
              slotName,
              key,
              config?.[key]
            )
          }
          onMouseLeave={() =>
            removeActiveItemDescriptionOnMouseLeave([moduleName, slotName, key])
          }
        >
          <div className={`${styles.treeIndent} ${styles.treeLeaf}`}>
            {key}:{" "}
            <EditableValue
              path={path.concat([key])}
              element={config?.[key] ?? { _value: [], _source: "default" }}
            />
          </div>
        </div>
      ))}
      <div
        className={`${styles.treeIndent} ${styles.treeLeaf}`}
        onMouseEnter={() =>
          setActiveItemDescriptionOnMouseEnter(
            moduleName,
            slotName,
            "configure",
            config?.configure
          )
        }
        onMouseLeave={() =>
          removeActiveItemDescriptionOnMouseLeave([
            moduleName,
            slotName,
            "configure",
          ])
        }
      >
        configure:{" "}
        {config?.configure ? (
          <div className={styles.extExpand}>
            <ConfigSubtree
              path={path.concat(["configure"])}
              config={config?.configure}
            />
          </div>
        ) : (
          <EditableValue
            path={path.concat(["configure"])}
            element={{ _value: "", _source: "", _default: "" }}
          />
        )}
      </div>
    </div>
  );
}
