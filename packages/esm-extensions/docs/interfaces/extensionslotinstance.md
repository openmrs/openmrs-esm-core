[@openmrs/esm-extensions](../API.md) / ExtensionSlotInstance

# Interface: ExtensionSlotInstance

## Table of contents

### Properties

- [addedIds](extensionslotinstance.md#addedids)
- [assignedIds](extensionslotinstance.md#assignedids)
- [domElement](extensionslotinstance.md#domelement)
- [idOrder](extensionslotinstance.md#idorder)
- [registered](extensionslotinstance.md#registered)
- [removedIds](extensionslotinstance.md#removedids)

## Properties

### addedIds

• **addedIds**: *string*[]

A set of additional extension IDs which have been added to to this slot despite not being
explicitly `attach`ed to it.
An example may be an extension which is added to the slot via the configuration.

Defined in: [store.ts:46](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L46)

___

### assignedIds

• **assignedIds**: *string*[]

The set of extensions IDs which should be rendered into this slot at the current point in time.

Defined in: [store.ts:40](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L40)

___

### domElement

• **domElement**: *null* \| HTMLElement

The dom element at which the slot is mounted

Defined in: [store.ts:64](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L64)

___

### idOrder

• **idOrder**: *string*[]

A set allowing explicit ordering of the `assignedIds`.

Defined in: [store.ts:56](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L56)

___

### registered

• **registered**: *number*

The number of active registrations on the instance.

Defined in: [store.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L60)

___

### removedIds

• **removedIds**: *string*[]

A set of extension IDs which have been removed/hidden from this slot, even though they have
previously been `attach`ed/added to it.
An example may be an extension which is removed from the slot via the configuration.

Defined in: [store.ts:52](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L52)
