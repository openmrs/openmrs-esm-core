[O3 Framework](../API.md) / updateVisit

# Function: updateVisit()

> **updateVisit**(`uuid`, `payload`, `abortController`): `Promise`\<`FetchResponse`\<[`Visit`](../interfaces/Visit.md)\>\>

Defined in: [packages/framework/esm-emr-api/src/visit-utils.ts:162](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/visit-utils.ts#L162)

Updates an existing visit by sending a POST request to the OpenMRS REST API.

## Parameters

### uuid

`string`

The UUID of the visit to update.

### payload

[`UpdateVisitPayload`](../type-aliases/UpdateVisitPayload.md)

The visit data to update, such as stop datetime or attributes.

### abortController

`AbortController`

An AbortController to allow cancellation of the request.

## Returns

`Promise`\<`FetchResponse`\<[`Visit`](../interfaces/Visit.md)\>\>

A Promise that resolves with the FetchResponse containing the updated Visit.

## Example

```ts
import { updateVisit } from '@openmrs/esm-framework';
const abortController = new AbortController();
const response = await updateVisit('visit-uuid', {
  stopDatetime: new Date().toISOString()
}, abortController);
```
