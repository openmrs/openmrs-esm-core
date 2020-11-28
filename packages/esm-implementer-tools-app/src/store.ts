import { createGlobalStore, getGlobalStore } from "@openmrs/esm-api";

export type ImplementerToolsStore = {
  configPathBeingEdited: null | string[];
  configPathBeingHovered: null | string[];
};

createGlobalStore("implementer-tools", {
  configPathBeingEdited: null,
  configPathBeingHovered: null,
});

export const getStore = () =>
  getGlobalStore<ImplementerToolsStore>("implementer-tools");
