import {
  ExtensionInternalStore,
  getExtensionInternalStore,
} from "@openmrs/esm-extensions";
import { createUseStore } from "./createUseStore";

/**
 * The implementation of this will soon undergo a breaking change.
 * This will return an `ExtensionStore` rather than `ExtensionInternalStore`.
 */
export const useExtensionStore = createUseStore<ExtensionInternalStore>(
  getExtensionInternalStore()
);
