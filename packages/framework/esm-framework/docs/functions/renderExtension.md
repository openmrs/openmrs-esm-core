[O3 Framework](../API.md) / renderExtension

# Function: renderExtension()

> **renderExtension**(`domElement`, `extensionSlotName`, `extensionSlotModuleName`, `extensionId`, `renderFunction`, `additionalProps`): `Promise`\<`null` \| `Parcel`\>

Defined in: [packages/framework/esm-extensions/src/render.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/render.ts#L18)

Mounts into a DOM node (representing an extension slot)
a lazy-loaded component from *any* frontend module
that registered an extension component for this slot.

## Parameters

### domElement

`HTMLElement`

### extensionSlotName

`string`

### extensionSlotModuleName

`string`

### extensionId

`string`

### renderFunction

(`application`) => `ParcelConfig`

### additionalProps

`Record`\<`string`, `any`\> = `{}`

## Returns

`Promise`\<`null` \| `Parcel`\>
