import React, { useMemo, useState, useEffect } from "react";
import { ExtensionSlotConfig } from "@openmrs/esm-config";
import {
  getExtensionSlotsForModule,
  getAttachedExtensionInfoForSlotAndConfig,
} from "@openmrs/esm-extensions";
import styles from "./configuration.styles.css";
import EditableValue from "./editable-value.component";

export interface ExtensionsConfigTreeProps {
  config: { [key: string]: any };
  moduleName: string;
}

export function ExtensionsConfigTree({
  config,
  moduleName,
}: ExtensionsConfigTreeProps) {
  const extensionSlotNames = useMemo(
    () => getExtensionSlotsForModule(moduleName),
    []
  );
  const [
    extensionIdsForExtensionSlot,
    setExtensionIdsForExtensionSlot,
  ] = useState<Record<string, Array<string>>>({});

  useEffect(() => {
    Promise.all(
      extensionSlotNames.map((slotName) =>
        getAttachedExtensionInfoForSlotAndConfig(slotName, moduleName)
      )
    ).then((attachedExtensionInfos) => {
      const idsForExtSlot = Object.fromEntries(
        extensionSlotNames.map((name, i) => [
          name,
          attachedExtensionInfos[i].map((x) => x.extensionId),
        ])
      );
      setExtensionIdsForExtensionSlot(idsForExtSlot);
    });
  }, []);

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
