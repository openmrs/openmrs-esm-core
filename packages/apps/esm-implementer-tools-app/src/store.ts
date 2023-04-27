import { createGlobalStore } from "@openmrs/esm-framework";

export interface ImplementerToolsStore {
  activeItemDescription?: ActiveItemDescription;
  configPathBeingEdited: null | Array<string>;
  isOpen: boolean;
  hasAlert: boolean;
  openTabIndex: number;
  isConfigToolbarOpen: boolean;
  isUIEditorEnabled: boolean;
  isJsonModeEnabled: boolean;
}

export interface ActiveItemDescription {
  path: Array<string>;
  description?: string;
  value?: string | Array<string>;
  source?: string;
}

export const implementerToolsStore = createGlobalStore<ImplementerToolsStore>(
  "implementer-tools",
  {
    activeItemDescription: undefined,
    configPathBeingEdited: null,
    isOpen: getIsImplementerToolsOpen(),
    hasAlert: false,
    openTabIndex: 0,
    isConfigToolbarOpen: getIsConfigToolbarOpen(),
    isUIEditorEnabled: getIsUIEditorEnabled(),
    isJsonModeEnabled: getIsJsonModeEnabled(),
  }
);

export const setHasAlert = (value: boolean) =>
  implementerToolsStore.setState((state) => ({
    ...state,
    hasAlert: value,
  }));

export const togglePopup = () =>
  implementerToolsStore.setState((state) => ({
    ...state,
    isOpen: !state.isOpen,
  }));

export const showModuleDiagnostics = () =>
  implementerToolsStore.setState((state) => ({
    ...state,
    isOpen: true,
    openTabIndex: 1,
  }));

/* Set up localStorage-serialized state elements */

let lastValueOfIsOpen = getIsImplementerToolsOpen();
let lastValueOfConfigToolbarOpen = getIsConfigToolbarOpen();
let lastValueOfIsUiEditorEnabled = getIsUIEditorEnabled();
let lastValueOfIsJsonModeEnabled = getIsJsonModeEnabled();

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
  if (state.isJsonModeEnabled != lastValueOfIsJsonModeEnabled) {
    setIsJsonModeEnabled(state.isJsonModeEnabled);
    lastValueOfIsJsonModeEnabled = state.isJsonModeEnabled;
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

function getIsJsonModeEnabled(): boolean {
  return (
    JSON.parse(
      localStorage.getItem("openmrs:getIsJsonModeEnabled") || "false"
    ) ?? false
  );
}

function setIsJsonModeEnabled(enabled: boolean) {
  localStorage.setItem("openmrs:getIsJsonModeEnabled", JSON.stringify(enabled));
}
