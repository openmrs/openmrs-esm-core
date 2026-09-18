[O3 Framework](../API.md) / getAttachmentsUrl

# Function: getAttachmentsUrl()

> **getAttachmentsUrl**(`patientUuid`, `includeEncounterless`, `encounterUuid?`): `string`

Defined in: [packages/framework/esm-emr-api/src/attachments.ts:71](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/attachments.ts#L71)

Builds the attachment search URL for a patient. Used by `getAttachments` and `useAttachments`
so both request (and cache under) the same key.

## Parameters

### patientUuid

`string`

The UUID of the patient whose attachments should be fetched.

### includeEncounterless

`boolean`

Whether to include attachments that are not associated
  with any encounter. Ignored when `encounterUuid` is set.

### encounterUuid?

`string`

When set, restricts the search to attachments on this encounter.

## Returns

`string`
