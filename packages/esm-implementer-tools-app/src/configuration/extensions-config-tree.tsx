import React, { useMemo } from "react";
import { ExtensionSlotConfig } from "@openmrs/esm-config";
import { ExtensionSlotInfo, ExtensionStore } from "@openmrs/esm-extensions";
import { connect } from "unistore/react";
import styles from "./configuration.styles.css";
import EditableValue, {
  ConfigValueDescriptor,
} from "./editable-value.component";
import ConfigTree from "./config-tree.component";

interface ExtensionsConfigTreeProps {
  config: { [key: string]: any };
  moduleName: string;
}

interface ExtensionsConfigTreeImplProps extends ExtensionsConfigTreeProps {
  slots: Record<string, ExtensionSlotInfo>;
}

const ExtensionsConfigTreeImpl: React.FC<ExtensionsConfigTreeImplProps> = ({
  config,
  moduleName,
  slots,
}) => {
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
};

export const ExtensionsConfigTree = connect(
  (state: ExtensionStore, _: ExtensionsConfigTreeProps) => ({
    slots: state.slots,
  })
)(ExtensionsConfigTreeImpl);

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
            <ConfigTree
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
