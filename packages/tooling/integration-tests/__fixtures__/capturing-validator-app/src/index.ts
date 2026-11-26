// A module whose inline validator reads a constant defined next to it.
// Lifted without `maximumLength` it would throw `ReferenceError` at runtime, so the build refuses.
import { defineConfigSchema, validator, Type } from '@openmrs/esm-framework';

const maximumLength = 40;

export function startupApp() {
  defineConfigSchema('@openmrs/esm-capturing-validator-fixture-app', {
    title: {
      _type: Type.String,
      _default: 'Title',
      _validators: [validator((value: string) => value.length <= maximumLength, 'too long')],
    },
  });
}
