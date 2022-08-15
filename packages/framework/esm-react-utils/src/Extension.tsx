import { renderExtension } from "@openmrs/esm-extensions";
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Parcel } from "single-spa";
import { ComponentContext } from ".";
import { ExtensionData } from "./ComponentContext";

export type ExtensionProps = {
  state?: Record<string, any>;
  /** @deprecated Pass a function as the child of `ExtensionSlot` instead. */
  wrap?(
    slot: React.ReactNode,
    extension: ExtensionData
  ): React.ReactElement<any, any> | null;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
    children?:
      | React.ReactNode
      | ((extension: React.ReactNode) => React.ReactNode);
  };

/**
 * Represents the position in the DOM where each extension within
 * an extension slot is rendered.
 *
 * Renders once for each extension attached to that extension slot.
 *
 * Usage of this component *must* have an ancestor `<ExtensionSlot>`,
 * and *must* only be used once within that `<ExtensionSlot>`.
 */
export const Extension: React.FC<ExtensionProps> = ({
  state,
  children,
  wrap,
  ...divProps
}) => {
  const [domElement, setDomElement] = useState<HTMLDivElement>();
  const { extension } = useContext(ComponentContext);
  const parcel = useRef<Parcel | null>();

  useEffect(() => {
    if (wrap) {
      console.warn(
        `'wrap' prop of Extension is being used ${
          extension?.extensionId
            ? `by ${extension.extensionId} in ${extension.extensionSlotName}`
            : ""
        }. This will be removed in a future release.`
      );
    }
    // we only warn when component mounts
    // eslint-disable-next-line eslintreact-hooks/exhaustive-deps
  }, []);

  const ref = useCallback(
    (node) => {
      setDomElement(node);
    },
    [setDomElement]
  );

  useEffect(() => {
    if (domElement != null && extension && !parcel.current) {
      parcel.current = renderExtension(
        domElement,
        extension.extensionSlotName,
        extension.extensionSlotModuleName,
        extension.extensionId,
        undefined,
        state
      );
      return () => {
        parcel.current && parcel.current.unmount();
      };
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
      {...divProps}
    />
  );

  if (typeof children == "function" && !React.isValidElement(children)) {
    return <>{children(slot)}</>;
  }

  return extension && wrap ? wrap(slot, extension) : slot;
};
