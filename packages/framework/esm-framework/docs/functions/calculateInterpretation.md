[O3 Framework](../API.md) / calculateInterpretation

# Function: calculateInterpretation()

> **calculateInterpretation**(`value`, `range?`): `"high"` \| `"low"` \| `"normal"` \| `"critically_low"` \| `"critically_high"` \| `"off_scale_low"` \| `"off_scale_high"`

Defined in: [packages/framework/esm-styleguide/src/numeric-observation/interpretation-utils.ts:68](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/numeric-observation/interpretation-utils.ts#L68)

Calculates interpretation from a numeric value and reference range
Returns lowercase ObservationInterpretation format

## Parameters

### value

`undefined` | `string` | `number`

### range?

[`ObsReferenceRanges`](../interfaces/ObsReferenceRanges.md)

## Returns

`"high"` \| `"low"` \| `"normal"` \| `"critically_low"` \| `"critically_high"` \| `"off_scale_low"` \| `"off_scale_high"`
