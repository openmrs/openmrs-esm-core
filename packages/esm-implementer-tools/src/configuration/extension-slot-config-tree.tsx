import React, { useMemo, useState, useEffect } from "react";
import {
  getExtensionSlotsForModule,
  getExtensionIdsForExtensionSlot,
} from "@openmrs/esm-extensions";
import styles from "./configuration.styles.css";
import EditableValue from "./editable-value.component";

interface ExtensionSlotConfigTreeProps {
  moduleName: string;
}

export function ExtensionSlotConfigTree({
  moduleName,
}: ExtensionSlotConfigTreeProps) {
  const extensionSlotNames = useMemo(
    () => getExtensionSlotsForModule(moduleName),
    []
  );
  const [
    extensionIdsForExtensionSlot,
    setExtensionIdsForExtensionSlot,
  ] = useState({});

  useEffect(() => {
    Promise.all(
      extensionSlotNames.map((slotName) =>
        getExtensionIdsForExtensionSlot(slotName, moduleName)
      )
    ).then((extensionIdsArr) => {
      const idsForExtSlot = Object.fromEntries(
        extensionSlotNames.map((name, i) => [name, extensionIdsArr[i]])
      );
      console.log(idsForExtSlot);
      setExtensionIdsForExtensionSlot(idsForExtSlot)
      }
    );
  }, []);

  return extensionSlotNames.length ? (
    <div className={styles.treeIndent}>
      extensions: {JSON.stringify(extensionIdsForExtensionSlot)}
      {extensionSlotNames.map((slotName) => (
        <div className={styles.treeIndent}>
          {slotName}:
          {extensionIdsForExtensionSlot[slotName]?.map(
            (extensionId: string) =>
            <div className={styles.treeIndent}>
              add: <EditableValue path={[moduleName, 'extensions', slotName, 'add']} value={''}/>
            </div>
          )}
        </div>
      ))}
    </div>
  ) : null;
}
