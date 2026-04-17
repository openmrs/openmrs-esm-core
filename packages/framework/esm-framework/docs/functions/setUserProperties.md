[O3 Framework](../API.md) / setUserProperties

# Function: setUserProperties()

> **setUserProperties**(`userUuid`, `userProperties`, `abortController?`): `Promise`\<[`SessionStore`](../type-aliases/SessionStore.md)\>

Defined in: [packages/framework/esm-api/src/current-user.ts:387](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L387)

Updates the user properties for a specific user. User properties are key-value
pairs that store user-specific settings and preferences. After updating the
properties on the server, the current user session is refetched to reflect
the changes.

## Parameters

### userUuid

`string`

The UUID of the user whose properties should be updated.

### userProperties

An object containing the properties to set or update.

### abortController?

`AbortController`

Optional AbortController to allow cancellation of the request.
  If not provided, a new AbortController is created.

## Returns

`Promise`\<[`SessionStore`](../type-aliases/SessionStore.md)\>

A Promise that resolves with the updated SessionStore after refetching
  the current user.

## Example

```ts
import { getLoggedInUser, setUserProperties } from '@openmrs/esm-api';
const user = await getLoggedInUser();
await setUserProperties(user.uuid, {
  defaultLocale: 'en_GB',
  customSetting: 'value'
});
```
