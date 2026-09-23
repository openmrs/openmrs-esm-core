import { type ExtensionMeta } from './store';

export interface ExtensionData {
  extensionSlotName: string;
  extensionSlotModuleName: string;
  extensionId: string;
  /**
   * The extension's `meta`. Only set for components rendered as extensions; a component rendered
   * some other way (a modal, say) has no extension context.
   */
  extensionMeta?: Readonly<ExtensionMeta>;
}

export interface ComponentConfig {
  moduleName: string;
  featureName: string;
  extension?: ExtensionData;
}
