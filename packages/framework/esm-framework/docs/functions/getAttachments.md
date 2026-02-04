[O3 Framework](../API.md) / getAttachments

# Function: getAttachments()

> **getAttachments**(`patientUuid`, `includeEncounterless`, `abortController`): `Promise`\<`FetchResponse`\<`any`\>\>

Defined in: [packages/framework/esm-emr-api/src/attachments.ts:46](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/attachments.ts#L46)

Fetches all attachments for a specific patient from the OpenMRS server.

## Parameters

### patientUuid

`string`

The UUID of the patient whose attachments should be fetched.

### includeEncounterless

`boolean`

Whether to include attachments that are not associated
  with any encounter.

### abortController

`AbortController`

An AbortController to allow cancellation of the request.

## Returns

`Promise`\<`FetchResponse`\<`any`\>\>

A Promise that resolves with the FetchResponse containing an array of attachments.

## Example

```ts
import { getAttachments } from '@openmrs/esm-framework';
const abortController = new AbortController();
const response = await getAttachments('patient-uuid', true, abortController);
console.log(response.data.results);
```
