import { createGlobalStore, getGlobalStore } from "@openmrs/esm-api";
import { createUseStore } from "@openmrs/esm-react-utils";
import { Store } from "unistore";

export interface ImplementerToolsStore {
  activeItemDescription?: ActiveItemDescription;
  configPathBeingEdited: null | string[];
  isOpen: boolean;
  isUIEditorEnabled: boolean;
}

export interface ActiveItemDescription {
  path: string[];
  description?: string;
  value?: string | string[];
  source?: string;
}

const store: Store<ImplementerToolsStore> = createGlobalStore(
  "implementer-tools",
  {
    activeItemDescription: undefined,
    configPathBeingEdited: null,
    isOpen: getIsImplementerToolsOpen(),
    isUIEditorEnabled: getIsUIEditorEnabled(),
  }
);

export const getStore = () =>
  getGlobalStore<ImplementerToolsStore>("implementer-tools");

export const useStore = createUseStore<ImplementerToolsStore>(store);

let lastValueOfIsOpen = getIsImplementerToolsOpen();
let lastValueOfIsUiEditorEnabled = getIsUIEditorEnabled();
getStore().subscribe((state) => {
  if (state.isOpen != lastValueOfIsOpen) {
    setIsImplementerToolsOpen(state.isOpen);
    lastValueOfIsOpen = state.isOpen;
  }
  if (state.isUIEditorEnabled != lastValueOfIsUiEditorEnabled) {
    setIsUIEditorEnabled(state.isUIEditorEnabled);
    lastValueOfIsUiEditorEnabled = state.isUIEditorEnabled;
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

function getIsUIEditorEnabled(): boolean {
  return (
    JSON.parse(localStorage.getItem("openmrs:isUIEditorEnabled") || "false") ??
    false
  );
}

function setIsUIEditorEnabled(enabled: boolean) {
  localStorage.setItem("openmrs:isUIEditorEnabled", JSON.stringify(enabled));
}
