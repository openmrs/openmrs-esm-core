import React from "react";
import styles from "./styles.css";
import Close16 from "@carbon/icons-react/es/close/16";
import { useExtensionInternalStore, useStore } from "@openmrs/esm-framework";
import { Button } from "carbon-components-react";
import { Portal } from "./portal";
import { ExtensionOverlay } from "./extension-overlay.component";
import { ImplementerToolsStore, implementerToolsStore } from "../store";

export function UiEditor() {
  const { slots, extensions } = useExtensionInternalStore();
  const { isOpen: implementerToolsIsOpen } = useStore(implementerToolsStore);

  return (
    <>
      {implementerToolsIsOpen ? null : <ExitButton />}
      {slots
        ? Object.entries(slots).map(([slotName, slotInfo]) => (
            <Portal
              key={`slot-overlay-${slotInfo.moduleName}-${slotName}`}
              el={document.querySelector(
                `*[data-extension-slot-name="${slotName}"][data-extension-slot-module-name="${slotInfo.moduleName}"]`
              )}
            >
              <SlotOverlay slotName={slotName} />
            </Portal>
          ))
        : null}
      {extensions
        ? Object.entries(extensions).map(([extensionName, extensionInfo]) =>
            Object.entries(extensionInfo.instances).map(
              ([slotModuleName, bySlotName]) =>
                Object.entries(bySlotName).map(
                  ([slotName, extensionInstance]) => (
                    <ExtensionOverlay
                      key={slotName}
                      extensionName={extensionName}
                      slotModuleName={slotModuleName}
                      slotName={slotName}
                      domElement={document.querySelector(
                        `*[data-extension-slot-name="${slotName}"][data-extension-slot-module-name="${slotModuleName}"] *[data-extension-id="${extensionInstance.id}"]`
                      )}
                    />
                  )
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

const actions = {
  toggleIsUIEditorEnabled({ isUIEditorEnabled }: ImplementerToolsStore) {
    return { isUIEditorEnabled: !isUIEditorEnabled };
  },
};

export function ExitButton() {
  const { toggleIsUIEditorEnabled } = useStore(implementerToolsStore, actions);
  return (
    <Button
      className={styles.exitButton}
      kind="danger"
      size="sm"
      renderIcon={Close16}
      iconDescription="Exit UI Editor"
      tooltipPosition="left"
      onClick={toggleIsUIEditorEnabled}
      hasIconOnly
    />
  );
}
