[O3 Framework](../API.md) / DisplayConditionsConfigObject

# Interface: DisplayConditionsConfigObject

Defined in: [packages/framework/esm-config/src/types.ts:35](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L35)

## Properties

### expression?

> `optional` **expression**: `string`

Defined in: [packages/framework/esm-config/src/types.ts:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L39)

An expression to evaluate whether or not the user should see this extension

***

### offline?

> `optional` **offline**: `boolean`

Defined in: [packages/framework/esm-config/src/types.ts:43](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L43)

Whether to display this extension when not connected to the server

***

### online?

> `optional` **online**: `boolean`

Defined in: [packages/framework/esm-config/src/types.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L41)

Whether to display this extension when connected to the server

***

### privileges?

> `optional` **privileges**: `string`[]

Defined in: [packages/framework/esm-config/src/types.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L37)

The privileges a user should have to see this extension
