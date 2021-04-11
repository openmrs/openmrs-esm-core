import { createGlobalStore, extensionStore } from "@openmrs/esm-framework";
import { Store } from "unistore";
import merge from "lodash-es/merge";

export interface ImplementerToolsStore {
  activeItemDescription?: ActiveItemDescription;
  configPathBeingEdited: null | Array<string>;
  isOpen: boolean;
  hasAlert: boolean;
  openTabIndex: number;
  isConfigToolbarOpen: boolean;
  isUIEditorEnabled: boolean;
  extensionIdBySlotByModule: Record<string, Record<string, Array<string>>>;
}

export interface ActiveItemDescription {
  path: Array<string>;
  description?: string;
  value?: string | Array<string>;
  source?: string;
}

export const implementerToolsStore: Store<ImplementerToolsStore> = createGlobalStore(
  "implementer-tools",
  {
    activeItemDescription: undefined,
    configPathBeingEdited: null,
    isOpen: getIsImplementerToolsOpen(),
    hasAlert: false,
    openTabIndex: 0,
    isConfigToolbarOpen: getIsConfigToolbarOpen(),
    isUIEditorEnabled: getIsUIEditorEnabled(),
    extensionIdBySlotByModule: {},
  }
);

export const setHasAlert = implementerToolsStore.action(
  (state, value: boolean) => ({
    ...state,
    hasAlert: value,
  })
);

export const togglePopup = implementerToolsStore.action((state) => ({
  ...state,
  isOpen: !state.isOpen,
}));

export const showModuleDiagnostics = implementerToolsStore.action((state) => ({
  ...state,
  isOpen: true,
  openTabIndex: 1,
}));

/* Set up subscriptions for module-slot-extension cache.
 * This cache exists so that implementer tools doesn't "forget" about
 * slots & extensions that are no longer mounted.
 */

extensionStore.subscribe((state) => {
  const newValue = {};

  for (let [slotName, slot] of Object.entries(state.slots)) {
    for (let [moduleName, instance] of Object.entries(slot.instances)) {
      if (!newValue[moduleName]) {
        newValue[moduleName] = {};
      }
      newValue[moduleName][slotName] = instance.assignedIds;
    }
  }

  implementerToolsStore.setState({
    extensionIdBySlotByModule: merge(
      implementerToolsStore.getState().extensionIdBySlotByModule,
      newValue
    ),
  });
});

/* Set up localStorage-serialized state elements */

let lastValueOfIsOpen = getIsImplementerToolsOpen();
let lastValueOfConfigToolbarOpen = getIsConfigToolbarOpen();
let lastValueOfIsUiEditorEnabled = getIsUIEditorEnabled();

implementerToolsStore.subscribe((state) => {
  if (state.isOpen != lastValueOfIsOpen) {
    setIsImplementerToolsOpen(state.isOpen);
    lastValueOfIsOpen = state.isOpen;
  }
  if (state.isUIEditorEnabled != lastValueOfIsUiEditorEnabled) {
    setIsUIEditorEnabled(state.isUIEditorEnabled);
    lastValueOfIsUiEditorEnabled = state.isUIEditorEnabled;
  }
  if (state.isConfigToolbarOpen != lastValueOfConfigToolbarOpen) {
    setIsConfigToolbarOpen(state.isConfigToolbarOpen);
    lastValueOfConfigToolbarOpen = state.isConfigToolbarOpen;
  }
});

function getIsImplementerToolsOpen(): boolean {
  return (
    JSON.parse(
      localStorage.getItem("openmrs:openmrsImplementerToolsAreOpen") || "false"
    ) ?? false
  );
}

function setIsImplementerToolsOpen(value: boolean): void {
  localStorage.setItem(
    "openmrs:openmrsImplementerToolsAreOpen",
    JSON.stringify(value)
  );
}

function getIsConfigToolbarOpen(): boolean {
  return (
    JSON.parse(
      localStorage.getItem("openmrs:openmrsImplementerToolsConfigOpen") ||
        "true"
    ) ?? true
  );
}

function setIsConfigToolbarOpen(value: boolean): void {
  localStorage.setItem(
    "openmrs:openmrsImplementerToolsConfigOpen",
    JSON.stringify(value)
  );
}

function getIsUIEditorEnabled(): boolean {
  return (
    JSON.parse(localStorage.getItem("openmrs:isUIEditorEnabled") || "false") ??
    false
  );
}

function setIsUIEditorEnabled(enabled: boolean) {
  localStorage.setItem("openmrs:isUIEditorEnabled", JSON.stringify(enabled));
}
