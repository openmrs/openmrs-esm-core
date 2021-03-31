[@openmrs/esm-extensions](../API.md) / ExtensionSlotInfo

# Interface: ExtensionSlotInfo

## Table of contents

### Properties

- [attachedIds](extensionslotinfo.md#attachedids)
- [instances](extensionslotinfo.md#instances)
- [name](extensionslotinfo.md#name)

### Methods

- [matches](extensionslotinfo.md#matches)

## Properties

### attachedIds

• **attachedIds**: *string*[]

The set of extension IDs which have been attached to this slot.
This is essentially a complete history of `attach` calls to this specific slot.
However, not all of these extension IDs should be rendered.
`assignedIds` is the set defining those.

Defined in: [store.ts:80](https://github.com/nk183/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L80)

___

### instances

• **instances**: *Record*<string, [*ExtensionSlotInstance*](extensionslotinstance.md)\>

The mapping of modules / extension slot instances where the extension slot has been used.

Defined in: [store.ts:73](https://github.com/nk183/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L73)

___

### name

• **name**: *string*

The name under which the extension slot has been registered.

Defined in: [store.ts:69](https://github.com/nk183/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L69)

## Methods

### matches

▸ **matches**(`actualExtensionSlotName`: *string*): *boolean*

Returns whether the given extension slot name corresponds to this ExtensionSlotInfo.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`actualExtensionSlotName` | *string* | The actual extension slot name into which the extensions might be rendered. For URL like extension slots, this should be the name where parameters have been replaced with actual values (e.g. `/mySlot/213da954-87a2-432d-91f6-a3c441851726`).    |

**Returns:** *boolean*

Defined in: [store.ts:87](https://github.com/nk183/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L87)
