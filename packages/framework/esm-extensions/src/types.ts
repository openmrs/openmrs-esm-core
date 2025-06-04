export interface ExtensionData {
  extensionSlotName: string;
  extensionSlotModuleName: string;
  extensionId: string;
}

export interface ComponentConfig {
  moduleName: string;
  featureName: string;
  extension?: ExtensionData;
}
