import {
  ExtensionInternalStore,
  extensionInternalStore,
} from "@openmrs/esm-extensions";
import { createUseStore } from "./createUseStore";

/** @internal */
export const useExtensionInternalStore = createUseStore<ExtensionInternalStore>(
  extensionInternalStore
);
