import React from 'react';
import { createRoot } from 'react-dom/client';
import Overlay from './overlay.component';
import {
  type OverlayRegistration,
  closeInstance,
  openInstance,
  overlayStore,
  overlayRegistrations,
  getOverlayRegistration,
} from './overlay.resource';

export function registerOverlay(overlayDefinition: OverlayRegistration) {
  overlayRegistrations[overlayDefinition.name] = overlayDefinition;
}

export function renderOverlays(overlayContainer: HTMLElement | null) {
  if (overlayContainer) {
    const root = createRoot(overlayContainer);
    root.render(<Overlay />);
  }
}

/**
 * Shows the provided extension component in an overlay window.
 * @param extensionId The id of the extension to show.
 * @param props The optional props to provide to the extension.
 * @param onClose The optional notification to receive when the modal is closed.
 * @returns The dispose function to force closing the modal dialog.
 */
export function showOverlay(
  name: string,
  props: {
    overlayTitle?: string;
    [x: string]: any;
  },
) {
  const store = overlayStore;
  const existingOverlay = store.getState().overlayStack.find((x) => x.name === name);
  if (existingOverlay) {
    store.setState((prev) => ({
      ...prev,
      overlayStack: [existingOverlay, ...prev.overlayStack.filter((x) => x.name !== name)],
    }));
    return;
  }

  const overlayRegistration = getOverlayRegistration(name);

  openInstance({
    ...overlayRegistration,
    overlayTitle: props?.overlayTitle ?? overlayRegistration.title,
    props: {
      ...props,
      closeOverlay: (onClose: () => void = () => {}) => closeInstance(name, onClose),
    },
  });

  return close;
}
