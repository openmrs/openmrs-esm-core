import React from 'react';
import styles from './styles.css';
import {
  CloseIcon,
  getExtensionInternalStore,
  useStore,
  useStoreWithActions,
} from '@openmrs/esm-framework/src/internal';
import { Button } from '@carbon/react';
import { Portal } from './portal';
import { ExtensionOverlay } from './extension-overlay.component';
import { type ImplementerToolsStore, implementerToolsStore } from '../store';

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
                `*[data-extension-slot-name="${slotName}"][data-extension-slot-module-name="${slotInfo.moduleName}"]`,
              )}
            >
              <SlotOverlay slotName={slotName} moduleName={slotInfo.moduleName} />
            </Portal>
          ))
        : null}
      {extensions
        ? Object.entries(extensions).map(([extensionName, extensionInfo]) =>
            Object.entries(extensionInfo.instances).map(([slotModuleName, bySlotName]) =>
              Object.entries(bySlotName).map(([slotName, extensionInstance]) => (
                <ExtensionOverlay
                  key={slotName}
                  extensionName={extensionName}
                  slotModuleName={slotModuleName}
                  slotName={slotName}
                  domElement={document.querySelector(
                    `*[data-extension-slot-name="${slotName}"][data-extension-slot-module-name="${slotModuleName}"] *[data-extension-id="${extensionInstance.id}"]`,
                  )}
                />
              )),
            ),
          )
        : null}
    </>
  );
}

export function SlotOverlay({ slotName, moduleName }) {
  const setActiveExtensionSlot = (moduleName: string, slotName: string) => {
    if (!implementerToolsStore.getState().configPathBeingEdited) {
      implementerToolsStore.setState({
        uiSelectedPath: [moduleName, 'extensionSlots', slotName],
        isOpen: true,
      });
    }
  };
  return (
    <>
      <div className={styles.slotOverlay}></div>
      <button
        onClick={(event) => {
          event.preventDefault();
          setActiveExtensionSlot(moduleName, slotName);
        }}
        className={styles.slotName}
      >
        Slot: {slotName}
      </button>
    </>
  );
}

const actions = {
  toggleIsUIEditorEnabled({ isUIEditorEnabled }: ImplementerToolsStore) {
    return { isUIEditorEnabled: !isUIEditorEnabled };
  },
};

export function ExitButton() {
  const { toggleIsUIEditorEnabled } = useStoreWithActions(implementerToolsStore, actions);
  return (
    <Button
      className={styles.exitButton}
      kind="danger"
      size="sm"
      renderIcon={(props) => <CloseIcon {...props} size={16} />}
      iconDescription="Exit UI Editor"
      tooltipPosition="left"
      onClick={toggleIsUIEditorEnabled}
      hasIconOnly
    />
  );
}
