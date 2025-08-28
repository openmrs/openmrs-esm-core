[O3 Framework](../API.md) / goBackInHistory

# Function: goBackInHistory()

> **goBackInHistory**(`toUrl:`): `void`

Defined in: [packages/framework/esm-navigation/src/history/history.ts:58](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-navigation/src/history/history.ts#L58)

Rolls back the history to the specified point and navigates to that URL.

## Parameters

### toUrl:

The URL in the history to navigate to. History after that index
will be deleted. If the URL is not found in the history, an error will be
thrown.

#### toUrl

`string`

## Returns

`void`
