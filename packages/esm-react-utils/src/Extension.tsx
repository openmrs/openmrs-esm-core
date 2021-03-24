import React, { useContext } from "react";
import { renderExtension } from "@openmrs/esm-extensions";
import { ComponentContext } from "./ComponentContext";

export interface ExtensionProps {
  state?: Record<string, any>;
}

/**
 * Represents the position in the DOM where each extension within
 * an extension slot is rendered.
 *
 * Renders once for each extension attached to that extension slot.
 *
 * Usage of this component *must* have an ancestor `<ExtensionSlot>`.
 */
export const Extension: React.FC<ExtensionProps> = ({ state }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { extension } = useContext(ComponentContext);

  React.useEffect(() => {
    if (ref.current && extension) {
      return renderExtension(
        ref.current,
        extension.actualExtensionSlotName,
        extension.attachedExtensionSlotName,
        extension.extensionSlotModuleName,
        extension.extensionId,
        undefined,
        state
      );
    }
  }, [extension, ref.current, state]);

  return (
    // The extension is rendered into the `<slot>`. It is surrounded by a
    // `<div>` with relative positioning in order to allow the UI Editor
    // to absolutely position elements within it.
    <div style={{ position: "relative" }} ref={ref} />
  );
};
