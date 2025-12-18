[O3 Framework](../API.md) / attach

# Function: attach()

> **attach**(`slotName`, `extensionId`): `void`

Defined in: [packages/framework/esm-extensions/src/extensions.ts:222](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/extensions.ts#L222)

Attach an extension to an extension slot.

This will cause the extension to be rendered into the specified
extension slot, unless it is removed by configuration. Using
`attach` is an alternative to specifying the `slot` or `slots`
in the extension declaration.

It is particularly useful when creating a slot into which
you want to render an existing extension. This enables you
to do so without modifying the extension's declaration, which
may be impractical or inappropriate, for example if you are
writing a module for a specific implementation.

## Parameters

### slotName

`string`

a name uniquely identifying the slot

### extensionId

`string`

an extension name, with an optional #-suffix
   to distinguish it from other instances of the same extension
   attached to the same slot.

## Returns

`void`
