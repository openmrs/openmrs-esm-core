[O3 Framework](../API.md) / useFeatureFlag

# Function: useFeatureFlag()

> **useFeatureFlag**(`flagName`): `boolean`

Defined in: [packages/framework/esm-react-utils/src/useFeatureFlag.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-react-utils/src/useFeatureFlag.ts#L18)

Use this function to tell whether a feature flag is toggled on or off.

Example:

```tsx
import { useFeatureFlag } from "@openmrs/esm-react-utils";

export function MyComponent() {
 const isMyFeatureFlagOn = useFeatureFlag("my-feature-flag");
 return <>{isMyFeatureFlagOn && <ExperimentalFeature />}</>;
}
```

## Parameters

### flagName

`string`

## Returns

`boolean`
