[@openmrs/esm-framework](../API.md) / ConnectedExtension

# Interface: ConnectedExtension

**`deprecated`** replaced with AssignedExtension

## Table of contents

### Extension Properties

- [config](ConnectedExtension.md#config)
- [id](ConnectedExtension.md#id)
- [meta](ConnectedExtension.md#meta)
- [moduleName](ConnectedExtension.md#modulename)
- [name](ConnectedExtension.md#name)

## Extension Properties

### config

• `Readonly` **config**: ``null`` \| `Readonly`<[`ConfigObject`](ConfigObject.md)\>

The extension's config. Note that this will be `null` until the slot is mounted.

#### Defined in

[packages/framework/esm-extensions/src/store.ts:91](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L91)

___

### id

• `Readonly` **id**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:86](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L86)

___

### meta

• `Readonly` **meta**: `Readonly`<[`ExtensionMeta`](ExtensionMeta.md)\>

#### Defined in

[packages/framework/esm-extensions/src/store.ts:89](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L89)

___

### moduleName

• `Readonly` **moduleName**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:88](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L88)

___

### name

• `Readonly` **name**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:87](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L87)
