import React, { useEffect, useState } from 'react';
import { Portal } from './portal';
import styles from './styles.css';

export interface ExtensionOverlayProps {
  extensionName: string;
  slotModuleName: string;
  slotName: string;
  domElement: HTMLElement | null;
}

export function ExtensionOverlay({ extensionName, slotModuleName, slotName, domElement }: ExtensionOverlayProps) {
  const [overlayDomElement, setOverlayDomElement] = useState<HTMLElement>();

  useEffect(() => {
    if (domElement) {
      const newOverlayDomElement = document.createElement('div');
      domElement.parentElement?.appendChild(newOverlayDomElement);
      setOverlayDomElement(newOverlayDomElement);
    }
  }, [domElement]);

  return overlayDomElement ? (
    <Portal key={`extension-overlay-${slotModuleName}-${slotName}-${extensionName}`} el={overlayDomElement}>
      <Content extensionId={extensionName} />
    </Portal>
  ) : null;
}

function Content({ extensionId }) {
  return (
    <button className={styles.extensionOverlay}>
      <span className={styles.extensionTooltip}>{extensionId}</span>
    </button>
  );
}
