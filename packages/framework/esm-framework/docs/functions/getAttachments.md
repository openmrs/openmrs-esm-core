[O3 Framework](../API.md) / getAttachments

# Function: getAttachments()

> **getAttachments**(`patientUuid`, `includeEncounterless`, `abortController`, `encounterUuid?`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\<`any`\>\>

Defined in: [packages/framework/esm-emr-api/src/attachments.ts:51](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/attachments.ts#L51)

Fetches attachments for a specific patient from the OpenMRS server.

## Parameters

### patientUuid

`string`

The UUID of the patient whose attachments should be fetched.

### includeEncounterless

`boolean`

Whether to include attachments that are not associated
  with any encounter. Ignored when `encounterUuid` is set.

### abortController

`AbortController`

An AbortController to allow cancellation of the request.

### encounterUuid?

`string`

When set, only attachments recorded on this encounter are returned.
  The `includeEncounterless` parameter is not sent in that case, because the server
  ignores the encounter filter whenever `includeEncounterless` is present.

## Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\<`any`\>\>

A Promise that resolves with the FetchResponse containing an array of attachments.

## Example

```ts
import { getAttachments } from '@openmrs/esm-framework';
const abortController = new AbortController();
const response = await getAttachments('patient-uuid', true, abortController);
console.log(response.data.results);

const forEncounter = await getAttachments('patient-uuid', false, abortController, 'encounter-uuid');
```
