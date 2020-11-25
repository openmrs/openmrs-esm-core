import React from "react";

export interface ExtensionContextData {
  actualExtensionSlotName: string;
  attachedExtensionSlotName: string;
  extensionId: string;
  extensionModuleName: string;
}

export const ExtensionContext = React.createContext<ExtensionContextData>({
  actualExtensionSlotName: "",
  attachedExtensionSlotName: "",
  extensionId: "",
  extensionModuleName: "",
});
