[O3 Framework](../API.md) / saveVisit

# Function: saveVisit()

> **saveVisit**(`payload`, `abortController`): `Promise`\<`FetchResponse`\<[`Visit`](../interfaces/Visit.md)\>\>

Defined in: [packages/framework/esm-emr-api/src/visit-utils.ts:134](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/visit-utils.ts#L134)

Creates a new visit by sending a POST request to the OpenMRS REST API.

## Parameters

### payload

[`NewVisitPayload`](../interfaces/NewVisitPayload.md)

The visit data to create, including patient UUID, visit type,
  start datetime, and other visit attributes.

### abortController

`AbortController`

An AbortController to allow cancellation of the request.

## Returns

`Promise`\<`FetchResponse`\<[`Visit`](../interfaces/Visit.md)\>\>

A Promise that resolves with the FetchResponse containing the created Visit.

## Example

```ts
import { saveVisit } from '@openmrs/esm-framework';
const abortController = new AbortController();
const response = await saveVisit({
  patient: 'patient-uuid',
  visitType: 'visit-type-uuid',
  startDatetime: new Date().toISOString()
}, abortController);
```
