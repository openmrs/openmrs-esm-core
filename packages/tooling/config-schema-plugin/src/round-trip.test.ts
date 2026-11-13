// The serializer here and the hydrator in `@openmrs/esm-config` are inverses of each other, written
// separately and tested separately. Each side pinning its own behaviour with hand-written literals
// is what let them disagree about `constructor` and `prototype` for a while: both suites passed,
// and a module with an option by either name lost it somewhere between its build and its boot.
//
// So this goes the whole way round, from the schema a module declares to the schema the framework
// ends up with, and compares the two. It is the only test that fails when one side changes and the
// other does not.
import { describe, expect, it } from 'vitest';
import { hydrateConfigSchema, Type, validator, validators, type ConfigSchema } from '@openmrs/esm-config/schema';
import { serializeArtifact } from './serialize';
import type { RecordedSchemas } from './types';

const moduleName = '@openmrs/esm-test-app';
const validTypes = Object.values(Type);

/** Declares a schema, writes it out, reads it back, and hands over both ends for comparison. */
function roundTrip(declared: ConfigSchema, authoredValidators?: Record<string, unknown>) {
  const recorded: RecordedSchemas = { modules: { [moduleName]: declared }, extensions: {} };
  const { artifact, errors } = serializeArtifact(recorded, { moduleName, validTypes, authoredValidators });

  expect(errors, 'the schema could not be written down').toEqual([]);

  // Through real JSON, because that is what the registry is: anything that only survives being
  // passed between two objects in one process has not actually made the trip.
  const written = JSON.parse(JSON.stringify(artifact.configurationSchema));
  const { schema, problems, unresolvedValidators } = hydrateConfigSchema(written, (exportName) => {
    const candidate = authoredValidators?.[exportName];
    return typeof candidate === 'function' ? (candidate as never) : undefined;
  });

  return { written, schema, problems, unresolvedValidators };
}

describe('a schema that goes all the way round', () => {
  it('comes back with the same types, defaults and descriptions', () => {
    const { schema, problems } = roundTrip({
      greeting: { _type: Type.String, _default: 'hi', _description: 'A greeting' },
      count: { _type: Type.Number, _default: 3 },
      flag: { _type: Type.Boolean, _default: false },
      list: { _type: Type.Array, _default: ['a'], _elements: { _type: Type.String } },
      nested: { deeper: { thing: { _type: Type.Object, _default: { a: 1 } } } },
    });

    expect(problems).toEqual([]);
    expect(schema).toEqual({
      greeting: { _type: Type.String, _default: 'hi', _description: 'A greeting' },
      count: { _type: Type.Number, _default: 3 },
      flag: { _type: Type.Boolean, _default: false },
      list: { _type: Type.Array, _default: ['a'], _elements: { _type: Type.String, _default: undefined } },
      nested: { deeper: { thing: { _type: Type.Object, _default: { a: 1 } } } },
    });
  });

  it('keeps a default of undefined, which JSON has no way to write', () => {
    // The serializer drops the key and the hydrator puts it back. `validateConfigSchema` rejects a
    // node that has a type and no default at all, so a leaf like this one is the shape that breaks
    // if either half of that contract is removed.
    const { written, schema } = roundTrip({ expression: { _type: Type.String, _default: undefined } });

    expect(Object.hasOwn(written.expression, '_default')).toBe(false);
    expect(Object.hasOwn(schema.expression as object, '_default')).toBe(true);
    expect((schema.expression as ConfigSchema)._default).toBeUndefined();
  });

  it('keeps the keys that survive being assigned, and drops only the one that does not', () => {
    // `__proto__` is an accessor on `Object.prototype`, so it cannot be a key; `constructor` and
    // `prototype` are ordinary data properties and can be. Both halves have to draw the line in
    // the same place.
    const declared = JSON.parse(
      '{"constructor":{"_type":"String","_default":"a"},"prototype":{"_type":"String","_default":"b"}}',
    );
    const { schema, problems } = roundTrip(declared);

    expect(problems).toEqual([]);
    expect((schema.constructor as ConfigSchema)._default).toBe('a');
    expect((schema.prototype as ConfigSchema)._default).toBe('b');
  });

  it('rebuilds every built-in validator so that it answers the way it did', () => {
    const probes = [0, 1, 5, 10, 11, -1, '', 'a', 'z', '/x', '${openmrsBase}/y', '${other}/y', [], ['a', 'b'], null];
    const declared: ConfigSchema = {
      choice: { _type: Type.String, _default: 'a', _validators: [validators.oneOf(['a', 'b'])] },
      span: { _type: Type.Number, _default: 5, _validators: [validators.inRange(1, 10)] },
      above: { _type: Type.Number, _default: 1, _validators: [validators.greaterThan(0)] },
      url: { _type: Type.String, _default: '/x', _validators: [validators.isUrl] },
      templated: {
        _type: Type.String,
        _default: '/x',
        _validators: [validators.isUrlWithTemplateParameters(['other'])],
      },
      items: { _type: Type.Array, _default: ['a'], _validators: [validators.minArrayLength(2)] },
      text: { _type: Type.String, _default: 'a', _validators: [validators.nonEmptyString] },
      whole: { _type: Type.Number, _default: 1, _validators: [validators.positiveInteger] },
    };

    const { schema, problems } = roundTrip(declared);

    expect(problems).toEqual([]);

    for (const key of Object.keys(declared)) {
      const [before] = (declared[key] as ConfigSchema)._validators!;
      const [after] = (schema[key] as ConfigSchema)._validators!;

      expect(
        probes.map((probe) => after(probe)),
        `${key} does not answer the way it did before it was written down`,
      ).toEqual(probes.map((probe) => before(probe)));
    }
  });

  it('resolves a validator the module wrote itself back to the function it names', () => {
    const checkGreeting = validator((value: unknown) => value !== 'goodbye', 'must not be a goodbye');
    const { schema, problems, unresolvedValidators } = roundTrip(
      { greeting: { _type: Type.String, _default: 'hi', _validators: [checkGreeting] } },
      { checkGreeting },
    );

    expect(problems).toEqual([]);
    expect(unresolvedValidators).toEqual([]);

    const [after] = (schema.greeting as ConfigSchema)._validators!;

    expect(after('hi')).toBeUndefined();
    expect(after('goodbye')).toBe('must not be a goodbye');
  });

  it('reports a validator the module wrote itself when nothing can supply it', () => {
    const checkGreeting = validator((value: unknown) => value !== 'goodbye', 'must not be a goodbye');
    const recorded: RecordedSchemas = {
      modules: { [moduleName]: { greeting: { _type: Type.String, _default: 'hi', _validators: [checkGreeting] } } },
      extensions: {},
    };
    const { artifact } = serializeArtifact(recorded, {
      moduleName,
      validTypes,
      authoredValidators: { checkGreeting },
    });

    const { unresolvedValidators } = hydrateConfigSchema(JSON.parse(JSON.stringify(artifact.configurationSchema)));

    expect(unresolvedValidators).toEqual(['checkGreeting']);
  });
});
