[O3 Framework](../API.md) / ResponsiveWrapper

# Variable: ResponsiveWrapper

> `const` **ResponsiveWrapper**: `React.FC`\<[`ResponsiveWrapperProps`](../interfaces/ResponsiveWrapperProps.md)\>

Defined in: [packages/framework/esm-styleguide/src/responsive-wrapper/responsive-wrapper.component.tsx:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/responsive-wrapper/responsive-wrapper.component.tsx#L15)

ResponsiveWrapper enables a responsive behavior for the component its wraps, providing a different rendering based on the current layout type.
On desktop, it renders the children as is, while on a tablet, it wraps them in a Carbon Layer https://react.carbondesignsystem.com/?path=/docs/components-layer--overview component.
This provides a light background for form inputs on tablets, in accordance with the design requirements.
