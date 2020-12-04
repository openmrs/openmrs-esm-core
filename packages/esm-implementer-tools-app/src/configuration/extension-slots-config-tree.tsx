import React, { useEffect, useMemo, useState } from "react";
import { ExtensionSlotConfig } from "@openmrs/esm-config";
import {
  ExtensionSlotInfo,
  extensionStore,
  ExtensionStore,
} from "@openmrs/esm-extensions";
import { Provider, connect } from "unistore/react";
import styles from "./configuration.styles.css";
import EditableValue from "./editable-value.component";
import { ConfigSubtree } from "./config-subtree.component";
import { getGlobalStore } from "@openmrs/esm-api";
import { getStore } from "../store";
import { isEqual } from "lodash-es";
import { ExtensionConfigureTree } from "./extension-configure-tree";
import { ExtensionSlotAdd } from "./extension-slot-add";

interface ExtensionsSlotsConfigTreeProps {
  config: { [key: string]: any };
  moduleName: string;
}

interface ExtensionSlotsConfigTreeImplProps
  extends ExtensionsSlotsConfigTreeProps {
  slots: Record<string, ExtensionSlotInfo>;
}

const ExtensionSlotsConfigTreeImpl = connect(
  (state: ExtensionStore, _: ExtensionsSlotsConfigTreeProps) => ({
    slots: state.slots,
  })
)(({ config, moduleName, slots }: ExtensionSlotsConfigTreeImplProps) => {
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

export function ExtensionSlotsConfigTree(props) {
  const store = React.useMemo(() => getGlobalStore("extensions"), []);

  return (
    <Provider store={store}>
      <ExtensionSlotsConfigTreeImpl {...props} />
    </Provider>
  );
}

interface ExtensionSlotConfigProps {
  config: ExtensionSlotConfig;
  path: string[];
}

function ExtensionSlotConfigTree({ config, path }: ExtensionSlotConfigProps) {
  const [assignedExtensions, setAssignedExtensions] = useState<Array<string>>(
    []
  );
  const store = getStore();
  const moduleName = path[0];
  const slotName = path[2];

  useEffect(() => {
    function update(state) {
      setAssignedExtensions(
        state.slots[slotName]?.instances?.[moduleName]?.assignedIds
      );
    }
    update(extensionStore.getState());
    return extensionStore.subscribe(update);
  }, []);

  function setActiveExtensionSlotOnMouseEnter(moduleName, slotName) {
    if (!store.getState().configPathBeingEdited) {
      store.setState({
        activeItemDescription: {
          path: [moduleName, slotName],
          value: assignedExtensions,
        },
      });
    }
  }

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
    <>
      <div
        onMouseEnter={() =>
          setActiveExtensionSlotOnMouseEnter(moduleName, slotName)
        }
        onMouseLeave={() =>
          removeActiveItemDescriptionOnMouseLeave([moduleName, slotName])
        }
      >
        {slotName}:
      </div>

      {(["add", "remove", "order", "configure"] as const).map((key) => (
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
            {key === "configure" ? (
              <ExtensionConfigureTree
                moduleName={moduleName}
                slotName={slotName}
                config={config?.configure}
              />
            ) : (
              <EditableValue
                path={path.concat([key])}
                element={
                  { _value: config?.[key], _source: "", _default: [] } ?? {
                    _value: [],
                    _source: "default",
                    _default: [],
                  }
                }
                customType={key}
              />
            )}
          </div>
        </div>
      ))}
    </>
  );
}
