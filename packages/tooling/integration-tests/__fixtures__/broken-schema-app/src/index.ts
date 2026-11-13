// A module whose configuration cannot be read: the schema declares a default that JSON has no way
// to write down. Silently shipping an artifact that disagrees with the module would be worse than
// failing, so the build fails.
import { defineConfigSchema, Type } from '@openmrs/esm-framework';

export function startupApp() {
  defineConfigSchema('@openmrs/esm-broken-schema-fixture-app', {
    since: { _type: Type.Object, _default: new Date(0) },
  });
}
