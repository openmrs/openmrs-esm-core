// A module that writes its own `config-schema.json` instead of having one read out of its code.
// It also declares a schema at runtime, which must be left alone: nothing was extracted, so nothing
// proves the call redundant.
import { defineConfigSchema, Type } from '@openmrs/esm-framework';

export function startupApp() {
  defineConfigSchema('@openmrs/esm-hand-written-schema-fixture-app', {
    title: { _type: Type.String, _default: 'Hand written' },
  });
}
