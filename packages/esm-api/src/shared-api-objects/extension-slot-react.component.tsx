import React from "react";

export interface ExtensionSlotReactProps {
  name: string;
  params: any;
}

declare global {
  interface Window {
    renderOpenmrsExtension(
      target: HTMLElement,
      name: string,
      params: any
    ): CancelLoading;
  }
}

interface CancelLoading {
  (): void;
}

/**
 * @deprecated Use the import from @openmrs/esm-extension-manager instead!
 */
export const ExtensionSlotReact: React.FC<ExtensionSlotReactProps> = ({
  name,
  params,
}) => {
  const ref = React.useRef<HTMLSlotElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      return window.renderOpenmrsExtension(ref.current, name, params);
    }
  }, [name, params]);

  return <slot ref={ref} />;
};
