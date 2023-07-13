/** @module @category Feature Flags */
import { useEffect } from "react";
import { useStore } from "./useStore";
import { featureFlagsStore } from "@openmrs/esm-feature-flags";

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

  useEffect(() => {
    if (!flags[flagName]) {
      console.error(
        `useFeatureFlag: Attempted to get value of non-existent flag "${flagName}". Did you forget to call registerFeatureFlag?`
      );
    }
  }, [flags[flagName]]);

  return flags[flagName]?.enabled;
}
