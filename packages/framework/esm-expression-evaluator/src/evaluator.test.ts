import { compile, evaluate, evaluateAsBoolean, evaluateAsNumber, evaluateAsType, evaluateAsync } from './evaluator';

describe('OpenMRS Expression Evaluator', () => {
  it('Should evaluate a simple expression', () => {
    expect(evaluate('1 + 1')).toBe(2);
  });

  it('Should support mulitplication', () => {
    expect(evaluate('1 * 2')).toBe(2);
  });

  it('Should support the not operator', () => {
    expect(evaluate('!1')).toBe(false);
    expect(evaluate('!0')).toBe(true);
    expect(evaluate('!true')).toBe(false);
    expect(evaluate('!false')).toBe(true);
  });

  it('Should support expressions in parentheses', () => {
    expect(evaluate('(1, 2, 3)')).toBe(3);
  });

  it('Should support order of operations', () => {
    expect(evaluate('(1 + 2) * 3')).toBe(9);
    expect(evaluate('1 + 2 * 3')).toBe(7);
  });

  it("Should support javascript's type promotion", () => {
    expect(evaluate("1 + 'string'")).toBe('1string');
  });

  it("Should support 'in'", () => {
    expect(evaluate('1 in [1, 2, 3]')).toBe(true);
  });

  it('Should support basic variables', () => {
    expect(evaluate('1 + a', { a: 3 })).toBe(4);
  });

  it('Should support nullish coalescing', () => {
    expect(evaluate('a ?? b', { a: null, b: 3 })).toBe(3);
    expect(evaluate('a ?? b', { a: 3, b: null })).toBe(3);
  });

  it('Should support functions', () => {
    expect(evaluate('a(1)', { a: (i: number) => i + 1 })).toBe(2);
  });

  it('Should support built-in functions', () => {
    expect(evaluate('a.includes("v")', { a: 'value' })).toBe(true);
    expect(evaluate('"value".includes("v")')).toBe(true);
    expect(evaluate('(3.14159).toPrecision(3)')).toBe('3.14');
  });

  it('Should give a useful error message for properties on missing objects', () => {
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

  it('Should not support this', () => {
    expect(() => evaluate('this')).toThrow(
      /Expression evaluator does not support expression of type 'ThisExpression'.*/i,
    );
  });

  it('Should support property references', () => {
    expect(evaluate('a.b.c', { a: { b: { c: 3 } } })).toBe(3);
  });

  it('Should not support prototype references', () => {
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

  it('Should support ternaries', () => {
    expect(evaluate('a ? 1 : 2', { a: true })).toBe(1);
    expect(evaluate('a ? 1 : 2', { a: false })).toBe(2);
  });

  it('Should support hexdecimal', () => {
    expect(evaluate('0xff')).toBe(255);
  });

  it('Should support string templates', () => {
    expect(evaluate('`${a.b}`', { a: { b: 'string' } })).toBe('string');
  });

  it('Should support new Date()', () => {
    expect(evaluate('new Date().getTime()')).toBeLessThanOrEqual(new Date().getTime());
  });

  it('Should support RegExp', () => {
    expect(evaluate('/.*/.test(a)', { a: 'a' })).toBe(true);
  });

  it('Should support RegExp objects', () => {
    expect(evaluate('new RegExp(".*").test(a)', { a: 'a' })).toBe(true);
  });

  it('Should support arrow functions inside expressions', () => {
    expect(evaluate('[1, 2, 3].find(v => v === 3)')).toBe(3);
  });

  it('Should support globals', () => {
    expect(evaluate('NaN')).toBeNaN();
    expect(evaluate('Infinity')).toBe(Infinity);
    expect(evaluate('Boolean(true)')).toBe(true);
    expect(evaluate('Math.min(1, 2, 3)')).toBe(1);
    expect(evaluate('undefined')).toBeUndefined();
    expect(evaluate('isNaN(NaN)')).toBe(true);
    expect(evaluate('Number.isInteger(42)')).toBe(true);
  });

  it('Should not support creating arbitrary objects', () => {
    expect(() => evaluate('new object()')).toThrow(/Cannot instantiate object .*/i);
    class Fn {
      constructor() {}
    }
    expect(() => evaluate('new Fn()', { Fn })).toThrow(/Cannot instantiate object .*/i);
  });

  it('Should not support invalid property references on supported objects', () => {
    expect(() => evaluate('new Date().__proto__')).toThrow(/Cannot access the __proto__ property .*/i);
    expect(() => evaluate('new Date().prototype')).toThrow(/Cannot access the prototype property .*/i);
  });

  it('Should not return invalid types', () => {
    expect(() => evaluate('a', { a: {} })).toThrow(/.* did not produce a valid result/i);
    expect(() => evaluateAsBoolean('a', { a: 'value' })).toThrow(/.* did not produce a valid result/i);
    expect(() => evaluateAsNumber('a', { a: true })).toThrow(/.* did not produce a valid result/i);
    expect(() => evaluateAsType('a', { a: false }, (val): val is 'value' => val === 'value')).toThrow(
      /.* did not produce a valid result/i,
    );
  });

  it('Should support a compilation phase', () => {
    const exp = compile('1 + 1');
    expect(evaluate(exp)).toBe(2);
  });

  it('Should not support variable assignement', () => {
    expect(() => evaluate('var a = 1; a')).toThrow();
  });

  it('Should support asynchronous evaluation', async () => {
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

  it('Should support real-world use-cases', () => {
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
});
