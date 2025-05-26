import { describe, expect, it } from 'vitest';
import { isString, isBoolean, isUuid, isObject, isNumber, isArray } from './type-validators';

describe('all validators', () => {
  it('fail on undefined', () => {
    expect(isString(undefined)).toMatch(/.*/);
    expect(isBoolean(undefined)).toMatch(/.*/);
    expect(isUuid(undefined)).toMatch(/.*/);
    expect(isObject(undefined)).toMatch(/.*/);
    expect(isNumber(undefined)).toMatch(/.*/);
  });
});

describe('isString', () => {
  it('accepts strings', () => {
    expect(isString('')).toBeUndefined();
  });

  it('rejects non-strings', () => {
    expect(isString([''])).toMatch('must be a string');
  });
});

describe('isNumber', () => {
  it('accepts numbers', () => {
    expect(isNumber(10)).toBeUndefined();
  });

  it('rejects non-numbers', () => {
    expect(isNumber('Not a Number')).toMatch('must be a number');
  });

  it('accepts zero and negative numbers', () => {
    expect(isNumber(0)).toBeUndefined();
    expect(isNumber(-1)).toBeUndefined();
  });

  it('accepts floating point numbers', () => {
    expect(isNumber(3.14)).toBeUndefined();
  });
});

describe('isBoolean', () => {
  it('accepts bools', () => {
    expect(isBoolean(false)).toBeUndefined();
  });

  it('rejects non-bools', () => {
    expect(isBoolean(1)).toMatch('must be a bool');
  });
});

describe('isUuid', () => {
  it('accepts a CIEL External ID', () => {
    expect(isUuid('123118AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')).toBeUndefined();
  });

  it('accepts a valid UUID with dashes', () => {
    expect(isUuid('28c37ff6-0079-4fa7-b803-5d547ac454e0')).toBeUndefined();
  });

  it('rejects a bad UUID', () => {
    expect(isUuid('28c37ff6-0079-4fa7-b803-5d547ac454e')).toMatch('must be a valid UUID');
  });

  it('rejects a bad CIEL External ID', () => {
    expect(isUuid('123118AAAAAAAAAAAAAAAAAAAAAAAAAAAAA')).toMatch('must be a valid UUID');
  });

  it('rejects UUIDs with wrong segment lengths', () => {
    expect(isUuid('28c37ff6-0079-4fa7-b803-5d547ac454e0a')).toMatch('must be a valid UUID');
    expect(isUuid('28c37ff6-0079-4fa7-b803-5d547ac454')).toMatch('must be a valid UUID');
  });
});

describe('isObject', () => {
  it('accepts plain objects', () => {
    expect(isObject({})).toBeUndefined();
    expect(isObject({ foo: 0 })).toBeUndefined();
  });

  it('rejects arrays', () => {
    expect(isObject([])).toMatch(/must be an object/i);
  });

  it('rejects null', () => {
    expect(isObject(null)).toMatch(/must be an object/i);
  });

  it('rejects primitive types', () => {
    expect(isObject(42)).toMatch(/must be an object/i);
    expect(isObject('string')).toMatch(/must be an object/i);
    expect(isObject(true)).toMatch(/must be an object/i);
  });

  it('rejects functions', () => {
    expect(isObject(() => {})).toMatch(/must be an object/i);
  });
});

describe('isArray', () => {
  it('accepts arrays', () => {
    expect(isArray([])).toBeUndefined();
    expect(isArray([1, 2, 3])).toBeUndefined();
  });

  it('rejects non-arrays', () => {
    expect(isArray({})).toMatch('must be an array');
    expect(isArray('not an array')).toMatch('must be an array');
  });
});
