[@openmrs/esm-extensions](../API.md) / ExtensionSlotInfo

# Interface: ExtensionSlotInfo

## Table of contents

### Properties

- [attachedIds](extensionslotinfo.md#attachedids)
- [instances](extensionslotinfo.md#instances)
- [name](extensionslotinfo.md#name)

## Properties

### attachedIds

• **attachedIds**: `string`[]

The set of extension IDs which have been attached to this slot.
This is essentially a complete history of `attach` calls to this specific slot.
However, not all of these extension IDs should be rendered.
`assignedIds` is the set defining those.

#### Defined in

[store.ts:74](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L74)

___

### instances

• **instances**: `Record`<string, [ExtensionSlotInstance](extensionslotinstance.md)\>

The mapping of modules / extension slot instances where the extension slot has been used.

#### Defined in

[store.ts:67](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L67)

___

### name

• **name**: `string`

The name under which the extension slot has been registered.

#### Defined in

[store.ts:63](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L63)
