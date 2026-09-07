[O3 Framework](../API.md) / OpenmrsRoutes

# Interface: OpenmrsRoutes

Defined in: [packages/framework/esm-globals/src/types.ts:408](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L408)

This interfaces describes the format of the overall routes.json loaded by the app shell.
Basically, this is the same as the app routes, with each routes definition keyed by the app's name

## Properties

### routes

> **routes**: `Record`\<`Exclude`\<`string`, `"version"`\>, [`OpenmrsAppRoutes`](OpenmrsAppRoutes.md)\>

Defined in: [packages/framework/esm-globals/src/types.ts:412](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L412)

The routes associated with this application keyed by module id

***

### version?

> `optional` **version**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:410](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L410)

The overall version for this application
