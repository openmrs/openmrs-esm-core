import React from "react";
import styles from "./styles.css";
import {
  getExtensionInternalStore,
  useAssignedExtensions,
  useStore,
  useStoreWithActions,
} from "@openmrs/esm-framework/src/internal";
import { Button } from "@carbon/react";
import { Close } from "@carbon/react/icons";
import { Portal } from "./portal";
import { ExtensionOverlay } from "./extension-overlay.component";
import { ImplementerToolsStore, implementerToolsStore } from "../store";

export default function UiEditor() {
  const { slots, extensions } = useStore(getExtensionInternalStore());
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
              <SlotOverlay
                slotName={slotName}
                moduleName={slotInfo.moduleName}
              />
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

export function SlotOverlay({ slotName, moduleName }) {
  const assignedExtensions = useAssignedExtensions(slotName);

  const setActiveExtensionSlot = (mdName, slotName) => {
    if (!implementerToolsStore.getState().configPathBeingEdited) {
      implementerToolsStore.setState({
        activeItemDescription: {
          path: [mdName, slotName],
          value: assignedExtensions.map((e) => e.id),
        },
      });
    }
  };
  return (
    <>
      <div className={styles.slotOverlay}></div>
      <div
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.preventDefault();
          setActiveExtensionSlot(slotName, moduleName);
        }}
        className={styles.slotName}
      >
        {slotName}
      </div>
    </>
  );
}

const actions = {
  toggleIsUIEditorEnabled({ isUIEditorEnabled }: ImplementerToolsStore) {
    return { isUIEditorEnabled: !isUIEditorEnabled };
  },
};

export function ExitButton() {
  const { toggleIsUIEditorEnabled } = useStoreWithActions(
    implementerToolsStore,
    actions
  );
  return (
    <Button
      className={styles.exitButton}
      kind="danger"
      size="sm"
      renderIcon={(props) => <Close {...props} size={16} />}
      iconDescription="Exit UI Editor"
      tooltipPosition="left"
      onClick={toggleIsUIEditorEnabled}
      hasIconOnly
    />
  );
}
