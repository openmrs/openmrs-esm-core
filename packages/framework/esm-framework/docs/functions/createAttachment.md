[O3 Framework](../API.md) / createAttachment

# Function: createAttachment()

> **createAttachment**(`patientUuid`, `fileToUpload`, `encounterUuid?`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\<`any`\>\>

Defined in: [packages/framework/esm-emr-api/src/attachments.ts:106](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/attachments.ts#L106)

Creates a new attachment for a patient by uploading a file to the OpenMRS server.
The file can be provided either as a File object or as base64-encoded content.

## Parameters

### patientUuid

`string`

The UUID of the patient to associate the attachment with.

### fileToUpload

[`UploadedFile`](../interfaces/UploadedFile.md)

An object containing the file data and metadata to upload.
  Should include `file` (File object) or `base64Content`, plus `fileName` and
  `fileDescription`.

### encounterUuid?

`string`

Optional UUID of an existing encounter to record the attachment on.
  When omitted the attachment is saved without an encounter.

## Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\<`any`\>\>

A Promise that resolves with the FetchResponse containing the created
  attachment data.

## Example

```ts
import { createAttachment } from '@openmrs/esm-framework';
const response = await createAttachment('patient-uuid', {
  file: selectedFile,
  fileName: 'document.pdf',
  fileDescription: 'Patient consent form'
});

// Record the attachment on a specific encounter
await createAttachment('patient-uuid', uploadedFile, 'encounter-uuid');
```
