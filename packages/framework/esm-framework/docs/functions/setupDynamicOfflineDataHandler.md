[O3 Framework](../API.md) / setupDynamicOfflineDataHandler

# Function: ~~setupDynamicOfflineDataHandler()~~

> **setupDynamicOfflineDataHandler**(`_handler`): `void`

Defined in: [packages/framework/esm-framework/src/deprecated.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/src/deprecated.ts#L30)

## Parameters

### \_handler

#### id

`string`

#### type

`string`

## Returns

`void`

## Deprecated

Offline support has been removed from the framework. This is a
no-op kept only so that frontend modules that still call
`setupDynamicOfflineDataHandler` during registration don't throw. Remove your
dynamic offline data handlers; their data will no longer be cached for offline use.
