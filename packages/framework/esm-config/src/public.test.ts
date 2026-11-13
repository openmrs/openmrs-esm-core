import { describe, expect, it } from 'vitest';
import * as publicApi from './public';

// `public.ts` re-exports whole modules, so anything added to one of them joins the framework's
// public surface by accident rather than by decision. The framework is a shared singleton being
// actively slimmed down, which makes that worth a test rather than a convention.
describe('the public configuration API', () => {
  it('does not expose the validator descriptor machinery', () => {
    // Build tooling reaches these through `@openmrs/esm-config/schema` or the global symbol
    // registry. `describeValidator` in particular would let any caller forge a built-in descriptor
    // onto an arbitrary function.
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
