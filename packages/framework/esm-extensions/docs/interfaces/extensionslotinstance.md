[@openmrs/esm-extensions](../API.md) / ExtensionSlotInstance

# Interface: ExtensionSlotInstance

## Table of contents

### Properties

- [addedIds](extensionslotinstance.md#addedids)
- [idOrder](extensionslotinstance.md#idorder)
- [removedIds](extensionslotinstance.md#removedids)

## Properties

### addedIds

• **addedIds**: `string`[]

A set of additional extension IDs which have been added to to this slot despite not being
explicitly `attach`ed to it.
An example may be an extension which is added to the slot via the configuration.

#### Defined in

[store.ts:46](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L46)

___

### idOrder

• **idOrder**: `string`[]

A set allowing explicit ordering of the `assignedIds`.

#### Defined in

[store.ts:56](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L56)

___

### removedIds

• **removedIds**: `string`[]

A set of extension IDs which have been removed/hidden from this slot, even though they have
previously been `attach`ed/added to it.
An example may be an extension which is removed from the slot via the configuration.

#### Defined in

[store.ts:52](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L52)
