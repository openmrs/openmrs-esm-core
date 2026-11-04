[O3 Framework](../API.md) / subscribePrecacheStaticDependencies

# Function: ~~subscribePrecacheStaticDependencies()~~

> **subscribePrecacheStaticDependencies**(`_callback`): () => `void`

Defined in: [packages/framework/esm-framework/src/deprecated.ts:75](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/src/deprecated.ts#L75)

## Parameters

### \_callback

(`data`) => `void`

## Returns

> (): `void`

### Returns

`void`

## Deprecated

Offline support has been removed from the framework. This is a
no-op kept only so that frontend modules that still call
`subscribePrecacheStaticDependencies` don't throw. The callback is never
invoked. Returns a no-op unsubscribe function so existing teardown code keeps working.
