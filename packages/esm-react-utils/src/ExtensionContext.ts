import React from "react";

export interface ExtensionContextData {
  actualExtensionSlotName: string;
  attachedExtensionSlotName: string;
  extensionSlotModuleName: string;
  extensionId: string;
  extensionModuleName: string;
}

/**
 * Available to all extensions. Provided by `openmrsExtensionDecorator`.
 *
 * Used by `useExtensionConfig`.
 *
 * Also used internally to communicate between `ExtensionSlot` and `Extension`.
 * However, the context provided by `ExtensionSlot` is not available directly
 * in the extension. The context available in the extension is the one provided
 * by `openmrsExtensionDecorator`.
 */
export const ExtensionContext = React.createContext<ExtensionContextData>({
  actualExtensionSlotName: "",
  attachedExtensionSlotName: "",
  extensionSlotModuleName: "",
  extensionId: "",
  extensionModuleName: "",
});
