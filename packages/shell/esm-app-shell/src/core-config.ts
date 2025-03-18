import { defineConfigSchema, Type, getConfigStore } from '@openmrs/esm-framework';
import { registerModuleLoad, featureFlagsStore } from '@openmrs/esm-framework/src/internal';
import { appName } from './ui';

/**
 * Sets up the app shell's configuration.
 */
export function setupCoreConfig() {
  defineConfigSchema(appName, {
    'Enabled feature flags': {
      _description: 'The feature flags that will be enabled',
      _type: Type.Array,
      _default: [],
      _elements: {
        _type: Type.String,
      },
    },
  });
  registerModuleLoad(appName);

  // process feature flags
  getConfigStore(appName).subscribe(({ config }) => {
    const flagsToEnable = new Set((config?.['Enabled feature flags'] as Array<string>) || []);
    if (flagsToEnable.size) {
      const newFlags = { ...featureFlagsStore.getState().flags };
      for (const flag of flagsToEnable) {
        // validate the flag exists
        if (!newFlags[flag]) {
          console.error(`Feature flag "${flag}" does not exist. Please define the flag first.`);
        } else {
          newFlags[flag] = { ...newFlags[flag], enabled: true };
        }
      }

      featureFlagsStore.setState({ flags: newFlags });
    }
  });
}
