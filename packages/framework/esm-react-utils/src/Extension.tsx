import { renderExtension } from "@openmrs/esm-extensions";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Parcel } from "single-spa";
import { ComponentContext } from ".";
import type { ExtensionData } from "./ComponentContext";

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
      | ((slot: React.ReactNode, extension?: ExtensionData) => React.ReactNode);
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
  const parcel = useRef<Parcel | null>(null);
  const updatePromise = useRef<Promise<void>>(Promise.resolve());
  const rendering = useRef<boolean>(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ref = useCallback(
    (node: HTMLDivElement) => {
      setDomElement(node);
    },
    [setDomElement]
  );

  useEffect(() => {
    if (
      domElement != null &&
      extension?.extensionSlotName &&
      extension.extensionSlotModuleName &&
      extension.extensionSlotModuleName &&
      !parcel.current &&
      !rendering.current
    ) {
      rendering.current = true;
      renderExtension(
        domElement,
        extension.extensionSlotName,
        extension.extensionSlotModuleName,
        extension.extensionId,
        undefined,
        state
      ).then((newParcel) => {
        parcel.current = newParcel;
        rendering.current = false;
      });

      return () => {
        if (parcel && parcel.current) {
          const status = parcel.current.getStatus();
          switch (status) {
            case "MOUNTING":
              parcel.current.mountPromise.then(() => {
                if (parcel.current?.getStatus() === "MOUNTED") {
                  parcel.current.unmount();
                }
              });
              break;
            case "MOUNTED":
              parcel.current.unmount();
              break;
            case "UPDATING":
              if (updatePromise.current) {
                updatePromise.current.then(() => {
                  if (parcel.current?.getStatus() === "MOUNTED") {
                    parcel.current.unmount();
                  }
                });
              }
          }
        }
      };
    }

    // we intentionally do not re-run this hook if state gets updated
    // state updates are handled in the next useEffect hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    extension?.extensionSlotName,
    extension?.extensionId,
    extension?.extensionSlotModuleName,
    domElement,
  ]);

  useEffect(() => {
    if (
      parcel.current &&
      parcel.current.update &&
      parcel.current.getStatus() !== "UNMOUNTING"
    ) {
      Promise.all([parcel.current.mountPromise, updatePromise.current]).then(
        () => {
          if (
            parcel?.current?.getStatus() === "MOUNTED" &&
            parcel.current.update
          ) {
            updatePromise.current = parcel.current
              .update({ ...state })
              .catch((err) => {
                // if we were trying to update but the component was unmounted
                // while this was happening, ignore the error
                if (
                  !(err instanceof Error) ||
                  !err.message.includes("minified message #32") ||
                  parcel.current?.getStatus() === "MOUNTED"
                ) {
                  throw err;
                }
              });
          }
        }
      );
    }
  }, [state]);

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

  if (typeof children === "function" && !React.isValidElement(children)) {
    return <>{children(slot, extension)}</>;
  }

  return extension && wrap ? wrap(slot, extension) : slot;
};
