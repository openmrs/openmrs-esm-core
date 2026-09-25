import type { SerializedConfigSchema } from '@openmrs/esm-globals';
import { describe, expect, it } from 'vitest';
import { Type, type Validator } from '../types';
import { getValidatorDescriptor } from '../validators/descriptor';
import { validators } from '../validators/validators';
import { hydrateConfigSchema } from './hydrate-schema';

describe('hydrating a schema that has been through JSON', () => {
  it('reads back types, defaults and descriptions', () => {
    const { schema, problems } = hydrateConfigSchema({
      greeting: { _type: 'String', _default: 'hello', _description: 'What to say' },
    });

    expect(problems).toEqual([]);
    expect(schema.greeting).toEqual({ _type: Type.String, _default: 'hello', _description: 'What to say' });
  });

  it('recurses into nested keys and into _elements', () => {
    const { schema } = hydrateConfigSchema({
      outer: { inner: { _type: 'Number', _default: 1 } },
      list: { _type: 'Array', _default: [], _elements: { _type: 'String' } },
    });

    expect((schema.outer as any).inner._default).toBe(1);
    expect((schema.list as any)._elements._type).toBe(Type.String);
  });

  it('restores a default of undefined that JSON could not write down', () => {
    // `JSON.stringify` drops a `_default` of `undefined`, and `validateConfigSchema` rejects a leaf
    // with no `_default`.
    const { schema } = hydrateConfigSchema({ expression: { _type: 'String', _description: 'An expression' } });

    expect(Object.hasOwn(schema.expression as object, '_default')).toBe(true);
    expect((schema.expression as any)._default).toBeUndefined();
  });

  it('does not invent a default for a node that only groups other keys', () => {
    const { schema } = hydrateConfigSchema({ group: { child: { _type: 'String', _default: 'x' } } });

    expect(Object.hasOwn(schema.group as object, '_default')).toBe(false);
  });

  it('reports a type it does not recognize and leaves the key otherwise usable', () => {
    const { schema, problems } = hydrateConfigSchema({ thing: { _type: 'Sandwich', _default: 'blt' } });

    expect(problems).toHaveLength(1);
    expect(problems[0].keyPath).toBe('thing._type');
    expect(problems[0].message).toContain('Sandwich');
    expect((schema.thing as any)._type).toBeUndefined();
    expect((schema.thing as any)._default).toBe('blt');
  });

  it('refuses the one key that would reach through to Object.prototype, and keeps the ones that would not', () => {
    // Parsed rather than written as a literal: in a literal, `__proto__` sets the prototype instead
    // of adding a key. `constructor` and `prototype` are kept, matching the serializer.
    const parsed: SerializedConfigSchema = JSON.parse(
      '{"__proto__":{"_type":"String","_default":"polluted"},' +
        '"constructor":{"_type":"String","_default":"kept"},' +
        '"prototype":{"_type":"String","_default":"kept"},' +
        '"safe":{"_type":"String","_default":"fine"}}',
    );

    const { schema, problems } = hydrateConfigSchema(parsed);

    expect(problems.map((problem) => problem.keyPath)).toEqual(['__proto__']);
    expect(Object.getPrototypeOf(schema)).toBe(Object.prototype);
    expect((schema.constructor as any)._default).toBe('kept');
    expect((schema.prototype as any)._default).toBe('kept');
    expect((schema.safe as any)._default).toBe('fine');
  });

  it('reports a node that is not an object rather than trying to walk it', () => {
    // Only a hand-written `config-schema.json` can do this. A string is the dangerous case: indexing
    // it yields another string, so walking it never terminates.
    const { schema, problems } = hydrateConfigSchema(
      JSON.parse('{"text":"oops","nothing":null,"list":[1,2],"safe":{"_type":"String","_default":"fine"}}'),
    );

    expect(problems.map((problem) => problem.keyPath).sort()).toEqual(['list', 'nothing', 'text']);
    expect(Object.keys(schema)).toEqual(['safe']);
  });

  it('reports a schema that is not an object at all', () => {
    const { schema, problems } = hydrateConfigSchema('nonsense' as unknown as SerializedConfigSchema);

    expect(problems).toHaveLength(1);
    expect(schema).toEqual({});
  });

  it('ignores underscore keys it does not know about', () => {
    // Ignored: an unknown underscore key may be one a newer framework understands.
    const { schema, problems } = hydrateConfigSchema({
      thing: { _type: 'String', _default: 'x', _somethingNew: true } as SerializedConfigSchema,
    });

    expect(problems).toEqual([]);
    expect(Object.hasOwn(schema.thing as object, '_somethingNew')).toBe(false);
  });
});

describe('hydrating validators', () => {
  it('builds a validator that takes arguments from its arguments', () => {
    const { schema, problems } = hydrateConfigSchema({
      choice: { _type: 'String', _default: 'a', _validators: [{ type: 'oneOf', args: [['a', 'b']] }] },
    });

    expect(problems).toEqual([]);

    const [validate] = (schema.choice as any)._validators as Array<Validator>;
    expect(validate('a')).toBeUndefined();
    expect(validate('z')).toEqual(expect.stringContaining('one of'));
  });

  it('uses a validator that takes no arguments as it is', () => {
    const { schema } = hydrateConfigSchema({
      url: { _type: 'String', _default: '/x', _validators: [{ type: 'isUrl' }] },
    });

    const [validate] = (schema.url as any)._validators as Array<Validator>;
    expect(validate('/x')).toBeUndefined();
    expect(validate(4)).toEqual(expect.any(String));
  });

  it('reports a validator this framework does not have, rather than guessing', () => {
    const { schema, problems } = hydrateConfigSchema({
      thing: { _type: 'String', _default: 'x', _validators: [{ type: 'isEnormous', args: [3] }] },
    });

    expect(problems).toHaveLength(1);
    expect(problems[0].message).toContain('older than the build tooling');
    expect((schema.thing as any)._validators).toEqual([]);
  });

  it('leaves out a custom validator when nothing can resolve it', () => {
    const { schema, unresolvedValidators } = hydrateConfigSchema({
      thing: { _type: 'String', _default: 'x', _validators: [{ type: 'custom', export: 'checkThing' }] },
    });

    expect(unresolvedValidators).toEqual(['checkThing']);
    expect((schema.thing as any)._validators).toEqual([]);
  });

  it('uses a custom validator once a resolver can supply it', () => {
    const checkThing: Validator = (value) => (value === 'x' ? undefined : 'must be x');

    const { schema, unresolvedValidators } = hydrateConfigSchema(
      { thing: { _type: 'String', _default: 'x', _validators: [{ type: 'custom', export: 'checkThing' }] } },
      (exportName) => (exportName === 'checkThing' ? checkThing : undefined),
    );

    expect(unresolvedValidators).toEqual([]);
    expect((schema.thing as any)._validators).toEqual([checkThing]);
  });

  it('reports a custom validator that does not say which export it is', () => {
    // Only reachable by hand. Without its own message it is reported as a missing export named
    // `undefined`, which blames the module.
    const { problems, unresolvedValidators } = hydrateConfigSchema(
      { thing: { _type: 'String', _default: 'x', _validators: [{ type: 'custom' } as never] } },
      () => undefined,
    );

    expect(unresolvedValidators).toEqual([]);
    expect(problems).toHaveLength(1);
    expect(problems[0].message).toContain('must name the export');
  });

  it('reports a custom validator the module does not actually export', () => {
    const { problems, unresolvedValidators } = hydrateConfigSchema(
      { thing: { _type: 'String', _default: 'x', _validators: [{ type: 'custom', export: 'missing' }] } },
      () => undefined,
    );

    expect(unresolvedValidators).toEqual(['missing']);
    expect(problems[0].message).toContain('./config-validators');
  });

  it('reports a built-in that cannot be built from the arguments given', () => {
    const { problems } = hydrateConfigSchema({
      thing: { _type: 'String', _default: 'x', _validators: [{ type: 'oneOf', args: ['not an array'] }] },
    });

    expect(problems).toHaveLength(1);
    expect(problems[0].keyPath).toBe('thing._validators');
  });

  // Only reachable by hand. Otherwise a factory with no arguments installs a function that throws on
  // the first value, and a validator with arguments one that never fires, since `runValidators` only
  // acts on a returned string.
  it.each([
    ['a factory named with no arguments', { type: 'oneOf' }, 'needs arguments'],
    ['a factory whose result is not a validator', { type: 'isUrlWithTemplateParameters' }, 'needs arguments'],
    ['a validator named with arguments', { type: 'isUrl', args: [1] }, 'does not take arguments'],
    ['a validator named with arguments', { type: 'nonEmptyString', args: ['x'] }, 'does not take arguments'],
  ])('reports %s', (_label, entry, expected) => {
    const { schema, problems } = hydrateConfigSchema({
      thing: { _type: 'String', _default: 'x', _validators: [entry as never] },
    });

    expect(problems).toHaveLength(1);
    expect(problems[0].message).toContain(expected);
    expect((schema.thing as any)._validators).toEqual([]);
  });
});

describe('the built-in validator vocabulary', () => {
  /**
   * Every validator in the vocabulary accepts some of these and rejects others. Messages are compared,
   * not just pass or fail, to catch rearranged arguments: `inRange(10, 1)` rebuilt from `[1, 10]`
   * still reports problems, just for every value.
   */
  const probes = [0, 1, 5, 10, 11, -1, 1.5, '', 'a', 'z', '/x', '${openmrsBase}/y', '${other}/y', [], ['a'], null];

  // Covers the whole vocabulary, so a new built-in that forgets its descriptor fails here rather than
  // in a distribution.
  it.each(Object.entries(validators))('round-trips %s through the serialized form', (name, builtIn) => {
    const isFactory = typeof builtIn === 'function' && getValidatorDescriptor(builtIn) === undefined;

    const sampleArguments: Record<string, Array<unknown>> = {
      greaterThan: [0],
      inRange: [0, 10],
      isUrlWithTemplateParameters: [['openmrsBase']],
      minArrayLength: [1],
      oneOf: [['a']],
    };

    const instance = isFactory
      ? (builtIn as (...args: Array<unknown>) => Validator)(...sampleArguments[name])
      : builtIn;
    const descriptor = getValidatorDescriptor(instance);

    expect(descriptor, `${name} must describe itself so it can be written into a schema`).toBeDefined();

    const serialized =
      descriptor!.args && descriptor!.args.length > 0
        ? { type: descriptor!.type, args: descriptor!.args }
        : { type: descriptor!.type };

    const { schema, problems } = hydrateConfigSchema({
      thing: { _type: 'String', _default: 'x', _validators: [serialized] },
    });

    expect(problems, `${name} did not survive being written down and read back`).toEqual([]);

    const [rehydrated] = (schema.thing as any)._validators as Array<Validator>;

    expect(
      probes.map((probe) => rehydrated(probe)),
      `${name} does not answer the way it did before it was written down`,
    ).toEqual(probes.map((probe) => (instance as Validator)(probe)));
  });
});
