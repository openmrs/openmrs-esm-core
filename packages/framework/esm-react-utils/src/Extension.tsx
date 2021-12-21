import { renderExtension } from "@openmrs/esm-extensions";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ComponentContext } from ".";
import { ExtensionData } from "./ComponentContext";

export interface ExtensionProps {
  state?: Record<string, any>;
  wrap?(
    slot: React.ReactNode,
    extension: ExtensionData
  ): React.ReactElement<any, any> | null;
}

/**
 * Represents the position in the DOM where each extension within
 * an extension slot is rendered.
 *
 * Renders once for each extension attached to that extension slot.
 *
 * Usage of this component *must* have an ancestor `<ExtensionSlot>`,
 * and *must* only be used once within that `<ExtensionSlot>`.
 */
export const Extension: React.FC<ExtensionProps> = ({ state, wrap }) => {
  const [domElement, setDomElement] = useState<HTMLDivElement>();
  const { extension } = useContext(ComponentContext);

  const ref = useCallback((node) => {
    setDomElement(node);
  }, []);

  useEffect(() => {
    if (domElement != null && extension) {
      return renderExtension(
        domElement,
        extension.extensionSlotName,
        extension.extensionSlotModuleName,
        extension.extensionId,
        undefined,
        state
      );
    }
  }, [
    extension?.extensionSlotName,
    extension?.extensionId,
    extension?.extensionSlotModuleName,
    state,
    domElement,
  ]);

  // The extension is rendered into the `<slot>`. It is surrounded by a
  // `<div>` with relative positioning in order to allow the UI Editor
  // to absolutely position elements within it.
  const slot = (
    <div
      ref={ref}
      data-extension-id={extension?.extensionId}
      style={{ position: "relative" }}
    />
  );

  return extension && wrap ? wrap(slot, extension) : slot;
};
