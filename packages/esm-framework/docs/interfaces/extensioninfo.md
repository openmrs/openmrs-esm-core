[@openmrs/esm-framework](../API.md) / ExtensionInfo

# Interface: ExtensionInfo

## Hierarchy

* [*ExtensionRegistration*](extensionregistration.md)

  ↳ **ExtensionInfo**

## Table of contents

### Properties

- [instances](extensioninfo.md#instances)
- [meta](extensioninfo.md#meta)
- [moduleName](extensioninfo.md#modulename)
- [name](extensioninfo.md#name)

### Methods

- [load](extensioninfo.md#load)

## Properties

### instances

• **instances**: *Record*<string, Record<string, [*ExtensionInstance*](extensioninstance.md)\>\>

The instances where the extension has been rendered using `renderExtension`,
indexed by slotModuleName and actualExtensionSlotName

Defined in: [packages/esm-extensions/src/store.ts:19](https://github.com/nk183/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L19)

___

### meta

• **meta**: *Record*<string, any\>

Inherited from: [ExtensionRegistration](extensionregistration.md).[meta](extensionregistration.md#meta)

Defined in: [packages/esm-extensions/src/store.ts:11](https://github.com/nk183/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L11)

___

### moduleName

• **moduleName**: *string*

Inherited from: [ExtensionRegistration](extensionregistration.md).[moduleName](extensionregistration.md#modulename)

Defined in: [packages/esm-extensions/src/store.ts:10](https://github.com/nk183/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L10)

___

### name

• **name**: *string*

Inherited from: [ExtensionRegistration](extensionregistration.md).[name](extensionregistration.md#name)

Defined in: [packages/esm-extensions/src/store.ts:8](https://github.com/nk183/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L8)

## Methods

### load

▸ **load**(): *Promise*<any\>

**Returns:** *Promise*<any\>

Inherited from: [ExtensionRegistration](extensionregistration.md)

Defined in: [packages/esm-extensions/src/store.ts:9](https://github.com/nk183/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L9)
