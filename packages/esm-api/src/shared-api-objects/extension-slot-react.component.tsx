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

export const ExtensionSlotReact: React.FC<ExtensionSlotReactProps> = ({
  name,
  params,
}) => {
  const ref = React.useRef<HTMLSlotElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      return window.renderOpenmrsExtension(ref.current, name, params);
    }
  }, []);

  return <slot ref={ref} />;
};
