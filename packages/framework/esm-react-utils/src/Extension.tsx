/** @module @category Extension */
import { renderExtension } from '@openmrs/esm-extensions';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { type Parcel } from 'single-spa';
import { ComponentContext } from '.';

export type ExtensionProps = React.HTMLAttributes<HTMLDivElement> & {
  state?: Record<string, unknown>;
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
export const Extension: React.FC<ExtensionProps> = ({ state, children, ...divProps }) => {
  const { extension } = useContext(ComponentContext);
  const parcel = useRef<Parcel | null>(null);
  const updatePromise = useRef<Promise<void>>(Promise.resolve());
  const isUnmounted = useRef(false);

  // Takes the parcel to tear down rather than reading `parcel.current`, which can be reassigned
  // between scheduling this and running it.
  const unmountParcel = useCallback((target: Parcel | null) => {
    if (!target) {
      return;
    }

    const unmountWhenMounted = () => {
      if (target.getStatus() === 'MOUNTED') {
        target.unmount();
      }
    };

    switch (target.getStatus()) {
      case 'MOUNTED':
        target.unmount();
        break;
      case 'UPDATING':
        // The rejection is reported by whoever owns `updatePromise`; here it only matters that a
        // failed update still runs the teardown, or the parcel is left broken and mounted.
        updatePromise.current?.then(unmountWhenMounted, unmountWhenMounted);
        break;
      default:
        // Any other status: the parcel either hasn't finished coming up or is already gone.
        // `mountPromise` has settled or will, and `unmountWhenMounted` re-checks the status.
        target.mountPromise.then(unmountWhenMounted, () => {});
    }
  }, []);

  const ref = useCallback((node: HTMLDivElement | null) => {
    // React detaches a ref by calling it with null. That is not a request to render anything, and
    // rendering into it warns and then resolves to null — clearing a parcel that may still be
    // coming up, which leaves it mounted into a detached node for the life of the page.
    if (!node || parcel.current || !extension?.extensionSlotName || !extension.extensionSlotModuleName) {
      return;
    }

    renderExtension(
      node,
      extension.extensionSlotName,
      extension.extensionSlotModuleName,
      extension.extensionId,
      undefined,
      state,
    ).then((newParcel: Parcel | null) => {
      parcel.current = newParcel;

      // Loading an extension's bundle can outlast the component that asked for it: the cleanup
      // effect has already run and saw no parcel, so teardown has to happen here instead, or the
      // parcel mounts into a detached node and its instance record outlives the page.
      if (isUnmounted.current) {
        unmountParcel(newParcel);
      }
    });
  }, []);

  useEffect(() => {
    // Reset on every run, not just the first: StrictMode mounts, tears down and mounts again, so
    // a flag only ever set by the cleanup would still read "unmounted" for the live component.
    isUnmounted.current = false;

    return () => {
      isUnmounted.current = true;
      unmountParcel(parcel.current);
    };
  }, []);

  useEffect(() => {
    if (parcel.current && parcel.current.update && parcel.current.getStatus() !== 'UNMOUNTING') {
      Promise.all([parcel.current.mountPromise, updatePromise.current]).then(() => {
        if (parcel?.current?.getStatus() === 'MOUNTED' && parcel.current.update) {
          updatePromise.current = parcel.current.update({ ...state }).catch((err) => {
            // if we were trying to update but the component was unmounted
            // while this was happening, ignore the error
            if (
              !(err instanceof Error) ||
              !err.message.includes('minified message #32') ||
              parcel.current?.getStatus() === 'MOUNTED'
            ) {
              throw err;
            }
          });
        }
      });
    }
  }, [state]);

  // The extension is rendered into the `<div>`. The `<div>` has relative
  // positioning in order to allow the UI Editor to absolutely position
  // elements within it.
  return extension ? (
    <div ref={ref} data-extension-id={extension?.extensionId} style={{ position: 'relative' }} {...divProps} />
  ) : null;
};
