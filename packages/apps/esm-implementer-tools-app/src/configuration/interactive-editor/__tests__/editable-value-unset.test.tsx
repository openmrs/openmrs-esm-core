import { describe, it, expect } from '@jest/globals';
import { cloneDeep, unset } from 'lodash-es';

describe('lodash.unset immutable pattern', () => {
  it('should properly use unset with immutable state updates', () => {
    const initialState = {
      config: {
        '@openmrs/mario': {
          hasHat: true,
          numberFingers: 8,
        },
      },
    };

    // Clone first, mutate the clone, then use the clone
    const state = cloneDeep(initialState);
    const result = unset(state, ['config', '@openmrs/mario', 'hasHat']);

    // unset returns true if the property existed
    expect(result).toBe(true);

    // The cloned state should be mutated
    expect(state.config['@openmrs/mario'].hasHat).toBeUndefined();

    // The original state should be unchanged
    expect(initialState.config['@openmrs/mario'].hasHat).toBe(true);

    // The mutated state should still have other properties
    expect(state.config['@openmrs/mario'].numberFingers).toBe(8);
  });

  it('should return false when unsetting non-existent property', () => {
    const initialState = {
      config: {
        '@openmrs/mario': {
          hasHat: true,
        },
      },
    };

    const state = cloneDeep(initialState);
    const result = unset(state, ['config', '@openmrs/mario', 'nonExistent']);

    // unset returns false if the property did not exist
    expect(result).toBe(false);
  });

  it('should handle nested property removal correctly', () => {
    const initialState = {
      config: {
        '@openmrs/mario': {
          weapons: {
            gloves: 2,
            parasol: 1,
          },
        },
      },
    };

    const state = cloneDeep(initialState);
    unset(state, ['config', '@openmrs/mario', 'weapons', 'gloves']);

    expect(state.config['@openmrs/mario'].weapons.gloves).toBeUndefined();
    expect(state.config['@openmrs/mario'].weapons.parasol).toBe(1);
  });
});
