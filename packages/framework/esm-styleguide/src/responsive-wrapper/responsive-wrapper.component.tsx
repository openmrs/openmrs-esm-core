import React from 'react';
import { Layer } from '@carbon/react';
import { useLayoutType } from '@openmrs/esm-framework';

type ResponsiveWrapperProps = {
  children: React.ReactNode;
};

/**
 * ResponsiveWrapper enables a responsive behavior for the component its wraps, providing a different rendering based on the current layout type.
 * On desktop, it renders the children as is, while on a tablet, it wraps them in a Carbon Layer https://react.carbondesignsystem.com/?path=/docs/components-layer--overview component.
 * This provides a light background for form inputs on tablets, in accordance with the design requirements.
 */
export default function ResponsiveWrapper({ children }: ResponsiveWrapperProps) {
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';

  if (isTablet) {
    return <Layer>{children}</Layer>;
  }

  return <>{children}</>;
}
