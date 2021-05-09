import React from "react";
import styles from "./styles.css";
import { Portal } from "./portal";
import { ExtensionOverlay } from "./extension-overlay.component";
import { useExtensionStore } from "@openmrs/esm-framework";

export function UiEditor() {
  const { slots, extensions } = useExtensionStore();

  return (
    <>
      {slots
        ? Object.entries(slots).map(([slotName, slotInfo]) =>
            Object.keys(slotInfo.instances).map((slotModuleName) => (
              <Portal
                key={`slot-overlay-${slotModuleName}-${slotName}`}
                el={document.querySelector(
                  `*[data-extension-slot-name="${slotName}"][data-extension-slot-module-name="${slotModuleName}"]`
                )}
              >
                <SlotOverlay slotName={slotName} />
              </Portal>
            ))
          )
        : null}
      {extensions
        ? Object.entries(extensions).map(([extensionName, extensionInfo]) =>
            Object.entries(
              extensionInfo.instances
            ).map(([slotModuleName, bySlotName]) =>
              Object.entries(
                bySlotName
              ).map(([slotName, extensionInstance]) => (
                <ExtensionOverlay
                  key={slotName}
                  extensionName={extensionName}
                  slotModuleName={slotModuleName}
                  slotName={slotName}
                  domElement={document.querySelector(
                    `*[data-extension-slot-name="${slotName}"][data-extension-slot-module-name="${slotModuleName}"] *[data-extension-id="${extensionInstance.id}"]`
                  )}
                />
              ))
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
