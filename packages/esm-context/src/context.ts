import React from "react";

export interface ExtensionContextData {
  extensionSlotName: string;
  extensionId: string;
  extensionModuleName: string;
}

export const ExtensionContext = React.createContext<ExtensionContextData>({
  extensionSlotName: "",
  extensionId: "",
  extensionModuleName: "",
});

export const ModuleNameContext = React.createContext<string | null>(null);
