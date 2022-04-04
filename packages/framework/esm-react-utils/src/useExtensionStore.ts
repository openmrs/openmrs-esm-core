/** @module @category Extension */
import { ExtensionStore, getExtensionStore } from "@openmrs/esm-extensions";
import { createUseStore } from "./createUseStore";

export const useExtensionStore = createUseStore<ExtensionStore>(
  getExtensionStore()
);
