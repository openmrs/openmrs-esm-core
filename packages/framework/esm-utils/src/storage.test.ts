import { describe, expect, it, vi } from 'vitest';
import { canAccessStorage } from './storage';

describe('canAccessStorage', () => {
  it('returns true when storage getItem does not throw', () => {
    const mockStorage = {
      getItem: vi.fn().mockReturnValue(null),
    } as unknown as Storage;

    expect(canAccessStorage(mockStorage)).toBe(true);
    expect(mockStorage.getItem).toHaveBeenCalledWith('test');
  });

  it('returns false when storage getItem throws a SecurityError or DOMException', () => {
    const mockStorage = {
      getItem: vi.fn().mockImplementation(() => {
        throw new Error('SecurityError: access denied');
      }),
    } as unknown as Storage;

    expect(canAccessStorage(mockStorage)).toBe(false);
  });

  it('works with default localStorage if accessible', () => {
    // In JSDOM / Vitest environment, window.localStorage is present
    expect(typeof canAccessStorage()).toBe('boolean');
  });
});
