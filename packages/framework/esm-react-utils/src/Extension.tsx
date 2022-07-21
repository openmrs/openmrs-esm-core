import { renderExtension } from "@openmrs/esm-extensions";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Parcel } from "single-spa";
import { ComponentContext } from ".";
import { ExtensionData } from "./ComponentContext";

export interface ExtensionProps {
  state?: Record<string, any>;
  /** @deprecated Pass a function as the child of `ExtensionSlot` instead. */
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
  const parcel = useRef<Parcel | null>();

  if (wrap) {
    console.warn(
      "`wrap` prop of Extension is being used. This will be removed in a future release."
    );
  }

  const ref = useCallback((node) => {
    setDomElement(node);
  }, []);

  useEffect(() => {
    if (domElement != null && extension && !parcel.current) {
      const { parcel: resultParcel, unmount } = renderExtension(
        domElement,
        extension.extensionSlotName,
        extension.extensionSlotModuleName,
        extension.extensionId,
        undefined,
        state
      );
      parcel.current = resultParcel;
      return unmount;
    }
  }, [
    extension?.extensionSlotName,
    extension?.extensionId,
    extension?.extensionSlotModuleName,
    state,
    domElement,
  ]);

  useEffect(() => {
    if (parcel.current && parcel.current.update) {
      parcel.current.update({ ...state });
    }
  }, [parcel.current, state]);

  // The extension is rendered into the `<div>`. The `<div>` has relative
  // positioning in order to allow the UI Editor to absolutely position
  // elements within it.
  const slot = (
    <div
      ref={ref}
      data-extension-id={extension?.extensionId}
      style={{ position: "relative" }}
    />
  );

  return extension && wrap ? wrap(slot, extension) : slot;
};
