import { findFreeVariables } from './free-variables';
import type {
  ConfigSchemaArtifact,
  RecordedSchemas,
  SerializeResult,
  SerializedConfigSchema,
  SerializedValidator,
  TransposedValidator,
} from './types';

/** The underscore-prefixed keys the configuration system understands on a schema node. */
const knownSchemaKeys = new Set(['_type', '_default', '_description', '_validators', '_elements']);

/**
 * The one key a schema rebuilt by assignment cannot carry.
 *
 * `__proto__` is an accessor on `Object.prototype`, so assigning it sets the prototype instead of
 * adding a key, and the value disappears. `constructor` and `prototype` are ordinary data
 * properties: assigning either shadows the inherited one and is harmless, so they are emitted like
 * any other key.
 */
const unrepresentableKey = '__proto__';

/**
 * Where a built-in validator carries the description of how to rebuild it.
 *
 * Read through the global symbol registry rather than by importing `@openmrs/esm-config`: this
 * code runs under Node in the build, and the framework is ESM while the build tooling is CommonJS.
 * The registry is what makes the tag readable across that boundary, and across two installs of the
 * config package.
 */
const validatorDescriptor = Symbol.for('openmrs.config.validatorDescriptor');

/** Where a module's own validator carries the predicate and message it was built from. */
const validatorParts = Symbol.for('openmrs.config.validatorParts');

interface ValidatorParts {
  validationFunction: (value: unknown) => boolean;
  message: string | ((value: unknown) => string);
}

function getValidatorParts(candidate: unknown): ValidatorParts | undefined {
  if (typeof candidate !== 'function') {
    return undefined;
  }

  return (candidate as unknown as Record<symbol, ValidatorParts | undefined>)[validatorParts];
}

interface ValidatorDescriptor {
  type: string;
  args: Array<unknown>;
}

function getValidatorDescriptor(candidate: unknown): ValidatorDescriptor | undefined {
  if (typeof candidate !== 'function') {
    return undefined;
  }

  return (candidate as unknown as Record<symbol, ValidatorDescriptor | undefined>)[validatorDescriptor];
}

export interface SerializeOptions {
  /**
   * The module's `config-validators` exports, if it has any. A custom validator found here is
   * referenced by its export name; one that is not is lifted into that entry point instead.
   */
  authoredValidators?: Record<string, unknown>;
  /** The package this artifact ships in. Used only in diagnostics. */
  moduleName: string;
  /**
   * The values `Type` may take.
   *
   * Read off the shim the child build substitutes for `@openmrs/esm-framework`, which takes them
   * from this package's own copy of `@openmrs/esm-config`. So a module built against a framework
   * that has added a type reports that type as invalid until this package is updated too. The two
   * ship together, which is what makes that acceptable rather than what makes it impossible.
   */
  validTypes: Array<string>;
}

/**
 * Turns what `startupApp()` declared into the module's `config-schema.json`.
 *
 * Every part of a schema is JSON-representable except its validators. Built-in validators carry a
 * descriptor naming how to rebuild them, so they become `{"type": "oneOf", "args": [[...]]}`.
 * Custom validators stay functions, so they become a reference to a named export the framework can
 * load later; one written inline in a schema, having no export to refer to, is lifted into the
 * module's `./config-validators` entry point and reported through
 * {@link SerializeResult.transposedValidators}.
 *
 * Must run in the same process that executed the module: it works off live function identities,
 * which do not survive being sent between processes.
 */
export function serializeArtifact(recorded: RecordedSchemas, options: SerializeOptions): SerializeResult {
  const context: SerializeContext = {
    errors: [],
    warnings: [],
    transposedValidators: [],
    authoredValidators: options.authoredValidators,
    moduleName: options.moduleName,
    validTypes: new Set(options.validTypes),
    source: '',
  };

  const artifact: ConfigSchemaArtifact = {
    $schema: 'https://json.openmrs.org/config-schema.schema.json',
  };

  const moduleNames = Object.keys(recorded.modules);

  for (const declaredFor of moduleNames) {
    if (declaredFor === options.moduleName) {
      context.source = '';
      artifact.configurationSchema = serializeSchema(recorded.modules[declaredFor], [], context);
    } else {
      // The artifact describes the package it ships in and nothing else. Defining a schema for
      // some other module stays available through the runtime API during the transition.
      context.warnings.push(
        `${options.moduleName} calls defineConfigSchema('${declaredFor}'), which is a different module. ` +
          `That schema is not part of this module's config-schema.json and will only take effect once ` +
          `${options.moduleName} is loaded.`,
      );
    }
  }

  const extensionNames = Object.keys(recorded.extensions);

  if (extensionNames.length > 0) {
    // Null-prototype for the same reason the shim's maps are: the keys are extension names the
    // module chose, and `__proto__` would otherwise be swallowed by the prototype setter.
    const extensions: Record<string, SerializedConfigSchema> = Object.create(null);

    for (const extensionName of extensionNames) {
      context.source = extensionName;
      extensions[extensionName] = serializeSchema(recorded.extensions[extensionName], [], context);
    }

    artifact.extensionConfigurationSchemas = extensions;
  }

  return {
    artifact,
    errors: context.errors,
    warnings: context.warnings,
    transposedValidators: context.transposedValidators,
  };
}

interface SerializeContext {
  errors: Array<string>;
  warnings: Array<string>;
  transposedValidators: Array<TransposedValidator>;
  authoredValidators?: Record<string, unknown>;
  moduleName: string;
  validTypes: Set<string>;
  /** The schema currently being walked: `''` for the module's own, else an extension name. */
  source: string;
}

function describePath(context: SerializeContext, path: Array<string | number>): string {
  const where = path.length === 0 ? 'the root of the schema' : `'${path.join('.')}'`;
  return context.source === '' ? where : `${where} of extension '${context.source}'`;
}

function serializeSchema(
  node: unknown,
  path: Array<string | number>,
  context: SerializeContext,
): SerializedConfigSchema {
  if (typeof node !== 'object' || node === null || Array.isArray(node)) {
    context.errors.push(`Expected a config schema object at ${describePath(context, path)}, but found ${typeof node}.`);
    return {};
  }

  const source = node as Record<string, unknown>;
  const result: SerializedConfigSchema = {};

  for (const key of Object.keys(source)) {
    if (key === unrepresentableKey) {
      // An error rather than a silent skip, so that this file keeps its one rule: a module is
      // never handed configuration that differs from what it declared without the build saying so.
      context.errors.push(`The config option named '${key}' at ${describePath(context, path)} cannot be represented.`);
      continue;
    }

    if (!key.startsWith('_')) {
      result[key] = serializeSchema(source[key], [...path, key], context);
      continue;
    }

    // An underscore key the configuration system does not act on is tolerated and left out,
    // without comment. The artifact describes what the configuration system will do, and a key it
    // ignores is not part of that; reporting each one would only turn a schema's dead weight into
    // build noise for everyone downstream of it.
    if (!knownSchemaKeys.has(key)) {
      continue;
    }

    switch (key) {
      case '_type':
        result._type = serializeType(source._type, path, context);
        break;
      case '_description':
        if (typeof source._description === 'string') {
          result._description = source._description;
        } else {
          context.warnings.push(`Dropping non-string _description at ${describePath(context, path)}.`);
        }
        break;
      case '_elements':
        result._elements = serializeSchema(source._elements, [...path, '_elements'], context);
        break;
      case '_validators':
        result._validators = serializeValidators(source._validators, path, context);
        break;
      case '_default':
        // A `_default` of `undefined` is deliberately not emitted: JSON has no representation for
        // it, and the framework restores it when hydrating a node that has a `_type` but no
        // `_default`. Emitting `null` instead would change the value the module sees.
        if (source._default !== undefined) {
          result._default = serializeDefault(source._default, path, context);
        }
        break;
    }
  }

  return result;
}

function serializeType(value: unknown, path: Array<string | number>, context: SerializeContext): string | undefined {
  if (typeof value === 'string' && context.validTypes.has(value)) {
    return value;
  }

  context.errors.push(
    `Invalid _type ${JSON.stringify(value)} at ${describePath(context, path)}. ` +
      `Must be one of: ${[...context.validTypes].sort().join(', ')}.`,
  );

  return undefined;
}

/**
 * Checks that a default survives JSON unchanged, and returns it.
 *
 * Anything JSON would drop or silently convert is an error rather than a warning: a `Date` default
 * that becomes a string, or a function default that vanishes, changes what the module is
 * configured with, and the module author is the only one who can fix it.
 */
function serializeDefault(
  value: unknown,
  path: Array<string | number>,
  context: SerializeContext,
  subject: string = 'default',
  seen: Set<object> = new Set(),
): unknown {
  if (value === null) {
    return null;
  }

  // Caught here rather than left to the `typeof` checks below, which would report it as "a
  // undefined". JSON has no way to write it: inside an array it becomes `null`, and as an object
  // property it disappears, so either way the module would be handed something it did not declare.
  if (value === undefined) {
    context.errors.push(`The ${subject} at ${describePath(context, path)} is undefined, which JSON cannot represent.`);
    return undefined;
  }

  const valueType = typeof value;

  if (valueType === 'string' || valueType === 'boolean') {
    return value;
  }

  if (valueType === 'number') {
    if (!Number.isFinite(value as number)) {
      context.errors.push(
        `The ${subject} at ${describePath(context, path)} is ${String(value)}, which JSON cannot represent.`,
      );
      return undefined;
    }
    return value;
  }

  if (valueType !== 'object') {
    context.errors.push(
      `The ${subject} at ${describePath(context, path)} is a ${valueType}, which JSON cannot represent. ` +
        `Config defaults must be strings, numbers, booleans, null, arrays or plain objects.`,
    );
    return undefined;
  }

  const objectValue = value as object;

  if (seen.has(objectValue)) {
    context.errors.push(`The ${subject} at ${describePath(context, path)} contains a circular reference.`);
    return undefined;
  }

  const prototype = Object.getPrototypeOf(objectValue);

  if (Array.isArray(objectValue)) {
    seen.add(objectValue);
    const items = (objectValue as Array<unknown>).map((item, index) =>
      serializeDefault(item, [...path, index], context, subject, seen),
    );
    seen.delete(objectValue);
    return items;
  }

  if (prototype !== Object.prototype && prototype !== null) {
    context.errors.push(
      `The ${subject} at ${describePath(context, path)} is a ${objectValue.constructor?.name ?? 'class instance'}, ` +
        `which JSON cannot represent. Config defaults must be strings, numbers, booleans, null, arrays or plain objects.`,
    );
    return undefined;
  }

  seen.add(objectValue);
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(objectValue)) {
    if (key === unrepresentableKey) {
      context.errors.push(
        `The ${subject} at ${describePath(context, path)} has a key named '${key}', which cannot be represented.`,
      );
      continue;
    }

    const entry = (objectValue as Record<string, unknown>)[key];

    if (entry === undefined) {
      // JSON.stringify drops these silently, so the module would see a different object.
      context.errors.push(`The ${subject} at ${describePath(context, [...path, key])} is undefined, which JSON drops.`);
      continue;
    }

    result[key] = serializeDefault(entry, [...path, key], context, subject, seen);
  }

  seen.delete(objectValue);
  return result;
}

function serializeValidators(
  value: unknown,
  path: Array<string | number>,
  context: SerializeContext,
): Array<SerializedValidator> | undefined {
  if (!Array.isArray(value)) {
    context.errors.push(`_validators at ${describePath(context, path)} must be an array.`);
    return undefined;
  }

  const result: Array<SerializedValidator> = [];

  value.forEach((entry, index) => {
    const serialized = serializeValidator(entry, [...path, '_validators', index], context);

    if (serialized) {
      result.push(serialized);
    }
  });

  return result;
}

function serializeValidator(
  entry: unknown,
  path: Array<string | number>,
  context: SerializeContext,
): SerializedValidator | undefined {
  if (typeof entry !== 'function') {
    context.errors.push(
      `The validator at ${describePath(context, path)} is not a function. ` +
        `If it came from \`validators.<name>\`, that validator does not exist in the version of ` +
        `@openmrs/esm-framework this build tooling was built against, so the tooling needs upgrading.`,
    );
    return undefined;
  }

  const descriptor = getValidatorDescriptor(entry);

  if (descriptor) {
    if (descriptor.args.length === 0) {
      return { type: descriptor.type };
    }

    // A validator's arguments are as author-supplied as a default, and reach the framework the same
    // way, so they get the same check. Left unchecked, `inRange(0, Infinity)` would reach the
    // registry as `inRange(0, null)` and reject every value the module meant to allow.
    const args = serializeDefault(descriptor.args, [...path, 'args'], context, 'validator argument') as Array<unknown>;

    return { type: descriptor.type, args };
  }

  const exportName = findAuthoredExport(entry, context);

  if (exportName) {
    return { type: 'custom', export: exportName };
  }

  return transposeValidator(entry, path, context);
}

/**
 * Lifts a validator written inline in a schema into the module's `./config-validators` entry point,
 * by writing out the two arguments it was built from.
 *
 * This is what keeps that entry point worth having: the result is an ordinary named export the
 * bundler compiles, so loading it costs its own small chunk rather than the module it came from.
 *
 * Only possible when both arguments are self-contained. One that reads a constant from the module
 * it was written in would compile and then throw `ReferenceError` the first time an implementer's
 * configuration reached it, so that fails the build instead, naming what it read and where to put
 * it.
 */
function transposeValidator(
  entry: unknown,
  path: Array<string | number>,
  context: SerializeContext,
): SerializedValidator | undefined {
  const parts = getValidatorParts(entry);

  if (!parts) {
    context.errors.push(
      `The custom validator at ${describePath(context, path)} was not built with \`validator()\`, so it ` +
        `cannot be written into this module's config-validators entry point. Build it with ` +
        `\`validator(predicate, message)\`, or export it by name from src/config-validators.ts.`,
    );
    return undefined;
  }

  const name = mintTransposedName(context);
  const validationFunction = String(parts.validationFunction);
  const message = typeof parts.message === 'function' ? String(parts.message) : JSON.stringify(parts.message);

  const captured = [
    ...describeCaptures(validationFunction, 'predicate', path, context),
    ...(typeof parts.message === 'function' ? describeCaptures(message, 'message', path, context) : []),
  ];

  if (captured.length > 0) {
    return undefined;
  }

  context.transposedValidators.push({ name, validationFunction, message });

  return { type: 'custom', export: name };
}

/**
 * A name for a validator being lifted into the generated entry point, which nothing else there
 * already answers to.
 *
 * The generated module re-exports the module's own `config-validators` with `export *` and then
 * declares these alongside. A local declaration beats a star re-export silently, so a module that
 * happens to export something called `validator1` would otherwise have it replaced by a lifted
 * validator that has nothing to do with it.
 */
function mintTransposedName(context: SerializeContext): string {
  const taken = new Set([
    ...Object.keys(context.authoredValidators ?? {}),
    ...context.transposedValidators.map((transposed) => transposed.name),
  ]);

  for (let index = context.transposedValidators.length + 1; ; index++) {
    const candidate = `validator${index}`;

    if (!taken.has(candidate)) {
      return candidate;
    }
  }
}

/** Reports anything the given source reads from the module it was written in. */
function describeCaptures(
  source: string,
  part: string,
  path: Array<string | number>,
  context: SerializeContext,
): Array<string> {
  let free: Array<string>;

  try {
    free = findFreeVariables(source);
  } catch (error) {
    context.errors.push(
      `The ${part} of the custom validator at ${describePath(context, path)} could not be read: ${error}.`,
    );
    return ['unparseable'];
  }

  if (free.length > 0) {
    context.errors.push(
      `The ${part} of the custom validator at ${describePath(context, path)} uses ` +
        `${free.map(describeCapturedName).join(', ')}, which ${free.length === 1 ? 'is' : 'are'} defined in the ` +
        `module rather than in the validator, so it cannot be written into this module's config-validators ` +
        `entry point. Either inline what it reads, or move the validator to a named export in ` +
        `src/config-validators.ts.`,
    );
  }

  return free;
}

/**
 * Names a captured identifier, saying so when the name is the compiler's rather than the author's.
 *
 * What is read here is the validator as the child build compiled it, not as it was written, so a
 * reference to an imported binding may have become something like
 * `_config_constants__WEBPACK_IMPORTED_MODULE_2__`, which appears nowhere in the author's source.
 * The name is always quoted, since it is the only handle on which reference is meant; the gloss is
 * added only where the shape is unmistakable, so that a local called `_private__` is never
 * described as something it is not.
 */
function describeCapturedName(name: string): string {
  return name.includes('__WEBPACK_IMPORTED_MODULE_') ? `\`${name}\` (a value imported into the module)` : `\`${name}\``;
}

function findAuthoredExport(entry: unknown, context: SerializeContext): string | undefined {
  if (!context.authoredValidators) {
    return undefined;
  }

  for (const [name, exported] of Object.entries(context.authoredValidators)) {
    if (exported === entry) {
      return name;
    }
  }

  return undefined;
}
