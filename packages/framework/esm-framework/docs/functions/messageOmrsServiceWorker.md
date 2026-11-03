[O3 Framework](../API.md) / messageOmrsServiceWorker

# Function: ~~messageOmrsServiceWorker()~~

> **messageOmrsServiceWorker**(`_message`): `Promise`\<\{ `error`: `string`; `result`: `undefined`; `success`: `false`; \}\>

Defined in: [packages/framework/esm-framework/src/deprecated.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/src/deprecated.ts#L59)

## Parameters

### \_message

`unknown`

## Returns

`Promise`\<\{ `error`: `string`; `result`: `undefined`; `success`: `false`; \}\>

## Deprecated

The offline service worker has been removed from the framework.
This is a no-op kept only so that frontend modules that still call
`messageOmrsServiceWorker` don't throw. It always resolves to an
unsuccessful result, mirroring the previous "no service worker registered"
behavior.
