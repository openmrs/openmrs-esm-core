// A module that writes its own `config-schema.json` instead of having one read out of its code.
// The artifact is the hand-written file, shipped as-is, and nothing is extracted from here.
//
// It declares a schema at runtime anyway, which is what makes it the case for leaving a module
// alone: nothing was extracted, so nothing can prove this call redundant, and rewriting it would
// leave the module with no schema at all.
import { defineConfigSchema, Type } from '@openmrs/esm-framework';

export function startupApp() {
  defineConfigSchema('@openmrs/esm-hand-written-schema-fixture-app', {
    title: { _type: Type.String, _default: 'Hand written' },
  });
}
