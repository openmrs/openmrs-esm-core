import React, { useMemo } from "react";
import { ExtensionSlotConfig } from "@openmrs/esm-config";
import { ExtensionSlotInfo, ExtensionStore } from "@openmrs/esm-extensions";
import { connect } from "unistore/react";
import styles from "./configuration.styles.css";
import EditableValue from "./editable-value.component";

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
      Object.keys(slots).filter((name) =>
        slots[name].modules.includes(moduleName)
      ),
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
      {["add", "remove", "order", "configure"].map((key) => (
        <div key={key} className={`${styles.treeIndent} ${styles.treeLeaf}`}>
          {key}:{" "}
          <EditableValue
            path={path.concat([key])}
            element={config?.[key] || { _value: [], _source: "default" }}
          />
        </div>
      ))}
    </div>
  );
}
