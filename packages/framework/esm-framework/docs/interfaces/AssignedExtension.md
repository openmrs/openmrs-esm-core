[@openmrs/esm-framework](../API.md) / AssignedExtension

# Interface: AssignedExtension

An AssignedExtension is instantiated when it is determined that an extension
should be rendered for a particular extension slot, due to all of the following:
- the extension declaration in routes.json specifies the slot, or
  the `attach()` function is called to attach the extension to the slot, or
  the configuration of the slot adds the extension
- the configuration of the slot does not remove the extension
- the extension is not filtered by featureFlag, online / offline, privileges
  (defined in extension declaration) or 'Display Condition' (defined in configuration)

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

• `Readonly` **config**: ``null`` \| `Readonly`<`ConfigObject`\>

The extension's config. Note that this will be `null` until the slot is mounted.

#### Defined in

[packages/framework/esm-extensions/src/store.ts:88](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L88)

___

### featureFlag

• `Optional` `Readonly` **featureFlag**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:91](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L91)

___

### id

• `Readonly` **id**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:83](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L83)

___

### meta

• `Readonly` **meta**: `Readonly`<[`ExtensionMeta`](ExtensionMeta.md)\>

#### Defined in

[packages/framework/esm-extensions/src/store.ts:86](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L86)

___

### moduleName

• `Readonly` **moduleName**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L85)

___

### name

• `Readonly` **name**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:84](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L84)

___

### offline

• `Optional` `Readonly` **offline**: `boolean` \| `object`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:90](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L90)

___

### online

• `Optional` `Readonly` **online**: `boolean` \| `object`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:89](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L89)
