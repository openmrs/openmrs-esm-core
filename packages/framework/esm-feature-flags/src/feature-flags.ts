/** @module @category Feature Flags */
import { getGlobalStore } from "@openmrs/esm-state";

export interface FeatureFlagsStore {
  flags: { [flagName: string]: FeatureFlag };
}

export interface FeatureFlag {
  enabled: boolean;
  label: string;
  description: string;
}

const initialFeatureFlags = { flags: getFeatureFlagsFromLocalStorage() };

/** @internal */
export const featureFlagsStore = getGlobalStore<FeatureFlagsStore>(
  "feature-flags",
  initialFeatureFlags
);

featureFlagsStore.subscribe((state) => {
  for (const [flagName, flag] of Object.entries(state.flags)) {
    localStorage.setItem(
      `openmrs:feature-flag:${flagName}`,
      flag.enabled.toString()
    );
    localStorage.setItem(
      `openmrs:feature-flag-meta:${flagName}`,
      JSON.stringify({ label: flag.label, description: flag.description })
    );
  }
});

function getFeatureFlagsFromLocalStorage() {
  const flags = {};
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith("openmrs:feature-flag:")) {
      const flagName = key.replace("openmrs:feature-flag:", "");
      const meta = JSON.parse(
        localStorage.getItem(`openmrs:feature-flag-meta:${flagName}`) || "{}"
      );
      flags[flagName] = {
        enabled: localStorage.getItem(key) === "true",
        ...meta,
      };
    }
  }
  return flags;
}

/**
 * This function creates a feature flag. Call it in top-level code anywhere. It will
 * not reset whether the flag is enabled or not, so it's safe to call it multiple times.
 * Once a feature flag is created, it will appear with a toggle in the Implementer Tools.
 * It can then be used to turn on or off features in the code.
 *
 * @param flagName A code-friendly name for the flag, which will be used to reference it in code
 * @param label A human-friendly name which will be displayed in the Implementer Tools
 * @param description An explanation of what the flag does, which will be displayed in the Implementer Tools
 */
export function registerFeatureFlag(
  flagName: string,
  label: string,
  description: string
) {
  featureFlagsStore.setState((state) => ({
    flags: {
      ...state.flags,
      [flagName]: {
        enabled: state.flags[flagName]?.enabled ?? false,
        label,
        description,
      },
    },
  }));
}

/** Use this function to access the current value of the feature flag
 *
 * If you are using React, use `useFeatureFlag` instead.
 */
export function getFeatureFlag(flagName: string) {
  return featureFlagsStore.getState().flags[flagName].enabled;
}

/** Use this function to subscribe to the value of the feature flag
 *
 * If you are using React, use `useFeatureFlag` instead.
 */
export function subscribeToFeatureFlag(
  flagName: string,
  callback: (value: boolean) => void
) {
  featureFlagsStore.subscribe((state) => {
    callback(state.flags[flagName].enabled);
  });
}

/** @internal for Implementer Tools */
export function setFeatureFlag(flagName: string, value: boolean) {
  featureFlagsStore.setState((state) => ({
    flags: {
      ...state.flags,
      [flagName]: { ...state.flags[flagName], enabled: value },
    },
  }));
}
