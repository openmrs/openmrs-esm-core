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
- [offline](extensioninfo.md#offline)
- [online](extensioninfo.md#online)

### Methods

- [load](extensioninfo.md#load)

## Properties

### instances

• **instances**: *Record*<string, Record<string, [*ExtensionInstance*](extensioninstance.md)\>\>

The instances where the extension has been rendered using `renderExtension`,
indexed by slotModuleName and slotName.

Defined in: [packages/esm-extensions/src/store.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L21)

___

### meta

• **meta**: *Record*<string, any\>

Inherited from: [ExtensionRegistration](extensionregistration.md).[meta](extensionregistration.md#meta)

Defined in: [packages/esm-extensions/src/store.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L11)

___

### moduleName

• **moduleName**: *string*

Inherited from: [ExtensionRegistration](extensionregistration.md).[moduleName](extensionregistration.md#modulename)

Defined in: [packages/esm-extensions/src/store.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L10)

___

### name

• **name**: *string*

Inherited from: [ExtensionRegistration](extensionregistration.md).[name](extensionregistration.md#name)

Defined in: [packages/esm-extensions/src/store.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L8)

___

### offline

• `Optional` **offline**: *boolean* \| *object*

Inherited from: [ExtensionRegistration](extensionregistration.md).[offline](extensionregistration.md#offline)

Defined in: [packages/esm-extensions/src/store.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L13)

___

### online

• `Optional` **online**: *boolean* \| *object*

Inherited from: [ExtensionRegistration](extensionregistration.md).[online](extensionregistration.md#online)

Defined in: [packages/esm-extensions/src/store.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L12)

## Methods

### load

▸ **load**(): *Promise*<any\>

**Returns:** *Promise*<any\>

Inherited from: [ExtensionRegistration](extensionregistration.md)

Defined in: [packages/esm-extensions/src/store.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L9)
