/** @module @category Feature Flags */
import { getGlobalStore } from '@openmrs/esm-state';

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
export const featureFlagsStore = getGlobalStore<FeatureFlagsStore>('feature-flags', initialFeatureFlags);

featureFlagsStore.subscribe((state) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  for (const [flagName, flag] of Object.entries(state.flags)) {
    try {
      window.localStorage.setItem(`openmrs:feature-flag:${flagName}`, flag.enabled.toString());
      window.localStorage.setItem(
        `openmrs:feature-flag-meta:${flagName}`,
        JSON.stringify({ label: flag.label, description: flag.description }),
      );
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }
});

function getFeatureFlagsFromLocalStorage() {
  const flags: FeatureFlagsStore['flags'] = {};
  if (typeof window === 'undefined' || !window.localStorage) {
    return flags;
  }
  try {
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith('openmrs:feature-flag:')) {
        const flagName = key.replace('openmrs:feature-flag:', '');
        const meta = JSON.parse(window.localStorage.getItem(`openmrs:feature-flag-meta:${flagName}`) || '{}');
        flags[flagName] = {
          enabled: window.localStorage.getItem(key) === 'true',
          ...meta,
        };
      }
    }
  } catch {
    // Ignore storage errors in restricted contexts
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
export function registerFeatureFlag(flagName: string, label: string, description: string) {
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

/**
 * This function removes feature flags from local storage that no longer exist in the current state.
 */
export function cleanupObsoleteFeatureFlags() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    const flags = featureFlagsStore.getState().flags;
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith('openmrs:feature-flag:'))
      .forEach((key) => {
        const flagName = key.replace('openmrs:feature-flag:', '');
        if (!flags[flagName]) {
          window.localStorage.removeItem(key);
          window.localStorage.removeItem(`openmrs:feature-flag-meta:${flagName}`);
        }
      });
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

/**
 * Use this function to access the current value of the feature flag.
 *
 * If you are using React, use `useFeatureFlag` instead.
 *
 * @param flagName The name of the feature flag to check.
 * @returns `true` if the feature flag is enabled, `false` otherwise.
 */
export function getFeatureFlag(flagName: string) {
  return featureFlagsStore.getState().flags[flagName]?.enabled ?? false;
}

/**
 * Use this function to subscribe to the value of the feature flag.
 * The callback will be invoked immediately with the current value and
 * again whenever the flag value changes.
 *
 * If you are using React, use `useFeatureFlag` instead.
 *
 * @param flagName The name of the feature flag to subscribe to.
 * @param callback A function that will be called with the current flag value.
 * @returns A function to unsubscribe from the feature flag updates.
 */
export function subscribeToFeatureFlag(flagName: string, callback: (value: boolean) => void) {
  let previous = getFeatureFlag(flagName);

  const unsubscribe = featureFlagsStore.subscribe((state) => {
    const current = state.flags[flagName]?.enabled ?? false;
    if (current !== previous) {
      previous = current;
      callback(current);
    }
  });

  callback(previous);

  return unsubscribe;
}

/** @internal for Implementer Tools */
export function setFeatureFlag(flagName: string, value: boolean) {
  featureFlagsStore.setState((state) => ({
    flags: {
      ...state.flags,
      [flagName]: {
        ...(state.flags[flagName] ?? { label: flagName, description: '' }),
        enabled: value,
      },
    },
  }));
}
