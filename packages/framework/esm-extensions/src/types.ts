import { type ExtensionMeta } from './store';

export interface ExtensionData {
  extensionSlotName: string;
  extensionSlotModuleName: string;
  extensionId: string;
  extensionMeta?: Readonly<ExtensionMeta>;
}

export interface ComponentConfig {
  moduleName: string;
  featureName: string;
  extension?: ExtensionData;
}
