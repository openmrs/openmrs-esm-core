export {};

declare global {
  interface Window {
    __hasUnsavedChanges?: boolean;
  }
}
