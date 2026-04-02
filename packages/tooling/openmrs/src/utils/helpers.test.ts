import { describe, expect, it } from 'vitest';
import { trimEnd, removeTrailingSlash } from './helpers';

describe('trimEnd', () => {
  it('should remove a single trailing character', () => {
    expect(trimEnd('hello/', '/')).toBe('hello');
  });

  it('should remove multiple trailing occurrences', () => {
    expect(trimEnd('hello///', '/')).toBe('hello');
  });

  it('should remove a multi-character suffix', () => {
    expect(trimEnd('helloabcabc', 'abc')).toBe('hello');
  });

  it('should return the string unchanged when it does not end with the character', () => {
    expect(trimEnd('hello', '/')).toBe('hello');
  });

  it('should return an empty string when the entire string is trimmed', () => {
    expect(trimEnd('///', '/')).toBe('');
  });
});

describe('removeTrailingSlash', () => {
  it('should remove a single trailing slash', () => {
    expect(removeTrailingSlash('/hello/')).toBe('/hello');
  });

  it('should remove multiple trailing slashes', () => {
    expect(removeTrailingSlash('/hello///')).toBe('/hello');
  });

  it('should return the string unchanged when there is no trailing slash', () => {
    expect(removeTrailingSlash('/hello')).toBe('/hello');
  });

  it('should handle an empty string', () => {
    expect(removeTrailingSlash('')).toBe('');
  });
});
