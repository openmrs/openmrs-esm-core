import React from "react";

export interface ExtensionData {
  extensionSlotName: string;
  extensionSlotModuleName: string;
  extensionId: string;
}

export interface ComponentConfig {
  moduleName: string;
  extension?: ExtensionData;
}

/**
 * Available to all components. Provided by `openmrsComponentDecorator`.
 */
export const ComponentContext = React.createContext<ComponentConfig>({
  moduleName: "",
});
