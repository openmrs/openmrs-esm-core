import {
  ExtensionInternalStore,
  getExtensionInternalStore,
} from "@openmrs/esm-extensions";
import { createUseStore } from "./createUseStore";

/** @internal */
export const useExtensionInternalStore = createUseStore<ExtensionInternalStore>(
  getExtensionInternalStore()
);
