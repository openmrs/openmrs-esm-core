// A module whose inline validator reads a constant defined next to it.
//
// Lifting it into `./config-validators` would copy the function without `maximumLength`, which
// compiles and then throws `ReferenceError` the first time an implementer's configuration reaches
// it. The build refuses instead.
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
