[O3 Framework](../API.md) / AssignedExtension

# Interface: AssignedExtension

Defined in: [packages/framework/esm-extensions/src/store.ts:112](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L112)

## Properties

### config

> `readonly` **config**: `null` \| `Readonly`\<[`ConfigObject`](ConfigObject.md)\>

Defined in: [packages/framework/esm-extensions/src/store.ts:118](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L118)

The extension's config. Note that this will be `null` until the slot is mounted.

***

### displayConditionExpression?

> `readonly` `optional` **displayConditionExpression**: `string`

Defined in: [packages/framework/esm-extensions/src/store.ts:123](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L123)

The condition under which this extension should be displayed.

***

### featureFlag?

> `readonly` `optional` **featureFlag**: `string`

Defined in: [packages/framework/esm-extensions/src/store.ts:121](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L121)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/framework/esm-extensions/src/store.ts:113](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L113)

***

### meta

> `readonly` **meta**: `Readonly`\<[`ExtensionMeta`](ExtensionMeta.md)\>

Defined in: [packages/framework/esm-extensions/src/store.ts:116](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L116)

***

### moduleName

> `readonly` **moduleName**: `string`

Defined in: [packages/framework/esm-extensions/src/store.ts:115](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L115)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/framework/esm-extensions/src/store.ts:114](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L114)

***

### offline?

> `readonly` `optional` **offline**: `boolean` \| `object`

Defined in: [packages/framework/esm-extensions/src/store.ts:120](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L120)

***

### online?

> `readonly` `optional` **online**: `boolean` \| `object`

Defined in: [packages/framework/esm-extensions/src/store.ts:119](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L119)
