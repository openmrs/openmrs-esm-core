[O3 Framework](../API.md) / registerFeatureFlag

# Function: registerFeatureFlag()

> **registerFeatureFlag**(`flagName`, `label`, `description`): `void`

Defined in: [packages/framework/esm-feature-flags/src/feature-flags.ts:54](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-feature-flags/src/feature-flags.ts#L54)

This function creates a feature flag. Call it in top-level code anywhere. It will
not reset whether the flag is enabled or not, so it's safe to call it multiple times.
Once a feature flag is created, it will appear with a toggle in the Implementer Tools.
It can then be used to turn on or off features in the code.

## Parameters

### flagName

`string`

A code-friendly name for the flag, which will be used to reference it in code

### label

`string`

A human-friendly name which will be displayed in the Implementer Tools

### description

`string`

An explanation of what the flag does, which will be displayed in the Implementer Tools

## Returns

`void`
