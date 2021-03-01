import { createGlobalStore, extensionStore } from "@openmrs/esm-framework";
import { Store } from "unistore";
import cloneDeep from "lodash-es/cloneDeep";

export interface ImplementerToolsStore {
  activeItemDescription?: ActiveItemDescription;
  configPathBeingEdited: null | string[];
  isOpen: boolean;
  isConfigToolbarOpen: boolean;
  isUIEditorEnabled: boolean;
  slotsByModule: Record<string, Array<string>>;
}

export interface ActiveItemDescription {
  path: string[];
  description?: string;
  value?: string | string[];
  source?: string;
}

export const implementerToolsStore: Store<ImplementerToolsStore> = createGlobalStore(
  "implementer-tools",
  {
    activeItemDescription: undefined,
    configPathBeingEdited: null,
    isOpen: getIsImplementerToolsOpen(),
    isConfigToolbarOpen: getIsConfigToolbarOpen(),
    isUIEditorEnabled: getIsUIEditorEnabled(),
    slotsByModule: {},
  }
);

/* Set up subscriptions for list of slots */

extensionStore.subscribe((state) => {
  const slotsByModule = cloneDeep(
    implementerToolsStore.getState().slotsByModule
  );
  for (let [slotName, slot] of Object.entries(state.slots)) {
    for (let moduleName of Object.keys(slot.instances)) {
      if (!(slotsByModule[moduleName] ?? []).includes(slotName)) {
        slotsByModule[moduleName] = (slotsByModule[moduleName] ?? []).concat([
          slotName,
        ]);
      }
    }
  }
  implementerToolsStore.setState({ slotsByModule });
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
