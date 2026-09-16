import { describe, it, expect, vi } from 'vitest';
import { compile, evaluate, evaluateAsBoolean, evaluateAsNumber, evaluateAsType, evaluateAsync } from './evaluator';

describe('OpenMRS Expression Evaluator', () => {
  it('should evaluate a simple expression', () => {
    expect(evaluate('1 + 1')).toBe(2);
  });

  it('should support multiplication', () => {
    expect(evaluate('1 * 2')).toBe(2);
  });

  it('should support the not operator', () => {
    expect(evaluate('!1')).toBe(false);
    expect(evaluate('!0')).toBe(true);
    expect(evaluate('!true')).toBe(false);
    expect(evaluate('!false')).toBe(true);
  });

  it('should support expressions in parentheses', () => {
    expect(evaluate('(1, 2, 3)')).toBe(3);
  });

  it('should support order of operations', () => {
    expect(evaluate('(1 + 2) * 3')).toBe(9);
    expect(evaluate('1 + 2 * 3')).toBe(7);
  });

  it("Should support javascript's type promotion", () => {
    expect(evaluate("1 + 'string'")).toBe('1string');
  });

  it("Should support 'in'", () => {
    expect(evaluate('1 in [1, 2, 3]')).toBe(true);
  });

  it('should support basic variables', () => {
    expect(evaluate('1 + a', { a: 3 })).toBe(4);
  });

  it('should support nullish coalescing', () => {
    expect(evaluate('a ?? b', { a: null, b: 3 })).toBe(3);
    expect(evaluate('a ?? b', { a: 3, b: null })).toBe(3);
  });

  it('should support functions', () => {
    expect(evaluate('a(1)', { a: (i: number) => i + 1 })).toBe(2);
  });

  it('should support built-in functions', () => {
    expect(evaluate('a.includes("v")', { a: 'value' })).toBe(true);
    expect(evaluate('"value".includes("v")')).toBe(true);
    expect(evaluate('(3.14159).toPrecision(3)')).toBe('3.14');
  });

  it('should give a useful error message for properties on missing objects', () => {
    expect(() => evaluate('a.b')).toThrow('ReferenceError: a is not defined');
    expect(() => evaluate('a["b"]')).toThrow('ReferenceError: a is not defined');
    expect(() => evaluate('a.b.c', { a: {} })).toThrow("TypeError: cannot read properties of undefined (reading 'c')");
    expect(() => evaluate('a.b["c"]', { a: {} })).toThrow(
      "TypeError: cannot read properties of undefined (reading 'c')",
    );
    expect(() => evaluate('a["b"]["c"]', { a: {} })).toThrow(
      "TypeError: cannot read properties of undefined (reading 'c')",
    );
  });

  it('should not support this', () => {
    expect(() => evaluate('this')).toThrow(
      /Expression evaluator does not support expression of type 'ThisExpression'.*/i,
    );
  });

  it('should support property references', () => {
    expect(evaluate('a.b.c', { a: { b: { c: 3 } } })).toBe(3);
  });

  it('should not support prototype references', () => {
    expect(() => evaluate('a.__proto__', { a: {} })).toThrow(/Cannot access the __proto__ property .*/i);
    expect(() => evaluate('a["__proto__"]', { a: {} })).toThrow(/Cannot access the __proto__ property .*/i);
    expect(() => evaluate('a[b]', { a: {}, b: '__proto__' })).toThrow(/Cannot access the __proto__ property .*/i);
    expect(() => evaluate('a[b()]', { a: {}, b: () => '__proto__' })).toThrow(
      /Cannot access the __proto__ property .*/i,
    );
    expect(() => evaluate('__proto__')).toThrow(/Cannot access the __proto__ property .*/i);
    expect(() => evaluate('a.prototype', { a: {} })).toThrow(/Cannot access the prototype property .*/i);
    expect(() => evaluate('a["prototype"]', { a: {} })).toThrow(/Cannot access the prototype property .*/i);
    expect(() => evaluate('a[b]', { a: {}, b: 'prototype' })).toThrow(/Cannot access the prototype property .*/i);
  });

  it('should not support constructor references', () => {
    expect(() => evaluate('a.constructor', { a: {} })).toThrow(/Cannot access the constructor property .*/i);
    expect(() => evaluate('a["constructor"]', { a: {} })).toThrow(/Cannot access the constructor property .*/i);
    expect(() => evaluate("a['const' + 'ructor']", { a: {} })).toThrow(/Cannot access the constructor property .*/i);
    expect(() => evaluate('a[b]', { a: {}, b: 'constructor' })).toThrow(/Cannot access the constructor property .*/i);
    expect(() => evaluate('String.constructor')).toThrow(/Cannot access the constructor property .*/i);
  });

  // A computed property is coerced by ToPropertyKey, so a non-string key whose string conversion is
  // `constructor` used to read `constructor` while comparing equal to nothing the guard knew about.
  it('should not allow a non-string computed property to name a property', () => {
    expect(() => evaluate("String[['const' + 'ructor']]('return 1')()")).toThrow(
      /Cannot use a value of type object as a property name/i,
    );
    expect(() => evaluate("(() => 1)[['const' + 'ructor']]('return 1')()")).toThrow(
      /Cannot use a value of type object as a property name/i,
    );
    expect(() => evaluate("String['con'.concat('structor').split('|')]")).toThrow(
      /Cannot use a value of type object as a property name/i,
    );
    expect(() => evaluate("String[Array.of('const' + 'ructor')]")).toThrow(
      /Cannot use a value of type object as a property name/i,
    );
    expect(() => evaluate("a[[['__pro' + 'to__']]]", { a: {} })).toThrow(
      /Cannot use a value of type object as a property name/i,
    );
    expect(() => evaluate('a[b]', { a: {}, b: true })).toThrow(
      /Cannot use a value of type boolean as a property name/i,
    );
    expect(() => evaluate('a[b]', { a: {}, b: null })).toThrow(/Cannot use a value of type null as a property name/i);
  });

  // `Object.prototype` and `Function.prototype` hold every generic route back to the host realm, so no
  // property that resolves on either of them should be readable, however the key is spelled.
  it('should not expose Object.prototype or Function.prototype members', () => {
    const fn = () => 1;
    expect(() => evaluate("f['ca' + 'll']", { f: fn })).toThrow(/Cannot access the call property .*/i);
    expect(() => evaluate('f.apply', { f: fn })).toThrow(/Cannot access the apply property .*/i);
    expect(() => evaluate('f.bind', { f: fn })).toThrow(/Cannot access the bind property .*/i);
    expect(() => evaluate("a['__define' + 'Getter__']", { a: {} })).toThrow(
      /Cannot access the __defineGetter__ property .*/i,
    );
    expect(() => evaluate("a['__lookup' + 'Getter__']", { a: {} })).toThrow(
      /Cannot access the __lookupGetter__ property .*/i,
    );
    expect(() => evaluate('a.isPrototypeOf', { a: {} })).toThrow(/Cannot access the isPrototypeOf property .*/i);
    // identifiers must not reach them through the variables or globals maps either
    expect(evaluate('toString')).toBeUndefined();
    expect(evaluate('hasOwnProperty')).toBeUndefined();
  });

  it('should still allow harmless base properties and builtins on their own prototypes', () => {
    expect(evaluate('a.toString()', { a: {} })).toBe('[object Object]');
    expect(evaluate('a.valueOf()', { a: 1 })).toBe(1);
    expect(evaluate('"abc".toUpperCase()')).toBe('ABC');
    expect(evaluate('a.length', { a: [1, 2, 3] })).toBe(3);
    expect(evaluate('f.name', { f: function named() {} })).toBe('named');
  });

  // `evaluateAsync()` shares the visitor, so every guard has to hold there too
  it('should apply the same guards asynchronously', async () => {
    await expect(evaluateAsync("String[['const' + 'ructor']]('return 1')()")).rejects.toThrow(
      /Cannot use a value of type object as a property name/i,
    );
    await expect(evaluateAsync('a.constructor', { a: {} })).rejects.toThrow(
      /Cannot access the constructor property .*/i,
    );
    await expect(evaluateAsync('a.__proto__', { a: {} })).rejects.toThrow(/Cannot access the __proto__ property .*/i);
    await expect(evaluateAsync("f['ca' + 'll']", { f: () => 1 })).rejects.toThrow(
      /Cannot access the call property .*/i,
    );
  });

  it('should support computed property access', () => {
    expect(evaluate('arr[i]', { arr: [10, 20, 30], i: 1 })).toBe(20);
    expect(evaluate('o[k]', { o: { x: 5 }, k: 'x' })).toBe(5);
    expect(evaluate('o[k.n]', { o: { x: 5 }, k: { n: 'x' } })).toBe(5);
    expect(evaluate('o[k()]', { o: { x: 5 }, k: () => 'x' })).toBe(5);
  });

  it('should not resolve a missing property to a same-named variable', () => {
    expect(evaluate('a.b', { a: {}, b: 5 })).toBeUndefined();
  });

  it('should reject member access on null', () => {
    expect(() => evaluate('a.b', { a: null })).toThrow("TypeError: cannot read properties of null (reading 'b')");
    expect(() => evaluate('a.b.c', { a: { b: null } })).toThrow(
      "TypeError: cannot read properties of null (reading 'c')",
    );
  });

  it('should short-circuit logical operators', () => {
    const right = vi.fn(() => true);

    expect(evaluate('a && right()', { a: false, right })).toBe(false);
    expect(evaluate('a || right()', { a: true, right })).toBe(true);
    expect(evaluate('a ?? right()', { a: 'set', right })).toBe('set');
    expect(right).not.toHaveBeenCalled();

    expect(evaluate('a && right()', { a: true, right })).toBe(true);
    expect(right).toHaveBeenCalledTimes(1);

    // the reason it matters: guarding a member access against a nullish value
    expect(evaluate('a && a.b', { a: null })).toBeNull();
    expect(evaluate('a ? a.b : false', { a: null })).toBe(false);
  });

  it('should support optional chaining', () => {
    expect(evaluate('a?.b', { a: null })).toBeUndefined();
    expect(evaluate('a?.b', { a: undefined })).toBeUndefined();
    expect(evaluate('a?.b', { a: { b: 'value' } })).toBe('value');
    expect(evaluate('a?.[k]', { a: null, k: 'b' })).toBeUndefined();

    // a short circuit abandons the rest of the chain, not just the one access
    expect(evaluate('a?.b.c.d', { a: null })).toBeUndefined();
    expect(evaluate('a?.b()', { a: null })).toBeUndefined();
    expect(evaluate('a?.b.c()', { a: null })).toBeUndefined();

    // but a genuinely missing property is still an error
    expect(() => evaluate('a?.b.c', { a: {} })).toThrow("TypeError: cannot read properties of undefined (reading 'c')");
  });

  it('should support optional calls', () => {
    const arg = vi.fn(() => 1);

    expect(evaluate('cb?.(arg())', { cb: null, arg })).toBeUndefined();
    expect(evaluate('o.cb?.(arg())', { o: {}, arg })).toBeUndefined();
    expect(evaluate('cb?.(arg()).b.c', { cb: undefined, arg })).toBeUndefined();

    // a call that does not happen must not evaluate its arguments
    expect(arg).not.toHaveBeenCalled();

    expect(evaluate('cb?.(arg())', { cb: (n: number) => n + 1, arg })).toBe(2);
    expect(arg).toHaveBeenCalledTimes(1);

    // `?.()` only guards against a nullish callee; a non-callable value is still an error
    expect(() => evaluate('cb?.()', { cb: { notCallable: true } })).toThrow('cb is not a function');
  });

  it('should allow values that share a name with a forbidden property', () => {
    expect(evaluate('a', { a: 'constructor' })).toBe('constructor');
    expect(evaluate("a === 'const' + 'ructor'", { a: 'constructor' })).toBe(true);
  });

  it('should support ternaries', () => {
    expect(evaluate('a ? 1 : 2', { a: true })).toBe(1);
    expect(evaluate('a ? 1 : 2', { a: false })).toBe(2);
  });

  it('should support hexadecimal', () => {
    expect(evaluate('0xff')).toBe(255);
  });

  it('should support string templates', () => {
    expect(evaluate('`${a.b}`', { a: { b: 'string' } })).toBe('string');
  });

  it('should support new Date()', () => {
    expect(evaluate('new Date().getTime()')).toBeLessThanOrEqual(new Date().getTime());
  });

  it('should support RegExp', () => {
    expect(evaluate('/.*/.test(a)', { a: 'a' })).toBe(true);
  });

  it('should support RegExp objects', () => {
    expect(evaluate('new RegExp(".*").test(a)', { a: 'a' })).toBe(true);
  });

  it('should support arrow functions inside expressions', () => {
    expect(evaluate('[1, 2, 3].find(v => v === 3)')).toBe(3);
  });

  it('should support globals', () => {
    expect(evaluate('NaN')).toBeNaN();
    expect(evaluate('Infinity')).toBe(Infinity);
    expect(evaluate('Boolean(true)')).toBe(true);
    expect(evaluate('Math.min(1, 2, 3)')).toBe(1);
    expect(evaluate('undefined')).toBeUndefined();
    expect(evaluate('isNaN(NaN)')).toBe(true);
    expect(evaluate('Number.isInteger(42)')).toBe(true);
  });

  it('should not support creating arbitrary objects', () => {
    expect(() => evaluate('new object()')).toThrow(/Cannot instantiate object .*/i);
    class Fn {
      constructor() {}
    }
    expect(() => evaluate('new Fn()', { Fn })).toThrow(/Cannot instantiate object .*/i);
  });

  it('should not support invalid property references on supported objects', () => {
    expect(() => evaluate('new Date().__proto__')).toThrow(/Cannot access the __proto__ property .*/i);
    expect(() => evaluate('new Date().prototype')).toThrow(/Cannot access the prototype property .*/i);
  });

  it('should not return invalid types', () => {
    expect(() => evaluate('a', { a: {} })).toThrow(/.* did not produce a valid result/i);
    expect(() => evaluateAsBoolean('a', { a: 'value' })).toThrow(/.* did not produce a valid result/i);
    expect(() => evaluateAsNumber('a', { a: true })).toThrow(/.* did not produce a valid result/i);
    expect(() => evaluateAsType('a', { a: false }, (val): val is 'value' => val === 'value')).toThrow(
      /.* did not produce a valid result/i,
    );
  });

  it('should support a compilation phase', () => {
    const exp = compile('1 + 1');
    expect(evaluate(exp)).toBe(2);
  });

  it('should not support variable assignment', () => {
    expect(() => evaluate('var a = 1; a')).toThrow();
  });

  it('should support asynchronous evaluation', async () => {
    await expect(evaluateAsync('1 + 1')).resolves.toBe(2);
    let a = new Promise((resolve) => {
      setTimeout(() => resolve(1), 10);
    });
    await expect(evaluateAsync('Promise.resolve(a).then((a) => a + 1)', { a })).resolves.toBe(2);
    a = new Promise((resolve) => {
      setTimeout(() => resolve(1), 10);
    });
    await expect(
      evaluateAsync('resolve(a).then((a) => a + 1)', { a, resolve: Promise.resolve.bind(Promise) }),
    ).resolves.toBe(2);
  });

  it('should support mock functions', () => {
    expect(evaluate('api.getValue()', { api: { getValue: vi.fn().mockImplementation(() => 'value') } })).toBe('value');
  });

  it('should support real-world use-cases', () => {
    expect(
      evaluate('!isEmpty(array)', {
        array: [],
        isEmpty(arr: unknown) {
          return Array.isArray(arr) && arr.length === 0;
        },
      }),
    ).toBe(false);

    expect(
      evaluate(
        "includes(referredToPreventionServices, '88cdde2b-753b-48ac-a51a-ae5e1ab24846') && !includes(referredToPreventionServices, '1691AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')",
        {
          referredToPreventionServices: ['88cdde2b-753b-48ac-a51a-ae5e1ab24846'],
          includes: <T>(collection: Array<T>, value: T) => Array.prototype.includes.call(collection, value),
        },
      ),
    ).toBe(true);
  });

  it('should throw an error with correct message for non-existent function', () => {
    expect(() => {
      evaluate('api.nonExistingFunction()', { api: {} });
    }).toThrow('No function named nonExistingFunction is defined in this context');

    // nested ref
    expect(() => {
      evaluate('objectWrapper.path.deepNested()', {
        objectWrapper: {
          path: {
            deepNested: undefined,
          },
        },
      });
    }).toThrow('No function named deepNested is defined in this context');
  });

  it('should throw an error with correct message for non-callable targets', () => {
    expect(() => {
      evaluate('objectWrapper.path()', {
        objectWrapper: {
          path: {},
        },
      });
    }).toThrow('path is not a function');
  });
});
