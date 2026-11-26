import { describe, expect, it } from 'vitest';
import * as publicApi from './public';

// `public.ts` re-exports whole modules, so anything added to one of them becomes public framework API
// by accident. This keeps internals out.
describe('the public configuration API', () => {
  it('does not expose the validator descriptor machinery', () => {
    // Build tooling uses `@openmrs/esm-config/schema` instead. Exposing `describeValidator` would let
    // any caller forge a built-in descriptor.
    for (const name of ['describeValidator', 'getValidatorDescriptor', 'validatorDescriptor']) {
      expect(publicApi, `${name} should not be public API`).not.toHaveProperty(name);
    }
  });

  it('exposes the validator vocabulary a module writes schemas with', () => {
    expect(publicApi).toHaveProperty('validators');
    expect(publicApi).toHaveProperty('validator');
    expect(publicApi).toHaveProperty('Type');
  });
});
