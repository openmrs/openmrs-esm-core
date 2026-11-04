import { describe, expect, it } from 'vitest';
import { shallowEqual } from './shallowEqual';

describe('shallowEqual', () => {
  describe('primitives and identical references', () => {
    it('returns true for identical primitive values', () => {
      expect(shallowEqual(42, 42)).toBe(true);
      expect(shallowEqual('test', 'test')).toBe(true);
      expect(shallowEqual(true, true)).toBe(true);
      expect(shallowEqual(false, false)).toBe(true);
      expect(shallowEqual(null, null)).toBe(true);
      expect(shallowEqual(undefined, undefined)).toBe(true);
      expect(shallowEqual(NaN, NaN)).toBe(true);
    });

    it('returns false for different primitive values', () => {
      expect(shallowEqual(42, 43)).toBe(false);
      expect(shallowEqual('foo', 'bar')).toBe(false);
      expect(shallowEqual(true, false)).toBe(false);
      expect(shallowEqual(null, undefined)).toBe(false);
      expect(shallowEqual(0, false)).toBe(false);
      expect(shallowEqual('', false)).toBe(false);
    });

    it('returns true for same reference object and array', () => {
      const obj = { a: 1 };
      const arr = [1, 2, 3];
      expect(shallowEqual(obj, obj)).toBe(true);
      expect(shallowEqual(arr, arr)).toBe(true);
    });
  });

  describe('arrays', () => {
    it('returns true for arrays with equal elements', () => {
      expect(shallowEqual([], [])).toBe(true);
      expect(shallowEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(shallowEqual(['a', 'b'], ['a', 'b'])).toBe(true);
    });

    it('returns false when array lengths differ', () => {
      expect(shallowEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(shallowEqual([1, 2, 3], [1, 2])).toBe(false);
    });

    it('returns false when elements differ', () => {
      expect(shallowEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(shallowEqual(['a', 'b'], ['b', 'a'])).toBe(false);
    });

    it('returns false when one argument is an array and the other is not', () => {
      expect(shallowEqual([1, 2], { '0': 1, '1': 2, length: 2 })).toBe(false);
      expect(shallowEqual({ '0': 1, '1': 2, length: 2 }, [1, 2])).toBe(false);
      expect(shallowEqual([1, 2], null)).toBe(false);
      expect(shallowEqual(null, [1, 2])).toBe(false);
      expect(shallowEqual([1, 2], '1,2')).toBe(false);
    });

    it('performs shallow comparison of elements in arrays', () => {
      const ref = { id: 1 };
      expect(shallowEqual([ref], [ref])).toBe(true);
      expect(shallowEqual([{ id: 1 }], [{ id: 1 }])).toBe(false);
    });
  });

  describe('objects', () => {
    it('returns true for empty objects', () => {
      expect(shallowEqual({}, {})).toBe(true);
    });

    it('returns true for objects with same keys and equal values', () => {
      expect(shallowEqual({ a: 1, b: 'two' }, { a: 1, b: 'two' })).toBe(true);
    });

    it('returns false when objects have different numbers of keys', () => {
      expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
      expect(shallowEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    it('returns false when keys differ but count is same', () => {
      expect(shallowEqual({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false);
    });

    it('returns false when values differ', () => {
      expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    });

    it('performs shallow (not deep) comparison of nested objects', () => {
      const nested = { deep: true };
      expect(shallowEqual({ child: nested }, { child: nested })).toBe(true);
      expect(shallowEqual({ child: { deep: true } }, { child: { deep: true } })).toBe(false);
    });

    it('returns false when comparing an object with a non-object or null', () => {
      expect(shallowEqual({ a: 1 }, null)).toBe(false);
      expect(shallowEqual(null, { a: 1 })).toBe(false);
      expect(shallowEqual({ a: 1 }, undefined)).toBe(false);
      expect(shallowEqual({ a: 1 }, 123)).toBe(false);
      expect(shallowEqual({ a: 1 }, 'string')).toBe(false);
    });
  });
});
