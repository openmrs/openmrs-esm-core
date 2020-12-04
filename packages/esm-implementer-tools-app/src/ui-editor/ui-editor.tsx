import React from "react";
import styles from "./styles.css";
import { Portal } from "./portal";
import { ExtensionOverlay } from "./extension-overlay.component";
import { useExtensionStore } from "@openmrs/esm-react-utils";

export function UiEditor() {
  const { slots, extensions } = useExtensionStore(["slots", "extensions"]);

  return (
    <>
      {slots
        ? Object.entries(slots).map(([slotName, slotInfo]) =>
            Object.entries(slotInfo.instances).map(
              ([slotModuleName, slotInstance]) => (
                <Portal
                  key={`slot-overlay-${slotModuleName}-${slotName}`}
                  el={slotInstance.domElement}
                >
                  <SlotOverlay slotName={slotName} />
                </Portal>
              )
            )
          )
        : null}
      {extensions
        ? Object.entries(extensions).map(([extensionName, extensionInfo]) =>
            Object.entries(extensionInfo.instances).map(
              ([slotModuleName, bySlotName]) =>
                Object.entries(bySlotName).map(
                  ([slotName, extensionInstance]) => {
                    return (
                      <ExtensionOverlay
                        extensionName={extensionName}
                        slotModuleName={slotModuleName}
                        slotName={slotName}
                        domElement={extensionInstance.domElement}
                      />
                    );
                  }
                )
            )
          )
        : null}
    </>
  );
}

export function SlotOverlay({ slotName }) {
  return (
    <>
      <div className={styles.slotOverlay}></div>
      <div className={styles.slotName}>{slotName}</div>
    </>
  );
}
