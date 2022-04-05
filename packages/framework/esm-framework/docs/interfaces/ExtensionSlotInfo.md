[@openmrs/esm-framework](../API.md) / ExtensionSlotInfo

# Interface: ExtensionSlotInfo

## Table of contents

### Properties

- [attachedIds](ExtensionSlotInfo.md#attachedids)
- [config](ExtensionSlotInfo.md#config)
- [moduleName](ExtensionSlotInfo.md#modulename)
- [name](ExtensionSlotInfo.md#name)

## Properties

### attachedIds

• **attachedIds**: `string`[]

The set of extension IDs which have been attached to this slot using `attach`.
However, not all of these extension IDs should be rendered.
`assignedIds` is the set defining those.

#### Defined in

[packages/framework/esm-extensions/src/store.ts:58](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L58)

___

### config

• **config**: ``null`` \| [`ExtensionSlotConfigObject`](ExtensionSlotConfigObject.md)

The configuration provided for this slot. `null` if not yet loaded.

#### Defined in

[packages/framework/esm-extensions/src/store.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L60)

___

### moduleName

• `Optional` **moduleName**: `string`

The module in which the extension slot exists. Undefined if the slot
hasn't been registered yet (but it has been attached or assigned to
an extension.

#### Defined in

[packages/framework/esm-extensions/src/store.ts:50](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L50)

___

### name

• **name**: `string`

The name under which the extension slot has been registered.

#### Defined in

[packages/framework/esm-extensions/src/store.ts:52](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L52)
