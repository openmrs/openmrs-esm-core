import React from "react";
import { useContext, useRef, useEffect, useState } from "react";
import {
  checkStatus,
  getExtensionRegistration,
  markExtensionRendered,
  renderExtension,
} from "@openmrs/esm-extensions";
import { ComponentContext, ExtensionData } from "./ComponentContext";
import { LifecycleWithContext } from "./getLifecycle";
import { useForceUpdate } from ".";

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
  const slotRef = useRef(null);
  // const contentRef = useRef<any>(null);
  // const forceUpdate = useForceUpdate();
  const [contents, setContents] = useState<any>();
  const { extension } = useContext(ComponentContext);
  const [lifecycle, setLifecycle] =
    useState<LifecycleWithContext<Record<string, any>>>();

  useEffect(() => {
    if (extension) {
      const registration = getExtensionRegistration(extension?.extensionId);
      if (
        registration &&
        checkStatus(registration.online, registration.offline)
      ) {
        registration.load().then(setLifecycle);
      }
    }
  }, [extension]);

  useEffect(() => {
    if (extension && slotRef.current && lifecycle) {
      if (lifecycle.framework == "react") {
        // contentRef.current = lifecycle.lifecycleOpts.rootComponent;
        // forceUpdate();
        setContents({ a: lifecycle.lifecycleOpts.rootComponent });
        markExtensionRendered(
          extension.extensionId,
          extension.extensionSlotModuleName,
          extension.extensionSlotName,
          slotRef
        );
        return () => {
          // contentRef.current = null;
          setContents(null);
        };
      } else {
        return renderExtension(
          slotRef.current,
          extension.extensionSlotName,
          extension.extensionSlotModuleName,
          extension.extensionId,
          undefined,
          state
        );
      }
    }
  }, [
    extension?.extensionSlotName,
    extension?.extensionId,
    extension?.extensionSlotModuleName,
    slotRef.current,
    state,
    lifecycle,
  ]);

  // The extension is rendered into the `<slot>`. It is surrounded by a
  // `<div>` with relative positioning in order to allow the UI Editor
  // to absolutely position elements within it.
  const slot = (
    <div
      ref={slotRef}
      data-extension-id={extension?.extensionId}
      style={{ position: "relative" }}
    >
      {/* {contentRef.current && <contentRef.current {...state} />} */}
      {contents && <contents.a {...state} />}
    </div>
  );

  // console.log(contentRef.current);
  return extension && wrap ? wrap(slot, extension) : slot;
};
