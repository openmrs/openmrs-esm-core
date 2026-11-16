[O3 Framework](../API.md) / useConceptReferenceRange

# Function: useConceptReferenceRange()

> **useConceptReferenceRange**(`conceptUuid`, `patientUuid`): [`UseConceptReferenceRangeResult`](../interfaces/UseConceptReferenceRangeResult.md)

Defined in: [packages/framework/esm-styleguide/src/numeric-observation/use-concept-reference-range.ts:31](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/numeric-observation/use-concept-reference-range.ts#L31)

Hook to fetch concept reference range from OpenMRS REST API

## Parameters

### conceptUuid

`string` \| `undefined`

The UUID of the concept to fetch reference range for

### patientUuid

`string` \| `undefined`

## Returns

[`UseConceptReferenceRangeResult`](../interfaces/UseConceptReferenceRangeResult.md)

Reference range data, loading state, and error
