[@openmrs/esm-extensions](../API.md) / ExtensionInfo

# Interface: ExtensionInfo

## Hierarchy

* [*ExtensionRegistration*](extensionregistration.md)

  ↳ **ExtensionInfo**

## Table of contents

### Properties

- [instances](extensioninfo.md#instances)
- [moduleName](extensioninfo.md#modulename)
- [name](extensioninfo.md#name)

### Methods

- [load](extensioninfo.md#load)

## Properties

### instances

• **instances**: *Record*<string, Record<string, [*ExtensionInstance*](extensioninstance.md)\>\>

The instances where the extension has been rendered using `renderExtension`,
indexed by slotModuleName and actualExtensionSlotName

Defined in: [store.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L21)

___

### moduleName

• **moduleName**: *string*

Inherited from: [ExtensionRegistration](extensionregistration.md).[moduleName](extensionregistration.md#modulename)

Defined in: [store.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L13)

___

### name

• **name**: *string*

Inherited from: [ExtensionRegistration](extensionregistration.md).[name](extensionregistration.md#name)

Defined in: [store.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L8)

## Methods

### load

▸ **load**(): *Promise*<any\>

**Returns:** *Promise*<any\>

Inherited from: [ExtensionRegistration](extensionregistration.md)

Defined in: [store.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L9)
