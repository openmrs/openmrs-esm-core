import { describe, it, expect } from '@jest/globals';

describe('config-subtree type guards', () => {
  it('should handle null value without throwing TypeError', () => {
    const value = null;
    const isLeaf = value && typeof value === 'object' && Object.hasOwn(value, '_value');
    expect(isLeaf).toBe(false);
  });

  it('should handle undefined value without throwing TypeError', () => {
    const value = undefined;
    const isLeaf = value && typeof value === 'object' && Object.hasOwn(value, '_value');
    expect(isLeaf).toBe(false);
  });

  it('should return true for object with _value property', () => {
    const value = { _value: 'test', _source: 'test' };
    const isLeaf = value && typeof value === 'object' && Object.hasOwn(value, '_value');
    expect(isLeaf).toBe(true);
  });

  it('should return false for object without _value property', () => {
    const value = { nested: { _value: 'test' } };
    const isLeaf = value && typeof value === 'object' && Object.hasOwn(value, '_value');
    expect(isLeaf).toBe(false);
  });

  it('should return false for primitive values', () => {
    const stringValue = 'test';
    const numberValue = 123;
    const boolValue = true;

    const isLeafString = stringValue && typeof stringValue === 'object' && Object.hasOwn(stringValue as any, '_value');
    const isLeafNumber = numberValue && typeof numberValue === 'object' && Object.hasOwn(numberValue as any, '_value');
    const isLeafBool = boolValue && typeof boolValue === 'object' && Object.hasOwn(boolValue as any, '_value');

    expect(isLeafString).toBe(false);
    expect(isLeafNumber).toBe(false);
    expect(isLeafBool).toBe(false);
  });
});
