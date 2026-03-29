[O3 Framework](../API.md) / normalizeInterpretation

# Function: normalizeInterpretation()

> **normalizeInterpretation**(`interpretation`): `undefined` \| `"normal"` \| `"high"` \| `"low"` \| `"critically_low"` \| `"critically_high"` \| `"off_scale_low"` \| `"off_scale_high"`

Defined in: [packages/framework/esm-styleguide/src/numeric-observation/interpretation-utils.ts:42](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/numeric-observation/interpretation-utils.ts#L42)

Normalizes interpretation between lowercase (ObservationInterpretation) and uppercase (OBSERVATION_INTERPRETATION) formats

## Parameters

### interpretation

`undefined` | `"normal"` | `"high"` | `"low"` | `"NORMAL"` | `"HIGH"` | `"CRITICALLY_HIGH"` | `"OFF_SCALE_HIGH"` | `"LOW"` | `"CRITICALLY_LOW"` | `"OFF_SCALE_LOW"` | `"critically_low"` | `"critically_high"` | `"off_scale_low"` | `"off_scale_high"` | `"--"`

## Returns

`undefined` \| `"normal"` \| `"high"` \| `"low"` \| `"critically_low"` \| `"critically_high"` \| `"off_scale_low"` \| `"off_scale_high"`
