/**
 * Stands in for `@openmrs/esm-framework` while a module's `startupApp()` runs under Node, recording
 * the schemas it declares.
 *
 * The module's component tree calls framework functions at module scope, such as
 * `getSyncLifecycle(...)`, so every name must resolve to something callable. Config functions behave
 * for real; everything else is a stub that tolerates being called, constructed, and read through.
 *
 * CommonJS so that the exports can be a catch-all: both bundlers fall back to runtime property
 * access when they cannot determine a CJS module's exports statically.
 */
import { Type, validator, validators } from '@openmrs/esm-config/schema';

interface RecordedSchemas {
  modules: Record<string, unknown>;
  extensions: Record<string, unknown>;
}

// Null-prototype, so a schema declared under the name `__proto__` is recorded rather than setting
// the prototype.
const recorded: RecordedSchemas = { modules: Object.create(null), extensions: Object.create(null) };

/**
 * A value that survives whatever module-scope code does to it: calling, constructing, reading a
 * property, or coercing it to a string. Returns another stub from every operation.
 */
function createStub(): unknown {
  const target = function stub() {} as Record<string | symbol, unknown> & (() => void);

  return new Proxy(target, {
    get(_target, property) {
      // A stub thenable would be awaited forever, and a stub iterable spread into nonsense.
      if (property === 'then' || property === Symbol.iterator || property === Symbol.asyncIterator) {
        return undefined;
      }

      if (property === Symbol.toPrimitive || property === 'toString' || property === 'valueOf') {
        return () => '';
      }

      if (property === Symbol.toStringTag) {
        return 'OpenmrsFrameworkStub';
      }

      if (property === '__esModule') {
        return false;
      }

      return createStub();
    },
    apply() {
      return createStub();
    },
    construct() {
      return createStub() as object;
    },
    has() {
      return true;
    },
  });
}

function defineConfigSchema(moduleName: string, schema: unknown): void {
  recorded.modules[moduleName] = schema;
}

function defineExtensionConfigSchema(extensionName: string, schema: unknown): void {
  recorded.extensions[extensionName] = schema;
}

/** Everything the extraction needs to behave for real. Every other name gets a stub. */
const real: Record<string, unknown> = {
  Type,
  validator,
  validators,
  defineConfigSchema,
  defineExtensionConfigSchema,
  getRecordedSchemas: (): RecordedSchemas => recorded,
  // Read here because the serializer cannot import the framework. These are the same `Type` values
  // the module sees, since its framework import is aliased to this file.
  getValidTypes: (): Array<string> => Object.values(Type),
};

const shim = new Proxy(real, {
  get(target, property) {
    if (property === '__esModule') {
      return true;
    }

    if (Object.hasOwn(target, property)) {
      return target[property as string];
    }

    // `then` matters here too: a bundler that treats the module namespace as a promise would
    // await it, and the import would never resolve.
    if (property === 'then' || property === Symbol.toStringTag) {
      return undefined;
    }

    return createStub();
  },
  has() {
    return true;
  },
});

export = shim;
