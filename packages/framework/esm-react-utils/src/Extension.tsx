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
  const isRendering = useRef(false);
  const latestState = useRef(state);

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

  const applyUpdate = useCallback((target: Parcel, nextState: ExtensionProps['state']) => {
    if (!target.update || target.getStatus() === 'UNMOUNTING') {
      return;
    }

    // Every later update chains onto this promise, so it has to settle even when an update fails.
    updatePromise.current = Promise.all([target.mountPromise, updatePromise.current])
      .then(() => {
        if (parcel.current?.getStatus() === 'MOUNTED' && parcel.current.update) {
          return parcel.current.update({ ...nextState });
        }
      })
      .catch((err) => {
        // A parcel torn down while its update was in flight rejects, and that race is expected.
        // We use the status to distinguish reject reasons as the message isn't reliable
        const status = parcel.current?.getStatus();

        if (status !== 'UNMOUNTING' && status !== 'NOT_MOUNTED' && status !== 'UNLOADING') {
          console.error(`The extension '${extension?.extensionId}' failed to update`, err);
        }
      });
  }, []);

  const ref = useCallback((node: HTMLDivElement | null) => {
    // React detaches a ref by calling it with null. If we render something in response to this,
    // React ignores it and we're left tracking a parcel with no visible DOM, so skip conditions
    // we can't handle.
    if (
      !node ||
      parcel.current ||
      isRendering.current ||
      !extension?.extensionSlotName ||
      !extension.extensionSlotModuleName
    ) {
      return;
    }

    isRendering.current = true;

    renderExtension(
      node,
      extension.extensionSlotName,
      extension.extensionSlotModuleName,
      extension.extensionId,
      undefined,
      state,
    ).then(
      (newParcel: Parcel | null) => {
        isRendering.current = false;
        parcel.current = newParcel;

        // Loading an extension's bundle can outlast the component that asked for it: the cleanup
        // effect has already run and saw no parcel, so teardown has to happen here instead, or the
        // parcel mounts into a detached node and its rendering record outlives the page.
        if (isUnmounted.current) {
          unmountParcel(newParcel);
          return;
        }

        // Ensure we update the state of the parcel to the latest version we've received
        if (newParcel && latestState.current !== state) {
          applyUpdate(newParcel, latestState.current);
        }
      },
      // Cleared so a later reattach can try again; `renderExtension` reports its own failures.
      () => {
        isRendering.current = false;
      },
    );
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
    // Recorded before the parcel is checked, so that a state that arrives before there is a parcel
    // to receive it is still the one applied once there is.
    latestState.current = state;

    if (parcel.current) {
      applyUpdate(parcel.current, state);
    }
  }, [state]);

  // The extension is rendered into the `<div>`. The `<div>` has relative
  // positioning in order to allow the UI Editor to absolutely position
  // elements within it.
  return extension ? (
    <div ref={ref} data-extension-id={extension?.extensionId} style={{ position: 'relative' }} {...divProps} />
  ) : null;
};
