[O3 Framework](../API.md) / setupOfflineSync

# Function: ~~setupOfflineSync()~~

> **setupOfflineSync**\<`T`\>(`_type`, `_dependsOn`, `_process`, `_options?`): `void`

Defined in: [packages/framework/esm-framework/src/deprecated.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/src/deprecated.ts#L15)

## Type Parameters

### T

`T` = `unknown`

## Parameters

### \_type

`string`

### \_dependsOn

`string`[]

### \_process

(`item`, `options`) => `Promise`\<`unknown`\>

### \_options?

`unknown`

## Returns

`void`

## Deprecated

Offline support has been removed from the framework. This is a
no-op kept only so that frontend modules that still call `setupOfflineSync`
during registration don't throw. Remove your offline sync handlers; queued
items will no longer be synchronized.
