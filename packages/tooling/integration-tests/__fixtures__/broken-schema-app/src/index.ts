// A module whose schema has a default JSON cannot represent, so the build fails.
import { defineConfigSchema, Type } from '@openmrs/esm-framework';

export function startupApp() {
  defineConfigSchema('@openmrs/esm-broken-schema-fixture-app', {
    since: { _type: Type.Object, _default: new Date(0) },
  });
}
