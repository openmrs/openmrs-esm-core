/** @module @category Extension */
import { ExtensionStore, getExtensionStore } from "@openmrs/esm-extensions";
import { createUseStore } from "./useStore";

export const useExtensionStore = createUseStore<ExtensionStore>(
  getExtensionStore()
);
