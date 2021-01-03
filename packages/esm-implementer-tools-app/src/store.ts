import { createGlobalStore, getGlobalStore } from "@openmrs/esm-api";

export interface ImplementerToolsStore {
  activeItemDescription?: ActiveItemDescription;
  configPathBeingEdited: null | string[];
  isOpen: boolean;
}

export interface ActiveItemDescription {
  path: string[];
  description?: string;
  value?: string | string[];
  source?: string;
}

createGlobalStore("implementer-tools", {
  activeItemDescription: null,
  configPathBeingEdited: null,
  isOpen: getIsImplementerToolsOpen(),
});

export const getStore = () =>
  getGlobalStore<ImplementerToolsStore>("implementer-tools");

let lastValueOfIsOpen = getIsImplementerToolsOpen();
getStore().subscribe((state) => {
  if (state.isOpen != lastValueOfIsOpen) {
    setIsImplementerToolsOpen(state.isOpen);
    lastValueOfIsOpen = state.isOpen;
  }
});

function setIsImplementerToolsOpen(value: boolean): void {
  localStorage.setItem("openmrsImplementerToolsAreOpen", JSON.stringify(value));
}

function getIsImplementerToolsOpen(): boolean {
  return JSON.parse(
    localStorage.getItem("openmrsImplementerToolsAreOpen") || "false"
  );
}
