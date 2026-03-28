import { describe, it, expect } from 'vitest';

import { getErrorMessage } from './login.component';

describe('getErrorMessage', () => {
  it('returns the error message when it is non-empty', () => {
    expect(getErrorMessage(new Error('Server error'))).toBe('Server error');
  });

  it('returns fallback for empty string error message', () => {
    expect(getErrorMessage(new Error(' '))).toBe('Invalid username or password');
  });

  it('returns fallback for whitespace-only error message', () => {
    expect(getErrorMessage(new Error('   '))).toBe('Invalid username or password');
  });

  it('returns fallback for non-error object', () => {
    expect(getErrorMessage({})).toBe('Invalid username or password');
  });
});
