[O3 Framework](../API.md) / useExtensionContext

# Function: useExtensionContext()

> **useExtensionContext**(): `undefined` \| [`ExtensionData`](../interfaces/ExtensionData.md)

Defined in: [packages/framework/esm-react-utils/src/useExtensionContext.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useExtensionContext.ts#L12)

A hook for a component rendered as an extension to access its extension context: the slot and
slot module it is rendered in, its extension ID, and its `meta` from the extension's registration.

## Returns

`undefined` \| [`ExtensionData`](../interfaces/ExtensionData.md)

The extension context, or `undefined` when the calling component is not being rendered
  as an extension (a page, modal or workspace, say).
