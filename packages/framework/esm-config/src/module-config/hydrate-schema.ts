import type { SerializedConfigSchema, SerializedValidator } from '@openmrs/esm-globals';
import { type ConfigSchema, type Validator, Type } from '../types';
import { getValidatorDescriptor } from '../validators/descriptor';
import { validators } from '../validators/validators';

/**
 * The one key a schema rebuilt by assignment cannot carry: assigning `__proto__` sets the prototype
 * instead of adding a key. `constructor` and `prototype` are hydrated like any other key. The
 * serializer must make the same distinction, or an option is lost between build and boot.
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

/**
 * Turns a configuration schema that has been through JSON, such as the `config-schema.json`
 * `@openmrs/config-schema-plugin` writes, back into one the config system can use. Restores the
 * validators, which are serialized as references, and any `_default` of `undefined`, which JSON
 * drops.
 *
 * Problems are reported rather than thrown, so a partly wrong schema still configures its valid
 * keys and one bad artifact cannot break the whole application at boot.
 *
 * @param resolveCustomValidator Resolves custom validator references. Without it they are left out
 *   and listed in `unresolvedValidators`.
 */
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
          // Ignored: an unknown underscore key may be one a newer framework understands.
          break;
        }

        if (isSchemaNode(value, thisKeyPath, context)) {
          hasChildKeys = true;
          node[key] = hydrateNode(value, thisKeyPath, context);
        }

        break;
    }
  }

  // Restores the `_default: undefined` JSON could not write, without which `validateConfigSchema`
  // rejects the node for having no default.
  if (node._type !== undefined && !Object.hasOwn(node, '_default') && !hasChildKeys) {
    node._default = undefined;
  }

  return node;
}

/**
 * Whether a value can be walked as a schema node. Only a hand-written `config-schema.json` can fail
 * this, and without the check a string would recurse forever (`Object.keys('ab')` is `['0', '1']`).
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
    // Otherwise a hand-written `{"type": "custom"}` is reported as a missing export named `undefined`.
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

  // Validator or factory is decided by the descriptor, not by whether `args` were recorded, so a
  // hand-written schema naming `oneOf` without arguments, or `isUrl` with some, is rejected rather
  // than installing a validator that throws or never fires.
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
