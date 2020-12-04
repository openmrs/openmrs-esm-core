import { createGlobalStore, getGlobalStore } from "@openmrs/esm-api";

export type ImplementerToolsStore = {
  activeItemDescription: {
    path: string[];
    description: string;
    value: string | string[];
  };
  configPathBeingEdited: null | string[];
};

createGlobalStore("implementer-tools", {
  activeItemDescription: {},
  configPathBeingEdited: null,
  configPathBeingHovered: null,
});

export const getStore = () =>
  getGlobalStore<ImplementerToolsStore>("implementer-tools");
