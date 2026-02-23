[O3 Framework](../API.md) / isVersionSatisfied

# Function: isVersionSatisfied()

> **isVersionSatisfied**(`requiredVersion`, `installedVersion`): `boolean`

Defined in: packages/framework/esm-utils/dist/version.d.ts:10

Checks if an installed version satisfies a required version range using
semver comparison. Handles prerelease versions and normalizes version strings.

## Parameters

### requiredVersion

`string`

A semver range string (e.g., "^1.0.0", ">=2.0.0").

### installedVersion

`string`

The installed version string to check against the range.

## Returns

`boolean`

`true` if the installed version satisfies the required version range.
