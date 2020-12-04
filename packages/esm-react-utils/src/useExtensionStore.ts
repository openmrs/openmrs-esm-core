import { ExtensionStore, extensionStore } from "@openmrs/esm-extensions";
import { createUseStore } from "./createUseStore";

export const useExtensionStore = createUseStore<ExtensionStore>(extensionStore);
