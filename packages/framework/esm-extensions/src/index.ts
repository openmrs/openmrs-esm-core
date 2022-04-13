export * from "./store";
export * from "./extensions";
export * from "./helpers";
export * from "./render";

// Temporary compatibility hack
// What is now `extensionInternalStore` used to be exposed
// and used as `extensionStore`.
import { getExtensionInternalStore } from "./store";
/** @deprecated Use `getExtensionStore`. The structure of this store has also changed. */
const internalStore = getExtensionInternalStore();
export { internalStore as extensionStore };
