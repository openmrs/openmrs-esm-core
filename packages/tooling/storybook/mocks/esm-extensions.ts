// Storybook-compatible mock for @openmrs/esm-extensions.

export function attach() {}
export function detach() {}
export function detachAll() {}
export function switchTo() {}
export function getExtensionStore() {
  return null;
}
export function getExtensionInternalStore() {
  return { slots: {}, extensions: {} };
}
export function getExtensionRegistration() {
  return undefined;
}
export function registerExtension() {}
