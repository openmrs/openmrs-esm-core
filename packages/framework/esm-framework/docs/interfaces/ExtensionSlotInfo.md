[@openmrs/esm-framework](../API.md) / ExtensionSlotInfo

# Interface: ExtensionSlotInfo

## Table of contents

### Properties

- [attachedIds](ExtensionSlotInfo.md#attachedids)
- [instances](ExtensionSlotInfo.md#instances)
- [name](ExtensionSlotInfo.md#name)

## Properties

### attachedIds

• **attachedIds**: `string`[]

The set of extension IDs which have been attached to this slot.
This is essentially a complete history of `attach` calls to this specific slot.
However, not all of these extension IDs should be rendered.
`assignedIds` is the set defining those.

#### Defined in

[packages/framework/esm-extensions/src/store.ts:75](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L75)

___

### instances

• **instances**: `Record`<`string`, [`ExtensionSlotInstance`](ExtensionSlotInstance.md)\>

The mapping of modules / extension slot instances where the extension slot has been used.

#### Defined in

[packages/framework/esm-extensions/src/store.ts:68](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L68)

___

### name

• **name**: `string`

The name under which the extension slot has been registered.

#### Defined in

[packages/framework/esm-extensions/src/store.ts:64](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L64)
