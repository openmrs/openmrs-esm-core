[O3 Framework](../API.md) / Extension

# Variable: Extension

> `const` **Extension**: `React.FC`\<[`ExtensionProps`](../type-aliases/ExtensionProps.md)\>

Defined in: [packages/framework/esm-react-utils/src/Extension.tsx:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/Extension.tsx#L20)

Represents the position in the DOM where each extension within
an extension slot is rendered.

Renders once for each extension attached to that extension slot.

Usage of this component *must* have an ancestor `<ExtensionSlot>`,
and *must* only be used once within that `<ExtensionSlot>`.
