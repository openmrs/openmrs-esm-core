[O3 Framework](../API.md) / getFeatureFlag

# Function: getFeatureFlag()

> **getFeatureFlag**(`flagName`): `boolean`

Defined in: [packages/framework/esm-feature-flags/src/feature-flags.ts:91](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-feature-flags/src/feature-flags.ts#L91)

Use this function to access the current value of the feature flag.

If you are using React, use `useFeatureFlag` instead.

## Parameters

### flagName

`string`

The name of the feature flag to check.

## Returns

`boolean`

`true` if the feature flag is enabled, `false` otherwise.
