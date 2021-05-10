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

Defined in: [packages/esm-extensions/src/store.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L25)

___

### meta

• **meta**: [*ExtensionMeta*](extensionmeta.md)

Inherited from: [ExtensionRegistration](extensionregistration.md).[meta](extensionregistration.md#meta)

Defined in: [packages/esm-extensions/src/store.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L15)

___

### moduleName

• **moduleName**: *string*

Inherited from: [ExtensionRegistration](extensionregistration.md).[moduleName](extensionregistration.md#modulename)

Defined in: [packages/esm-extensions/src/store.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L14)

___

### name

• **name**: *string*

Inherited from: [ExtensionRegistration](extensionregistration.md).[name](extensionregistration.md#name)

Defined in: [packages/esm-extensions/src/store.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L12)

___

### offline

• `Optional` **offline**: *boolean* \| *object*

Inherited from: [ExtensionRegistration](extensionregistration.md).[offline](extensionregistration.md#offline)

Defined in: [packages/esm-extensions/src/store.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L17)

___

### online

• `Optional` **online**: *boolean* \| *object*

Inherited from: [ExtensionRegistration](extensionregistration.md).[online](extensionregistration.md#online)

Defined in: [packages/esm-extensions/src/store.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L16)

## Methods

### load

▸ **load**(): *Promise*<any\>

**Returns:** *Promise*<any\>

Inherited from: [ExtensionRegistration](extensionregistration.md)

Defined in: [packages/esm-extensions/src/store.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L13)
