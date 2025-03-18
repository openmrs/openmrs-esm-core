/** @module @category Feature Flags */
import { useStore } from './useStore';
import { featureFlagsStore } from '@openmrs/esm-feature-flags';

/** Use this function to tell whether a feature flag is toggled on or off.
 *
 * Example:
 *
 * ```tsx
 * import { useFeatureFlag } from "@openmrs/esm-react-utils";
 *
 * export function MyComponent() {
 *  const isMyFeatureFlagOn = useFeatureFlag("my-feature-flag");
 *  return <>{isMyFeatureFlagOn && <ExperimentalFeature />}</>;
 * }
 * ```
 */
export function useFeatureFlag(flagName: string) {
  const { flags } = useStore(featureFlagsStore);

  // Return false if flag does not exist or if it's off
  return flags[flagName]?.enabled ?? false;
}
