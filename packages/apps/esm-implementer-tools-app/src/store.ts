import { createGlobalStore } from '@openmrs/esm-framework';

/**
 * The popup's tabs, in the order they are shown. This is the only statement of that order: the
 * switcher, the panel and anything navigating to a tab all work from it, so reordering here moves a
 * tab everywhere.
 */
export const implementerToolsTabs = ['configuration', 'frontend-modules', 'backend-modules', 'feature-flags'] as const;

export type ImplementerToolsTab = (typeof implementerToolsTabs)[number];

export interface ImplementerToolsStore {
  activeItemDescription: null | ActiveItemDescription;
  configPathBeingEdited: null | Array<string>;
  isOpen: boolean;
  hasAlert: boolean;
  openTab: ImplementerToolsTab;
  isConfigToolbarOpen: boolean;
  isUIEditorEnabled: boolean;
  isJsonModeEnabled: boolean;
  uiSelectedPath: null | Array<string>;
}

export interface ActiveItemDescription {
  path: Array<string>;
  description?: string;
  value?: string | Array<string>;
  source?: string;
}

export const implementerToolsStore = createGlobalStore<ImplementerToolsStore>('implementer-tools', {
  activeItemDescription: null,
  configPathBeingEdited: null,
  isOpen: getIsImplementerToolsOpen(),
  hasAlert: false,
  openTab: 'configuration',
  isConfigToolbarOpen: getIsConfigToolbarOpen(),
  isUIEditorEnabled: getIsUIEditorEnabled(),
  isJsonModeEnabled: getIsJsonModeEnabled(),
  uiSelectedPath: null,
});

export const setHasAlert = (value: boolean) =>
  implementerToolsStore.setState((state) => ({
    ...state,
    hasAlert: value,
  }));

export const togglePopup = () =>
  implementerToolsStore.setState((state) => ({
    ...state,
    isOpen: !state.isOpen,
    openTab: 'configuration',
  }));

export const showModuleDiagnostics = () =>
  implementerToolsStore.setState((state) => ({
    ...state,
    isOpen: true,
    openTab: 'backend-modules',
  }));

/* Set up localStorage-serialized state elements */

let lastValueOfIsOpen = getIsImplementerToolsOpen();
let lastValueOfConfigToolbarOpen = getIsConfigToolbarOpen();
let lastValueOfIsUiEditorEnabled = getIsUIEditorEnabled();
let lastValueOfIsJsonModeEnabled = getIsJsonModeEnabled();

implementerToolsStore.subscribe((state) => {
  if (state.isOpen != lastValueOfIsOpen) {
    setIsImplementerToolsOpen(state.isOpen);
    lastValueOfIsOpen = state.isOpen;
  }
  if (state.isUIEditorEnabled != lastValueOfIsUiEditorEnabled) {
    setIsUIEditorEnabled(state.isUIEditorEnabled);
    lastValueOfIsUiEditorEnabled = state.isUIEditorEnabled;
  }
  if (state.isConfigToolbarOpen != lastValueOfConfigToolbarOpen) {
    setIsConfigToolbarOpen(state.isConfigToolbarOpen);
    lastValueOfConfigToolbarOpen = state.isConfigToolbarOpen;
  }
  if (state.isJsonModeEnabled != lastValueOfIsJsonModeEnabled) {
    setIsJsonModeEnabled(state.isJsonModeEnabled);
    lastValueOfIsJsonModeEnabled = state.isJsonModeEnabled;
  }
});

function getIsImplementerToolsOpen(): boolean {
  return JSON.parse(localStorage.getItem('openmrs:openmrsImplementerToolsAreOpen') || 'false') ?? false;
}

function setIsImplementerToolsOpen(value: boolean): void {
  localStorage.setItem('openmrs:openmrsImplementerToolsAreOpen', JSON.stringify(value));
}

function getIsConfigToolbarOpen(): boolean {
  return JSON.parse(localStorage.getItem('openmrs:openmrsImplementerToolsConfigOpen') || 'true') ?? true;
}

function setIsConfigToolbarOpen(value: boolean): void {
  localStorage.setItem('openmrs:openmrsImplementerToolsConfigOpen', JSON.stringify(value));
}

function getIsUIEditorEnabled(): boolean {
  return JSON.parse(localStorage.getItem('openmrs:isUIEditorEnabled') || 'false') ?? false;
}

function setIsUIEditorEnabled(enabled: boolean) {
  localStorage.setItem('openmrs:isUIEditorEnabled', JSON.stringify(enabled));
}

function getIsJsonModeEnabled(): boolean {
  return JSON.parse(localStorage.getItem('openmrs:getIsJsonModeEnabled') || 'false') ?? false;
}

function setIsJsonModeEnabled(enabled: boolean) {
  localStorage.setItem('openmrs:getIsJsonModeEnabled', JSON.stringify(enabled));
}
