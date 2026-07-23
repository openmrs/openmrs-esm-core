import { describe, it, expect } from '@jest/globals';

describe('Auth redirect handling', () => {
  it('should detect 401 with Location header', () => {
    const response = {
      status: 401,
      headers: {
        get: (key: string) => (key === 'Location' ? '/login/totp' : null),
      },
    };

    const isAuthChallenge = response.status === 401 && response.headers.get('Location') !== null;

    expect(isAuthChallenge).toBe(true);
  });

  it('should not treat 401 without Location as challenge', () => {
    const response = {
      status: 401,
      headers: {
        get: () => null,
      },
    };

    const isAuthChallenge = response.status === 401 && response.headers.get('Location') !== null;

    expect(isAuthChallenge).toBe(false);
  });
});
