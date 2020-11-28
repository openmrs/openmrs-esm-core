import React, { useContext } from "react";
import { renderExtension, getIsUIEditorEnabled } from "@openmrs/esm-extensions";
import { ExtensionContext } from "./ExtensionContext";

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
  const ref = React.useRef<HTMLSlotElement>(null);
  const {
    actualExtensionSlotName,
    attachedExtensionSlotName,
    extensionSlotModuleName,
    extensionId,
  } = useContext(ExtensionContext);
  // TODO: handle error if Extension not wrapped in ExtensionSlot

  React.useEffect(() => {
    if (ref.current) {
      return renderExtension(
        ref.current,
        actualExtensionSlotName,
        attachedExtensionSlotName,
        extensionSlotModuleName,
        extensionId,
        undefined,
        state
      );
    }
  }, [
    actualExtensionSlotName,
    attachedExtensionSlotName,
    extensionSlotModuleName,
    extensionId,
  ]);

  return getIsUIEditorEnabled() ? (
    <div style={{ outline: "0.125rem solid yellow" }}>
      <slot ref={ref} />
    </div>
  ) : (
    <slot ref={ref} />
  );
};
