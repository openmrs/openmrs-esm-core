import { describe, expect, it } from 'vitest';
import type { Validator } from '../types';
import { getValidatorDescriptor } from './descriptor';
import { validator } from './validator';
import {
  greaterThan,
  inRange,
  isUrl,
  isUrlWithTemplateParameters,
  minArrayLength,
  nonEmptyString,
  oneOf,
  positiveInteger,
  validators,
} from './validators';

describe('all validators', () => {
  it('fail on undefined', () => {
    expect(inRange(0, 10)(undefined)).toMatch(/.*/);
    expect(isUrl(undefined)).toMatch(/.*/);
    expect(isUrlWithTemplateParameters(['foo'])(undefined)).toMatch(/.*/);
    expect(oneOf(['foo', 'bar'])(undefined)).toMatch(/.*/);
    expect(greaterThan(0)(undefined)).toMatch(/.*/);
    expect(minArrayLength(1)(undefined)).toMatch(/.*/);
    expect(nonEmptyString(undefined)).toMatch(/.*/);
    expect(positiveInteger(undefined)).toMatch(/.*/);
  });
});

describe('isUrl', () => {
  it('accepts a string with valid URL parameters', () => {
    expect(isUrl('${openmrsSpaBase}/${openmrsBase}/thing')).toBeUndefined();
  });

  it('accepts a string with no parameters', () => {
    expect(isUrl('/thing')).toBeUndefined();
  });

  it('rejects a string with unknkown URL parameters', () => {
    expect(isUrl('${foo}/bad')).toMatch(/allowed template parameters are \${openmrsBase}, \${openmrsSpaBase}/i);
  });
});

describe('oneOf', () => {
  it('accepts one of the valid options', () => {
    expect(oneOf(['foo', 'bar'])('foo')).toBeUndefined();
  });

  it('rejects anything else', () => {
    expect(oneOf(['foo', 'bar'])('baz')).toMatch(/one of.*foo.*bar/i);
  });
});

describe('greaterThan', () => {
  it('accepts a number above the minimum', () => {
    expect(greaterThan(0)(1)).toBeUndefined();
  });

  it('rejects the minimum itself', () => {
    expect(greaterThan(0)(0)).toMatch(/greater than 0/i);
  });

  it('rejects a non-number', () => {
    expect(greaterThan(0)('5')).toMatch(/greater than 0/i);
  });
});

describe('minArrayLength', () => {
  it('accepts an array of exactly the minimum length', () => {
    expect(minArrayLength(2)(['a', 'b'])).toBeUndefined();
  });

  it('rejects a shorter array', () => {
    expect(minArrayLength(2)(['a'])).toMatch(/at least 2 items/i);
  });

  it('rejects a non-array', () => {
    expect(minArrayLength(1)('ab')).toMatch(/at least 1 item/i);
  });

  it('makes the message singular for one item', () => {
    expect(minArrayLength(1)([])).toMatch(/at least 1 item$/i);
  });
});

describe('nonEmptyString', () => {
  it('accepts a string with content', () => {
    expect(nonEmptyString('a')).toBeUndefined();
  });

  it('rejects an empty or whitespace-only string', () => {
    expect(nonEmptyString('')).toMatch(/not be empty/i);
    expect(nonEmptyString('   ')).toMatch(/not be empty/i);
  });

  it('rejects a non-string', () => {
    expect(nonEmptyString(5)).toMatch(/not be empty/i);
  });
});

describe('positiveInteger', () => {
  it('accepts a whole number above zero', () => {
    expect(positiveInteger(3)).toBeUndefined();
  });

  it('rejects zero, negatives and fractions', () => {
    expect(positiveInteger(0)).toMatch(/positive integer/i);
    expect(positiveInteger(-1)).toMatch(/positive integer/i);
    expect(positiveInteger(1.5)).toMatch(/positive integer/i);
  });
});

describe('validator descriptors', () => {
  it('describe every member of the built-in vocabulary', () => {
    // Build tooling writes a schema out as JSON by reading these descriptors, so a built-in that
    // lacks one silently becomes an unserializable custom validator. Arity cannot tell a factory
    // from a validator here, since `isUrl` and `oneOf` both take one argument, so each is named.
    const built: Record<keyof typeof validators, Validator> = {
      greaterThan: validators.greaterThan(0),
      inRange: validators.inRange(0, 1),
      isUrl: validators.isUrl,
      isUrlWithTemplateParameters: validators.isUrlWithTemplateParameters([]),
      minArrayLength: validators.minArrayLength(1),
      nonEmptyString: validators.nonEmptyString,
      oneOf: validators.oneOf(['a']),
      positiveInteger: validators.positiveInteger,
    };

    // Fails if a validator is added to the vocabulary without being covered here.
    expect(Object.keys(built).sort()).toEqual(Object.keys(validators).sort());

    for (const [name, validatorToCheck] of Object.entries(built)) {
      expect(getValidatorDescriptor(validatorToCheck), `${name} has no descriptor`).toBeDefined();
    }
  });

  it('record the arguments a factory was called with', () => {
    expect(getValidatorDescriptor(inRange(1, 10))).toEqual({ type: 'inRange', args: [1, 10] });
    expect(getValidatorDescriptor(oneOf(['a', 'b']))).toEqual({ type: 'oneOf', args: [['a', 'b']] });
    expect(getValidatorDescriptor(greaterThan(0))).toEqual({ type: 'greaterThan', args: [0] });
    expect(getValidatorDescriptor(minArrayLength(2))).toEqual({ type: 'minArrayLength', args: [2] });
  });

  it('record no arguments for the validators that are values rather than factories', () => {
    expect(getValidatorDescriptor(isUrl)).toEqual({ type: 'isUrl', args: [] });
    expect(getValidatorDescriptor(nonEmptyString)).toEqual({ type: 'nonEmptyString', args: [] });
    expect(getValidatorDescriptor(positiveInteger)).toEqual({ type: 'positiveInteger', args: [] });
  });

  it('record the template parameters as given, not as expanded', () => {
    // The factory adds `openmrsBase` and `openmrsSpaBase` itself, so a descriptor carrying the
    // expanded list would grow those two entries again every time it was reconstructed.
    expect(getValidatorDescriptor(isUrlWithTemplateParameters(['foo']))).toEqual({
      type: 'isUrlWithTemplateParameters',
      args: [['foo']],
    });
  });

  it('are absent from a custom validator', () => {
    expect(getValidatorDescriptor(validator(() => true, 'nope'))).toBeUndefined();
  });

  it('do not show up when a schema is walked or compared', () => {
    // Schemas are deep-compared in the config store and spread wholesale into the implementer
    // tools' tree; a descriptor that enumerated would leak into both.
    const tagged = oneOf(['a']);

    expect(Object.keys(tagged)).toEqual([]);
    expect(JSON.parse(JSON.stringify({ _validators: [tagged] }))).toEqual({ _validators: [null] });
  });
});
