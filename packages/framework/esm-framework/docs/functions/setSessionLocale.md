[O3 Framework](../API.md) / setSessionLocale

# Function: setSessionLocale()

> **setSessionLocale**(`locale`, `abortController`): `Promise`\<`any`\>

Defined in: [packages/framework/esm-api/src/current-user.ts:381](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L381)

Sets the session locale for the current user. This updates the locale for
the current session only (not the user's saved default). The session store
is updated with the server response, which triggers `setUserLanguage()` to
update the document's `lang` attribute.

## Parameters

### locale

`string`

The locale to set (e.g., 'en_US', 'fr').

### abortController

`AbortController`

An AbortController to allow cancellation of the request.

## Returns

`Promise`\<`any`\>

A Promise that resolves with the updated SessionStore.

## Example

```ts
import { setSessionLocale } from '@openmrs/esm-api';
const abortController = new AbortController();
await setSessionLocale('fr', abortController);
```
