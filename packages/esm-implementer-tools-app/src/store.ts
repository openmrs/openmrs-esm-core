import { createGlobalStore, getGlobalStore } from "@openmrs/esm-api";

export interface ImplementerToolsStore {
  activeItemDescription?: ActiveItemDescription;
  configPathBeingEdited: null | string[];
}

export interface ActiveItemDescription {
  path: string[];
  description?: string;
  value?: string | string[];
  source: string;
}

createGlobalStore("implementer-tools", {
  activeItemDescription: null,
  configPathBeingEdited: null,
});

export const getStore = () =>
  getGlobalStore<ImplementerToolsStore>("implementer-tools");
