import { implementerToolsStore } from '../store';

/** Where the config for one slot's add, remove, order, and configure settings lives. */
export function getSlotConfigPath(slotModuleName: string, slotName: string) {
  return [slotModuleName, 'extensionSlots', slotName];
}

/**
 * Where the config for one extension instance in one slot lives. The Configuration tab edits a
 * slot's `configure` object as a whole, so it can only be shown down to that object; the extension
 * ID is the key to set inside it.
 */
export function getExtensionInstanceConfigPath(slotModuleName: string, slotName: string, extensionId: string) {
  return [...getSlotConfigPath(slotModuleName, slotName), 'configure', extensionId];
}

/**
 * Where an extension's own config lives: under its name if it defines a schema with
 * `defineExtensionConfigSchema`, and otherwise its module's config, which it shares with
 * everything else in that module.
 */
export function getExtensionConfigPath(extensionName: string, moduleName: string, hasOwnSchema: boolean) {
  return [hasOwnSchema ? extensionName : moduleName];
}

/**
 * Opens the Configuration tab's tree at `path`. The tree, not the JSON editor, is what can be
 * navigated, so JSON mode is switched off.
 */
export function showInConfiguration(path: Array<string>) {
  implementerToolsStore.setState({
    isOpen: true,
    openTab: 'configuration',
    isJsonModeEnabled: false,
    uiSelectedPath: path,
  });
}
