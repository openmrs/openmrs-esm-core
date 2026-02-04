[O3 Framework](../API.md) / getAttachmentByUuid

# Function: getAttachmentByUuid()

> **getAttachmentByUuid**(`attachmentUuid`, `abortController`): `Promise`\<`FetchResponse`\<`any`\>\>

Defined in: [packages/framework/esm-emr-api/src/attachments.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/attachments.ts#L23)

Fetches a single attachment by its UUID from the OpenMRS server.

## Parameters

### attachmentUuid

`string`

The UUID of the attachment to fetch.

### abortController

`AbortController`

An AbortController to allow cancellation of the request.

## Returns

`Promise`\<`FetchResponse`\<`any`\>\>

A Promise that resolves with the FetchResponse containing the attachment data.

## Example

```ts
import { getAttachmentByUuid } from '@openmrs/esm-framework';
const abortController = new AbortController();
const response = await getAttachmentByUuid('attachment-uuid', abortController);
console.log(response.data);
```
