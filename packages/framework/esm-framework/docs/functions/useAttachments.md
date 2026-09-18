[O3 Framework](../API.md) / useAttachments

# Function: useAttachments()

> **useAttachments**(`patientUuid`, `includeEncounterless`, `encounterUuid?`): `object`

Defined in: [packages/framework/esm-react-utils/src/useAttachments.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useAttachments.ts#L37)

A React hook that fetches attachments for a patient using SWR for caching
and automatic revalidation.

## Parameters

### patientUuid

`string`

The UUID of the patient whose attachments should be fetched.

### includeEncounterless

`boolean`

Whether to include attachments that are not
  associated with any encounter. Ignored when `encounterUuid` is set.

### encounterUuid?

`string`

When set, only attachments recorded on this encounter are
  returned.

## Returns

`object`

An object containing:
  - `data`: Array of attachment objects (empty array while loading)
  - `isLoading`: Whether the initial fetch is in progress
  - `isValidating`: Whether any request (initial or revalidation) is in progress
  - `error`: Any error that occurred during fetching
  - `mutate`: Function to trigger a revalidation of the data

### data

> **data**: [`AttachmentResponse`](../interfaces/AttachmentResponse.md)[]

### error

> **error**: `any`

### isLoading

> **isLoading**: `boolean`

### isValidating

> **isValidating**: `boolean`

### mutate

> **mutate**: `KeyedMutator`\<[`FetchResponse`](../interfaces/FetchResponse.md)\<\{ `results`: [`AttachmentResponse`](../interfaces/AttachmentResponse.md)[]; \}\>\>

## Example

```tsx
import { useAttachments } from '@openmrs/esm-framework';
function PatientAttachments({ patientUuid }) {
  const { data, isLoading, error } = useAttachments(patientUuid, true);
  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error loading attachments</span>;
  return <AttachmentList attachments={data} />;
}

// Only the attachments recorded on one encounter
const { data } = useAttachments(patientUuid, false, encounterUuid);
```
