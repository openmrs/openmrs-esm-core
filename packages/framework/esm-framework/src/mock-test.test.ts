/**
 * A test that validates that `@openmrs/esm-framework/mock` has
 * the same API as `@openmrs/esm-framework`.
 *
 * Disabled because the mock is nowhere close to having the same
 * API. You can change `xit` to `it` to run the test and see a
 * comparison of the exports of the two modules.
 */
import { describe, expect, it } from 'vitest';
import * as real from './index';
import * as mock from '../mock';

describe('@openmrs/esm-framework/mock', () => {
  it.skip('should have the same exports as @openmrs/esm-framework', () => {
    expect(new Set(Object.keys(real))).toEqual(new Set(Object.keys(mock)));
  });

  it('should have a working goBackInHistory function', () => {
    mock.navigate({ to: '/test' });
    const history = mock.getHistory();
    mock.goBackInHistory({ toUrl: history[0] });
    expect(mock.getHistory()).toEqual([history[0]]);
    expect(mock.navigate).toHaveBeenCalled();
  });
});
