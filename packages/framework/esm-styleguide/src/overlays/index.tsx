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

/**
 * Registers a new overlay to display.
 * @param overlayDefinition
 */
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
 * Shows the provided component in an overlay window.
 * @param name name of the overlay registered with
 * @param props props that will be passed into the overlay content component
 */
export function showOverlay(
  name: string,
  props: {
    overlayTitle?: string;
    [x: string]: any;
  } = {},
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
  if (overlayRegistration) {
    openInstance({
      ...overlayRegistration,
      overlayTitle: props?.overlayTitle ?? overlayRegistration.title,
      props: {
        ...props,
        closeOverlay: (onClose: () => void = () => {}) => closeInstance(name, onClose),
      },
    });
  }
}
