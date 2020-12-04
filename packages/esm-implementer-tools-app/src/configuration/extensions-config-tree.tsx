import React, { useMemo } from "react";
import { ExtensionSlotConfig } from "@openmrs/esm-config";
import { ExtensionSlotInfo, ExtensionStore } from "@openmrs/esm-extensions";
import { Provider, connect } from "unistore/react";
import styles from "./configuration.styles.css";
import EditableValue from "./editable-value.component";
import { ConfigSubtree } from "./config-subtree.component";
import { getGlobalStore } from "@openmrs/esm-api";

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
  return (
    <div>
      {path[path.length - 1]}:
      {["add", "remove", "order"].map((key) => (
        <div
          key={path.join(".") + key}
          className={`${styles.treeIndent} ${styles.treeLeaf}`}
        >
          {key}:{" "}
          <EditableValue
            path={path.concat([key])}
            element={config?.[key] ?? { _value: [], _source: "default" }}
          />
        </div>
      ))}
      <div className={`${styles.treeIndent} ${styles.treeLeaf}`}>
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
