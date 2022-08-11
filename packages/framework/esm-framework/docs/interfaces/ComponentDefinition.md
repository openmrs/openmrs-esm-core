[@openmrs/esm-framework](../API.md) / ComponentDefinition

# Interface: ComponentDefinition

## Hierarchy

- **`ComponentDefinition`**

  ↳ [`ExtensionDefinition`](ExtensionDefinition.md)

  ↳ [`PageDefinition`](PageDefinition.md)

## Table of contents

### Properties

- [appName](ComponentDefinition.md#appname)
- [offline](ComponentDefinition.md#offline)
- [online](ComponentDefinition.md#online)
- [privilege](ComponentDefinition.md#privilege)
- [resources](ComponentDefinition.md#resources)

### Methods

- [load](ComponentDefinition.md#load)

## Properties

### appName

• **appName**: `string`

#### Defined in

[packages/framework/esm-globals/src/types.ts:99](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L99)

___

### offline

• `Optional` **offline**: `boolean` \| `object`

#### Defined in

[packages/framework/esm-globals/src/types.ts:111](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L111)

___

### online

• `Optional` **online**: `boolean` \| `object`

#### Defined in

[packages/framework/esm-globals/src/types.ts:107](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L107)

___

### privilege

• `Optional` **privilege**: `string` \| `string`[]

#### Defined in

[packages/framework/esm-globals/src/types.ts:116](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L116)

___

### resources

• `Optional` **resources**: `Record`<`string`, [`ResourceLoader`](ResourceLoader.md)<`any`\>\>

#### Defined in

[packages/framework/esm-globals/src/types.ts:120](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L120)

## Methods

### load

▸ **load**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/framework/esm-globals/src/types.ts:103](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L103)
