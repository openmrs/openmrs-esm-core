// Storybook-compatible mock for @openmrs/esm-globals.
// This module mostly exports types; only a few runtime values are needed.

export function setupPaths(_config: any) {}
export function subscribeNetworkRequestFailed() {
  return () => {};
}
