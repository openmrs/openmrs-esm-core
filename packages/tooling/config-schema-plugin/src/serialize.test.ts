import { describe, expect, it } from 'vitest';
import { Type, validator, validators } from '@openmrs/esm-config/schema';
import { serializeArtifact } from './serialize';
import type { RecordedSchemas } from './types';

const moduleName = '@openmrs/esm-test-app';

// In a real build these come from the module's own bundle, through the shim.
const validTypes = Object.values(Type);

function serialize(schema: unknown, options: { authoredValidators?: Record<string, unknown> } = {}) {
  const recorded: RecordedSchemas = { modules: { [moduleName]: schema }, extensions: {} };
  return serializeArtifact(recorded, { moduleName, validTypes, ...options });
}

describe('serializing a schema', () => {
  it('survives a round trip through JSON', () => {
    const { artifact, errors } = serialize({
      greeting: { _type: Type.String, _default: 'hi', _description: 'A greeting' },
      count: { _type: Type.Number, _default: 3 },
      nested: { flag: { _type: Type.Boolean, _default: false } },
    });

    expect(errors).toEqual([]);
    expect(JSON.parse(JSON.stringify(artifact.configurationSchema))).toEqual({
      greeting: { _type: 'String', _default: 'hi', _description: 'A greeting' },
      count: { _type: 'Number', _default: 3 },
      nested: { flag: { _type: 'Boolean', _default: false } },
    });
  });

  it('writes built-in validators as references', () => {
    const { artifact, errors } = serialize({
      provider: { _type: Type.String, _default: 'basic', _validators: [validators.oneOf(['basic', 'oauth2'])] },
      url: { _type: Type.String, _default: '/x', _validators: [validators.isUrl] },
      size: { _type: Type.Number, _default: 1, _validators: [validators.inRange(1, 10), validators.greaterThan(0)] },
    });

    expect(errors).toEqual([]);
    expect(artifact.configurationSchema).toMatchObject({
      provider: { _validators: [{ type: 'oneOf', args: [['basic', 'oauth2']] }] },
      url: { _validators: [{ type: 'isUrl' }] },
      size: {
        _validators: [
          { type: 'inRange', args: [1, 10] },
          { type: 'greaterThan', args: [0] },
        ],
      },
    });
  });

  it('keeps validators at the root and at intermediate nodes', () => {
    const crossField = validator(() => true, 'nope');
    const { artifact, transposedValidators } = serialize({
      _validators: [crossField],
      group: { _validators: [validators.nonEmptyString], inner: { _type: Type.String, _default: 'a' } },
    });

    expect(artifact.configurationSchema?._validators).toEqual([{ type: 'custom', export: 'validator1' }]);
    expect((artifact.configurationSchema?.group as Record<string, unknown>)._validators).toEqual([
      { type: 'nonEmptyString' },
    ]);
    expect(transposedValidators).toHaveLength(1);
    expect(transposedValidators[0]).toMatchObject({ name: 'validator1', message: '"nope"' });
  });

  it('recurses into _elements for arrays and freeform objects', () => {
    const { artifact, errors } = serialize({
      list: {
        _type: Type.Array,
        _default: [],
        _elements: { _type: Type.String, _default: '', _validators: [validators.nonEmptyString] },
      },
      map: { _type: Type.Object, _default: {}, _elements: { _type: Type.Number, _default: 0 } },
    });

    expect(errors).toEqual([]);
    expect(artifact.configurationSchema).toMatchObject({
      list: { _elements: { _type: 'String', _validators: [{ type: 'nonEmptyString' }] } },
      map: { _elements: { _type: 'Number', _default: 0 } },
    });
  });

  it('omits a _default of undefined rather than writing null', () => {
    // The framework restores it when hydrating a node that has a _type but no _default. Writing
    // `null` would hand the module a different value than the schema declares.
    const { artifact, errors } = serialize({
      maybe: { _type: Type.String, _default: undefined, _description: 'Optional' },
    });

    expect(errors).toEqual([]);
    expect(artifact.configurationSchema?.maybe).toEqual({ _type: 'String', _description: 'Optional' });
    expect(Object.keys(artifact.configurationSchema?.maybe as object)).not.toContain('_default');
  });

  it('fails on a config option named __proto__ rather than dropping it quietly', () => {
    const hostile = JSON.parse('{"__proto__": {"polluted": true}, "ok": {"_type": "String", "_default": "a"}}');
    const { artifact, errors } = serialize(hostile);

    expect(errors.join('\n')).toMatch(/__proto__/);
    expect(Object.keys(artifact.configurationSchema as object)).toEqual(['ok']);
    // Unchanged rather than the value the schema tried to smuggle in, which is what assigning the
    // key onto the object being built would have produced.
    expect(Object.getPrototypeOf(artifact.configurationSchema)).toBe(Object.prototype);
  });

  it('fails on a default object with a __proto__ key', () => {
    const hostile = JSON.parse('{"bad": {"_type": "Object", "_default": {"__proto__": {"polluted": true}}}}');
    const { artifact, errors } = serialize(hostile);

    expect(errors.join('\n')).toMatch(/__proto__/);

    const emitted = (artifact.configurationSchema?.bad as { _default: object })._default;

    expect(emitted).toEqual({});
    expect(Object.getPrototypeOf(emitted)).toBe(Object.prototype);
  });

  it('emits options named constructor or prototype like any other', () => {
    // Neither is an accessor on `Object.prototype`, so assigning one shadows the inherited value
    // harmlessly. Dropping them would lose configuration the module declared.
    const { artifact, errors } = serialize({
      constructor: { _type: Type.String, _default: 'a' },
      prototype: { _type: Type.String, _default: 'b' },
    });

    expect(errors).toEqual([]);
    expect(JSON.parse(JSON.stringify(artifact.configurationSchema))).toEqual({
      constructor: { _type: 'String', _default: 'a' },
      prototype: { _type: 'String', _default: 'b' },
    });
  });

  it('drops an unrecognized underscore key without comment', () => {
    // Tolerated but not echoed: the artifact says what the configuration system will act on, and a
    // key it ignores is not that. `_required` is the one in the wild: declared in real schemas,
    // never implemented.
    const { artifact, warnings, errors } = serialize({
      thing: { _type: Type.String, _default: 'a', _required: true, _somethingElse: 1 },
    });

    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
    expect(artifact.configurationSchema?.thing).toEqual({ _type: 'String', _default: 'a' });
  });
});

describe('defaults JSON cannot represent', () => {
  it.each([
    ['a function', () => 1],
    ['a Date', new Date(0)],
    ['a RegExp', /x/],
    ['a bigint', BigInt(1)],
    ['Infinity', Infinity],
    ['NaN', NaN],
  ])('fails the build for %s', (_label, badDefault) => {
    const { errors } = serialize({ bad: { _type: Type.String, _default: badDefault } });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toMatch(/'bad'/);
  });

  it('fails for undefined nested inside an object default', () => {
    const { errors } = serialize({ bad: { _type: Type.Object, _default: { a: 1, b: undefined } } });

    expect(errors.join('\n')).toMatch(/'bad\.b' is undefined/);
  });

  it('fails for a circular default', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    const { errors } = serialize({ bad: { _type: Type.Object, _default: circular } });

    expect(errors.join('\n')).toMatch(/circular/i);
  });

  it('accepts nested arrays and plain objects', () => {
    const { artifact, errors } = serialize({
      ok: { _type: Type.Array, _default: [{ a: [1, 'two', true, null] }] },
    });

    expect(errors).toEqual([]);
    expect(artifact.configurationSchema?.ok).toEqual({ _type: 'Array', _default: [{ a: [1, 'two', true, null] }] });
  });
});

describe('invalid schemas', () => {
  it('fails for an unknown _type', () => {
    const { errors } = serialize({ bad: { _type: 'Sring', _default: 'a' } });

    expect(errors.join('\n')).toMatch(/Invalid _type "Sring"/);
  });

  it('fails when a validator is not a function, and suggests upgrading the tooling', () => {
    // This is what `validators.somethingAddedLater` looks like to older build tooling.
    const { errors } = serialize({ bad: { _type: Type.String, _default: 'a', _validators: [undefined] } });

    expect(errors.join('\n')).toMatch(/not a function/);
    expect(errors.join('\n')).toMatch(/tooling needs upgrading/);
  });

  it('fails when a built-in validator was given an argument JSON cannot represent', () => {
    // `inRange(0, Infinity)` would otherwise reach the registry as `inRange(0, null)` and reject
    // every value the module meant to allow, which is the same silent substitution the `_default` checks
    // exist to prevent.
    const { errors } = serialize({
      bad: { _type: Type.Number, _default: 1, _validators: [validators.inRange(0, Infinity)] },
    });

    expect(errors.join('\n')).toMatch(/validator argument at 'bad\._validators\.0\.args\.1' is Infinity/);
  });

  it('fails when a built-in validator was given an undefined argument', () => {
    const { errors } = serialize({
      bad: { _type: Type.String, _default: 'a', _validators: [validators.oneOf(['a', undefined])] },
    });

    expect(errors.join('\n')).toMatch(/validator argument.*is undefined/);
  });

  it('keeps arguments that JSON can represent', () => {
    const { artifact, errors } = serialize({
      ok: { _type: Type.Number, _default: 1, _validators: [validators.inRange(0, 10)] },
    });

    expect(errors).toEqual([]);
    expect((artifact.configurationSchema?.ok as Record<string, unknown>)._validators).toEqual([
      { type: 'inRange', args: [0, 10] },
    ]);
  });

  it('fails when _validators is not an array', () => {
    const { errors } = serialize({ bad: { _type: Type.String, _default: 'a', _validators: validators.isUrl } });

    expect(errors.join('\n')).toMatch(/must be an array/);
  });
});

describe('custom validators', () => {
  it('references an authored export by name', () => {
    const validateProvider = validator(() => true, 'nope');
    const { artifact, transposedValidators, warnings } = serialize(
      { _validators: [validateProvider] },
      { authoredValidators: { validateProvider, unrelated: () => 0 } },
    );

    expect(artifact.configurationSchema?._validators).toEqual([{ type: 'custom', export: 'validateProvider' }]);
    expect(transposedValidators).toEqual([]);
    expect(warnings).toEqual([]);
  });

  it('gives several inline validators distinct names, each with its own source', () => {
    const { artifact, transposedValidators } = serialize({
      a: { _type: Type.String, _default: 'x', _validators: [validator((v) => v === 'a', 'a')] },
      b: { _type: Type.String, _default: 'x', _validators: [validator((v) => v === 'b', 'b')] },
    });

    expect(transposedValidators.map((entry) => entry.name)).toEqual(['validator1', 'validator2']);
    expect(transposedValidators.map((entry) => entry.message)).toEqual(['"a"', '"b"']);
    expect(transposedValidators[0].validationFunction).toMatch(/===\s*['"]a['"]/);
    expect(transposedValidators[1].validationFunction).toMatch(/===\s*['"]b['"]/);
    expect((artifact.configurationSchema?.a as Record<string, unknown>)._validators).toEqual([
      { type: 'custom', export: 'validator1' },
    ]);
  });

  it('transposes an inline validator without complaint', () => {
    // Copying it into the module's config-validators entry point makes it an ordinary export with
    // no drawback left, so there is nothing to tell the author about.
    const { warnings, errors } = serialize({ _validators: [validator(() => true, 'x')] });

    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  it('fails when an inline validator reads something from the module around it', () => {
    // It would be copied into a file where that name does not exist, compile, and then throw
    // ReferenceError the first time an implementer's configuration reached it.
    const limit = 10;
    const { errors } = serialize({
      bad: { _type: Type.Number, _default: 1, _validators: [validator((v: number) => v < limit, 'too big')] },
    });

    expect(errors.join('\n')).toMatch(/`limit`/);
    expect(errors.join('\n')).toMatch(/src\/config-validators\.ts/);
  });

  it('fails when an inline validator has a message function that captures', () => {
    const suffix = '!';
    const { errors } = serialize({
      bad: {
        _type: Type.Number,
        _default: 1,
        _validators: [
          validator(
            () => false,
            () => `nope${suffix}`,
          ),
        ],
      },
    });

    expect(errors.join('\n')).toMatch(/message of the custom validator/);
    expect(errors.join('\n')).toMatch(/`suffix`/);
  });

  it('fails when a custom validator was not built with validator()', () => {
    const { errors } = serialize({
      bad: { _type: Type.Number, _default: 1, _validators: [(value: unknown) => (value ? undefined : 'nope')] },
    });

    expect(errors.join('\n')).toMatch(/was not built with/);
  });

  it('transposes a message function that captures nothing', () => {
    const { errors, transposedValidators } = serialize({
      ok: {
        _type: Type.Number,
        _default: 1,
        _validators: [
          validator(
            (v: number) => v > 0,
            (v: number) => `${v} is not positive`,
          ),
        ],
      },
    });

    expect(errors).toEqual([]);
    expect(transposedValidators[0].message).toContain('is not positive');
  });
});

describe('extension schemas', () => {
  it('are keyed by extension name and tracked separately', () => {
    const recorded: RecordedSchemas = {
      modules: { [moduleName]: { a: { _type: Type.String, _default: 'x' } } },
      extensions: {
        'my-extension': { b: { _type: Type.Number, _default: 1, _validators: [validator(() => true, 'x')] } },
      },
    };

    const { artifact, transposedValidators } = serializeArtifact(recorded, { moduleName, validTypes });

    expect(artifact.extensionConfigurationSchemas).toMatchObject({
      'my-extension': { b: { _type: 'Number', _default: 1, _validators: [{ type: 'custom', export: 'validator1' }] } },
    });
    expect(transposedValidators.map((entry) => entry.name)).toEqual(['validator1']);
  });

  it('survive an extension literally named __proto__', () => {
    // The recording maps are keyed by names the module chooses. On an ordinary object, assigning
    // `__proto__` sets the prototype instead of adding a key, and the schema would disappear with
    // no error anywhere in the pipeline.
    const extensions: Record<string, unknown> = Object.create(null);
    extensions['__proto__'] = { size: { _type: Type.Number, _default: 1 } };

    const { artifact, errors } = serializeArtifact({ modules: {}, extensions }, { moduleName, validTypes });

    expect(errors).toEqual([]);
    expect(Object.keys(artifact.extensionConfigurationSchemas ?? {})).toEqual(['__proto__']);
    // The schema itself, rather than `Object.prototype`, which is what reading the key back would
    // give if it had been assigned onto an ordinary object along the way.
    expect(artifact.extensionConfigurationSchemas!['__proto__']).toEqual({
      size: { _type: 'Number', _default: 1 },
    });
  });

  it('name the extension in diagnostics', () => {
    const recorded: RecordedSchemas = {
      modules: {},
      extensions: { 'my-extension': { b: { _type: 'Nope', _default: 1 } } },
    };

    const { errors } = serializeArtifact(recorded, { moduleName, validTypes });

    expect(errors.join('\n')).toMatch(/extension 'my-extension'/);
  });
});

describe('schemas declared for another module', () => {
  it('are warned about and left out of the artifact', () => {
    const recorded: RecordedSchemas = {
      modules: {
        [moduleName]: { a: { _type: Type.String, _default: 'x' } },
        '@openmrs/esm-other-app': { b: { _type: Type.String, _default: 'y' } },
      },
      extensions: {},
    };

    const { artifact, warnings, errors } = serializeArtifact(recorded, { moduleName, validTypes });

    expect(errors).toEqual([]);
    expect(warnings.join('\n')).toMatch(/@openmrs\/esm-other-app/);
    expect(Object.keys(artifact.configurationSchema as object)).toEqual(['a']);
  });
});

describe('a module with no schema', () => {
  it('produces an artifact with neither key', () => {
    const { artifact, errors, warnings } = serializeArtifact(
      { modules: {}, extensions: {} },
      { moduleName, validTypes },
    );

    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
    expect(artifact.configurationSchema).toBeUndefined();
    expect(artifact.extensionConfigurationSchemas).toBeUndefined();
  });
});

describe('naming a validator that is lifted into the generated entry point', () => {
  it('does not take a name the module already exports', () => {
    // The generated module re-exports the module's own validators with `export *` and declares the
    // lifted ones alongside. A local declaration wins silently, so reusing the name would replace
    // the module's own export with something unrelated to it.
    const validator1 = validator((value: unknown) => value !== 'no', 'must not be no');
    const { artifact, errors } = serialize(
      { thing: { _type: Type.String, _default: 'a', _validators: [validator((value) => value !== 'b', 'not b')] } },
      { authoredValidators: { validator1 } },
    );

    expect(errors).toEqual([]);
    expect(
      (artifact.configurationSchema?.thing as { _validators: Array<{ export: string }> })._validators[0].export,
    ).not.toBe('validator1');
  });
});
