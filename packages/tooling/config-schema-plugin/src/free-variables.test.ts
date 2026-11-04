import { describe, expect, it } from 'vitest';
import { findFreeVariables } from './free-variables';

/**
 * The cases that matter are the ones where a wrong answer is expensive: a missed capture becomes a
 * `ReferenceError` in production, in whatever code path an implementer's configuration reaches.
 */
describe('finding what a function reads from outside itself', () => {
  it.each([
    ['a predicate over its own parameter', '(value) => typeof value === "number"'],
    ['a destructured parameter', '({ count, label }) => count > 0 && label.length > 0'],
    ['an array-destructured parameter', '([first, second]) => first < second'],
    ['a local declaration', '(value) => { const limit = 10; return value < limit; }'],
    ['a nested function', '(values) => values.filter((entry) => entry > 0).length > 0'],
    ['standard globals', '(value) => Math.abs(Number(value)) < Number.MAX_SAFE_INTEGER'],
    ['a default parameter', '(value, limit = 5) => value < limit'],
    ['a rest parameter', '(...values) => values.length > 0'],
    ['object literal keys', '(value) => ({ ok: value, other: 1 }).ok'],
    ['member access that looks like a name', '(config) => config.limit > config.floor'],
    ['a function expression with a name', 'function check(value) { return value > 0; }'],
    ['a template literal over its parameter', '(value) => `${value}` !== ""'],
    // Everything below names something that is not a variable at all. Reporting one of these is
    // worse than a limitation: the build fails naming an identifier the author cannot move into
    // the validator, because it was never outside it.
    ['a renamed destructuring', '(value) => { const { min: lower } = value; return lower > 0; }'],
    ['a nested renamed destructuring', '(value) => { const { a: { b: c } } = value; return c > 0; }'],
    ['a loop label', '(values) => { outer: for (const v of values) { break outer; } return true; }'],
    ['a method shorthand', '(value) => ({ check(v) { return v > 0; } }).check(value)'],
    ['a getter', '(value) => ({ get total() { return value; } }).total'],
    ['a class method', '(value) => { class C { helper(v) { return v; } } return new C().helper(value) > 0; }'],
    ['an object literal setter', '(value) => { const o = { set x(n) { this.y = n; } }; o.x = value; return true; }'],
    ['arguments', 'function (value) { return arguments.length > 0 && value !== undefined; }'],
    ['browser globals', '(value) => typeof window !== "undefined" && value instanceof Uint8Array'],
  ])('finds nothing in %s', (_label, source) => {
    expect(findFreeVariables(source)).toEqual([]);
  });

  it.each([
    ['a module constant', '(value) => value < LIMIT', ['LIMIT']],
    ['an imported helper', '(value) => isThing(value)', ['isThing']],
    ['a constant in a template literal', '(value) => `${value} exceeds ${MAX}`', ['MAX']],
    ['a computed member key', '(config) => config[FIELD] > 0', ['FIELD']],
    ['several at once', '(value) => value > MIN && value < MAX', ['MAX', 'MIN']],
    // The exclusions above are narrow: a key or a pattern still reads whatever is written into it.
    ['a computed object key', '(value) => ({ [FIELD]: value }).x !== undefined', ['FIELD']],
    ['a destructuring default', '(value) => { const { a = FALLBACK } = value; return a; }', ['FALLBACK']],
    ['a computed class member', '(value) => { class C { [NAME]() { return value; } } return new C(); }', ['NAME']],
  ])('finds the capture in %s', (_label, source, expected) => {
    expect(findFreeVariables(source)).toEqual(expected);
  });

  it('does not mistake a shorthand property value for a key', () => {
    // `{ value }` reads `value`; `{ captured }` reads a name from outside.
    expect(findFreeVariables('(value) => ({ value, captured })')).toEqual(['captured']);
  });

  it('reports a swc helper as a capture', () => {
    // Compiled output can reference helpers that only exist in the module swc emitted them into,
    // which is the same problem as a module constant and has to fail the same way.
    expect(findFreeVariables('(value) => _instanceof(value, Date)')).toEqual(['_instanceof']);
  });

  it('throws on source it cannot parse, rather than reporting no captures', () => {
    expect(() => findFreeVariables('(value) => {')).toThrow();
  });
});
