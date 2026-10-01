[O3 Framework](../API.md) / UnloadedSessionStore

# Type Alias: UnloadedSessionStore

> **UnloadedSessionStore** = `object`

Defined in: [packages/framework/esm-api/src/current-user.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L15)

## Properties

### error?

> `optional` **error**: `Error`

Defined in: [packages/framework/esm-api/src/current-user.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L19)

Set when fetching the session failed before any session had loaded.

***

### initializing?

> `optional` **initializing**: `boolean`

Defined in: [packages/framework/esm-api/src/current-user.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L25)

Set alongside `error`. `true` when the backend appears to be still starting up rather than broken:
it redirected the session request to its initial setup page, or its gateway answered with a 502
shortly after the page loaded.

***

### loaded

> **loaded**: `false`

Defined in: [packages/framework/esm-api/src/current-user.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L16)

***

### session

> **session**: `null`

Defined in: [packages/framework/esm-api/src/current-user.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L17)
