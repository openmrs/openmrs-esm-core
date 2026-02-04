[O3 Framework](../API.md) / isOnline

# Function: isOnline()

> **isOnline**(`online?`): `boolean`

Defined in: packages/framework/esm-utils/dist/is-online.d.ts:13

Determines if the application should behave as if it is online.
When offline mode is enabled (`window.offlineEnabled`), this returns the
provided `online` parameter or falls back to `navigator.onLine`.
When offline mode is disabled, this always returns `true`.

## Parameters

### online?

`boolean`

Optional override for the online status. If provided and offline
  mode is enabled, this value is returned directly.

## Returns

`boolean`

`true` if the application should behave as online, `false` otherwise.
