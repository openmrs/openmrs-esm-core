[@openmrs/esm-framework](../API.md) / AssignedExtension

# Interface: AssignedExtension

## Table of contents

### Extension Properties

- [config](AssignedExtension.md#config)
- [featureFlag](AssignedExtension.md#featureflag)
- [id](AssignedExtension.md#id)
- [meta](AssignedExtension.md#meta)
- [moduleName](AssignedExtension.md#modulename)
- [name](AssignedExtension.md#name)
- [offline](AssignedExtension.md#offline)
- [online](AssignedExtension.md#online)

## Extension Properties

### config

• `Readonly` **config**: ``null`` \| `Readonly`<[`ConfigObject`](ConfigObject.md)\>

The extension's config. Note that this will be `null` until the slot is mounted.

#### Defined in

[packages/framework/esm-extensions/src/store.ts:78](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L78)

___

### featureFlag

• `Optional` `Readonly` **featureFlag**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L81)

___

### id

• `Readonly` **id**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:73](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L73)

___

### meta

• `Readonly` **meta**: `Readonly`<[`ExtensionMeta`](ExtensionMeta.md)\>

#### Defined in

[packages/framework/esm-extensions/src/store.ts:76](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L76)

___

### moduleName

• `Readonly` **moduleName**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:75](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L75)

___

### name

• `Readonly` **name**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:74](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L74)

___

### offline

• `Optional` `Readonly` **offline**: `boolean` \| `object`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:80](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L80)

___

### online

• `Optional` `Readonly` **online**: `boolean` \| `object`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:79](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L79)
