[O3 Framework](../API.md) / useAttachments

# Function: useAttachments()

> **useAttachments**(`patientUuid`, `includeEncounterless`): `object`

Defined in: [packages/framework/esm-react-utils/src/useAttachments.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useAttachments.ts#L7)

## Parameters

### patientUuid

`string`

### includeEncounterless

`boolean`

## Returns

`object`

### data

> **data**: `AttachmentResponse`[]

### error

> **error**: `any`

### isLoading

> **isLoading**: `boolean`

### isValidating

> **isValidating**: `boolean`

### mutate

> **mutate**: `KeyedMutator`\<`FetchResponse`\<\{ `results`: `AttachmentResponse`[]; \}\>\>
