import type { SerializedConfigSchema, SerializedValidator } from '@openmrs/esm-globals';
import { type ConfigSchema, type Validator, Type } from '../types';
import { getValidatorDescriptor } from '../validators/descriptor';
import { validators } from '../validators/validators';

/**
 * Turns a configuration schema that has been through JSON back into one the config system can use.
 *
 * The inverse of what `@openmrs/config-schema-plugin` writes into a module's `config-schema.json`.
 * Two things do not survive JSON and have to be put back: validators, which are written down as
 * references into the framework's vocabulary rather than as functions, and a `_default` of
 * `undefined`, which `JSON.stringify` drops the key for entirely.
 *
 * Problems are reported rather than thrown. A schema that is partly wrong still configures the keys
 * that are right, which is better than a module having no configuration at all; and since this runs
 * over every module in the distribution at boot, throwing would make one bad artifact fatal for
 * everything.
 */

/**
 * The one key a schema rebuilt by assignment cannot carry.
 *
 * `__proto__` is an accessor on `Object.prototype`, so assigning it sets the prototype instead of
 * adding a key and the value disappears. `constructor` and `prototype` are ordinary data
 * properties: assigning either shadows the inherited one and is harmless, so they are hydrated like
 * any other key. The serializer makes exactly the same distinction, and the two have to agree or a
 * module loses a configuration option somewhere between its build and its boot.
 */
const forbiddenKey = '__proto__';

export interface HydrationProblem {
  /** Where in the schema the problem is, as a dotted path. */
  keyPath: string;
  message: string;
}

export interface HydrationResult {
  schema: ConfigSchema;
  problems: Array<HydrationProblem>;
  /**
   * Custom validators that could not be resolved, by the name they are exported under. Empty when
   * no resolver was supplied and the schema has none, or when every one of them resolved.
   */
  unresolvedValidators: Array<string>;
}

/**
 * Resolves a `{"type": "custom", "export": "..."}` reference to the function it names, which lives
 * in the owning module's `./config-validators` entry point. Returning `undefined` leaves the
 * validator out.
 */
export type CustomValidatorResolver = (exportName: string) => Validator | undefined;

export function hydrateConfigSchema(
  serialized: SerializedConfigSchema,
  resolveCustomValidator?: CustomValidatorResolver,
): HydrationResult {
  const problems: Array<HydrationProblem> = [];
  const unresolvedValidators: Array<string> = [];
  const context = { problems, unresolvedValidators, resolveCustomValidator };

  if (!isSchemaNode(serialized, '', context)) {
    return { schema: {}, problems, unresolvedValidators };
  }

  const schema = hydrateNode(serialized, '', context);

  return { schema, problems, unresolvedValidators };
}

interface HydrationContext {
  problems: Array<HydrationProblem>;
  unresolvedValidators: Array<string>;
  resolveCustomValidator?: CustomValidatorResolver;
}

function hydrateNode(serialized: SerializedConfigSchema, keyPath: string, context: HydrationContext): ConfigSchema {
  const node: ConfigSchema = {};
  let hasChildKeys = false;

  for (const key of Object.keys(serialized)) {
    const thisKeyPath = keyPath + (keyPath && '.') + key;

    if (key === forbiddenKey) {
      context.problems.push({
        keyPath: thisKeyPath,
        message: `'${key}' cannot be used as a configuration key.`,
      });
      continue;
    }

    const value = serialized[key];

    switch (key) {
      case '_type':
        hydrateType(node, value, thisKeyPath, context);
        break;

      case '_default':
        node._default = value as ConfigSchema['_default'];
        break;

      case '_description':
        node._description = value as string;
        break;

      case '_validators':
        node._validators = hydrateValidators(value, thisKeyPath, context);
        break;

      case '_elements':
        if (isSchemaNode(value, thisKeyPath, context)) {
          node._elements = hydrateNode(value, thisKeyPath, context);
        }

        break;

      default:
        if (key.startsWith('_')) {
          // Tolerated but not echoed: an underscore key this version does not know about is either
          // something a newer framework understands or something that never existed.
          break;
        }

        if (isSchemaNode(value, thisKeyPath, context)) {
          hasChildKeys = true;
          node[key] = hydrateNode(value, thisKeyPath, context);
        }

        break;
    }
  }

  // JSON cannot write `_default: undefined`, so the serializer omits the key and this puts it back.
  // Without it `validateConfigSchema` rejects the node for having no default at all, which is what
  // a leaf like `Display conditions.expression` would otherwise hit.
  if (node._type !== undefined && !Object.hasOwn(node, '_default') && !hasChildKeys) {
    node._default = undefined;
  }

  return node;
}

/**
 * Whether a value can be walked as a schema node at all.
 *
 * Only ever false for a schema nobody generated: the serializer cannot produce one of these. A
 * hand-written `config-schema.json` is a supported input and nothing validates its shape, so a
 * string here would otherwise recurse forever, `Object.keys('ab')` being `['0', '1']` and
 * `'ab'[0]` being another one-character string.
 */
function isSchemaNode(value: unknown, keyPath: string, context: HydrationContext): value is SerializedConfigSchema {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return true;
  }

  context.problems.push({
    keyPath,
    message: `A schema entry must be an object. Received ${JSON.stringify(value) ?? String(value)}.`,
  });

  return false;
}

function hydrateType(node: ConfigSchema, value: unknown, keyPath: string, context: HydrationContext): void {
  const known = Object.values(Type).find((candidate) => candidate === value);

  if (known === undefined) {
    context.problems.push({
      keyPath,
      message:
        `'${String(value)}' is not a configuration type. The allowed types are ` +
        `${Object.values(Type).join(', ')}. This usually means the framework is older than the ` +
        `build tooling that produced the schema.`,
    });
    return;
  }

  node._type = known;
}

function hydrateValidators(value: unknown, keyPath: string, context: HydrationContext): Array<Validator> {
  if (!Array.isArray(value)) {
    context.problems.push({ keyPath, message: `Validators must be an array. Received ${JSON.stringify(value)}.` });
    return [];
  }

  const hydrated: Array<Validator> = [];

  for (const entry of value) {
    const validator = hydrateValidator(entry, keyPath, context);

    if (validator) {
      hydrated.push(validator);
    }
  }

  return hydrated;
}

function hydrateValidator(
  entry: SerializedValidator,
  keyPath: string,
  context: HydrationContext,
): Validator | undefined {
  if (!entry || typeof entry !== 'object' || typeof entry.type !== 'string') {
    context.problems.push({ keyPath, message: `Not a validator: ${JSON.stringify(entry)}.` });
    return undefined;
  }

  if (isCustomValidator(entry)) {
    // Checked rather than assumed: without it a hand-written `{"type": "custom"}` is chased
    // through the resolver and comes back as a missing export named `undefined`.
    if (typeof entry.export !== 'string') {
      context.problems.push({
        keyPath,
        message: `A custom validator must name the export it comes from. Received ${JSON.stringify(entry)}.`,
      });
      return undefined;
    }

    if (!context.resolveCustomValidator) {
      context.unresolvedValidators.push(entry.export);
      return undefined;
    }

    const resolved = context.resolveCustomValidator(entry.export);

    if (typeof resolved !== 'function') {
      context.unresolvedValidators.push(entry.export);
      context.problems.push({
        keyPath,
        message: `'${entry.export}' is not exported by the module's ./config-validators entry point.`,
      });
      return undefined;
    }

    return resolved;
  }

  const builtIn = Object.hasOwn(validators, entry.type)
    ? (validators as Record<string, unknown>)[entry.type]
    : undefined;

  if (builtIn === undefined) {
    context.problems.push({
      keyPath,
      message:
        `'${entry.type}' is not a validator this version of the framework knows about. This usually ` +
        `means the framework is older than the build tooling that produced the schema.`,
    });
    return undefined;
  }

  // Whether the name refers to a validator or to something that builds one is decided by asking
  // what it is, not by whether the schema recorded arguments for it. Every built-in validator
  // carries a descriptor and a factory does not, so a schema naming `oneOf` with no arguments, or
  // `isUrl` with some, is rejected here rather than installing a "validator" that throws or that
  // silently never fires. Nothing the serializer emits can hit either case; a hand-written
  // `config-schema.json` can, and nothing else checks one.
  if (entry.args === undefined) {
    if (getValidatorDescriptor(builtIn) === undefined) {
      context.problems.push({ keyPath, message: `'${entry.type}' needs arguments, which this schema gives none of.` });
      return undefined;
    }

    return builtIn as Validator;
  }

  if (typeof builtIn !== 'function' || getValidatorDescriptor(builtIn) !== undefined) {
    context.problems.push({ keyPath, message: `'${entry.type}' does not take arguments.` });
    return undefined;
  }

  let built: unknown;

  try {
    built = (builtIn as (...args: Array<unknown>) => unknown)(...entry.args);
  } catch (e) {
    context.problems.push({
      keyPath,
      message: `'${entry.type}' could not be built from ${JSON.stringify(entry.args)}: ${e}`,
    });
    return undefined;
  }

  if (getValidatorDescriptor(built) === undefined) {
    context.problems.push({
      keyPath,
      message: `'${entry.type}' did not produce a validator from ${JSON.stringify(entry.args)}.`,
    });
    return undefined;
  }

  return built as Validator;
}

function isCustomValidator(entry: SerializedValidator): entry is { type: 'custom'; export: string } {
  return Boolean(entry) && typeof entry === 'object' && entry.type === 'custom';
}
