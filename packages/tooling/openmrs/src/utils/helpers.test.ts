import { describe, expect, it } from 'vitest';
import { trimEnd, removeTrailingSlash, contentHash } from './helpers';

describe('trimEnd', () => {
  it('removes a single trailing character', () => {
    expect(trimEnd('hello/', '/')).toBe('hello');
  });

  it('removes multiple consecutive trailing characters', () => {
    expect(trimEnd('hello///', '/')).toBe('hello');
  });

  it('returns the string unchanged when the character is not at the end', () => {
    expect(trimEnd('hello', '/')).toBe('hello');
  });

  it('handles empty string input', () => {
    expect(trimEnd('', '/')).toBe('');
  });

  it('handles multi-character chr argument', () => {
    expect(trimEnd('foobarbar', 'bar')).toBe('foo');
  });

  it('does not remove the character from the middle', () => {
    expect(trimEnd('he/llo/', '/')).toBe('he/llo');
  });
});

describe('removeTrailingSlash', () => {
  it('removes a single trailing slash', () => {
    expect(removeTrailingSlash('/openmrs/spa/')).toBe('/openmrs/spa');
  });

  it('removes multiple trailing slashes', () => {
    expect(removeTrailingSlash('/openmrs/spa///')).toBe('/openmrs/spa');
  });

  it('returns the string unchanged when no trailing slash', () => {
    expect(removeTrailingSlash('/openmrs/spa')).toBe('/openmrs/spa');
  });

  it('handles root slash', () => {
    expect(removeTrailingSlash('/')).toBe('');
  });

  it('handles empty string', () => {
    expect(removeTrailingSlash('')).toBe('');
  });
});

describe('contentHash', () => {
  it('produces an xxhash64 hex digest of the JSON-serialized input', () => {
    // Pin the expected hash to detect algorithm changes during refactoring.
    // This value was computed using webpack's util.createHash('xxhash64') with
    // the input JSON.stringify({ foo: 'bar' }) encoded as UTF-8.
    expect(contentHash({ foo: 'bar' })).toBe('e929f5f04818d7ec');
  });

  it('returns deterministic output for the same input', () => {
    const hash1 = contentHash({ foo: 'bar' });
    const hash2 = contentHash({ foo: 'bar' });
    expect(hash1).toBe(hash2);
  });

  it('returns different hashes for different objects', () => {
    const hash1 = contentHash({ foo: 'bar' });
    const hash2 = contentHash({ foo: 'baz' });
    expect(hash1).not.toBe(hash2);
  });

  it('handles nested objects consistently', () => {
    const obj = { a: { b: { c: 'deep' } } };
    const hash1 = contentHash(obj);
    const hash2 = contentHash({ a: { b: { c: 'deep' } } });
    expect(hash1).toBe(hash2);
  });
});
