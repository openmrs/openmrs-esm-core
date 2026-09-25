/**
 * Stands in for `@openmrs/esm-framework` while a module's `startupApp()` runs under Node, so that
 * the schemas it declares can be captured without a browser or a running framework.
 *
 * Extraction imports the module's real entry point, which transitively imports its whole component
 * tree. That code only *references* most of what it pulls from the framework, but it does call some
 * of it at module scope, as in `getSyncLifecycle(...)` or `registerBreadcrumbs(...)`, so every name has to
 * resolve to something callable rather than `undefined`. Hence the catch-all: known names get real
 * behavior, everything else gets a stub that tolerates being called, constructed, and read through.
 *
 * This is a CommonJS module deliberately. A static list of ESM exports cannot be a catch-all, and
 * both bundlers fall back to runtime property access when they cannot statically determine a CJS
 * module's exports.
 */
import { Type, validator, validators } from '@openmrs/esm-config/schema';

interface RecordedSchemas {
  modules: Record<string, unknown>;
  extensions: Record<string, unknown>;
}

// Null-prototype maps: these are keyed by names the module chooses, and on an ordinary object
// assigning `__proto__` sets the prototype instead of adding a key, so a schema declared under that
// name would vanish without a word.
const recorded: RecordedSchemas = { modules: Object.create(null), extensions: Object.create(null) };

/**
 * A value that survives whatever module-scope code does to it: calling, constructing, reading a
 * property, or coercing it to a string. Returns another stub from every operation.
 */
function createStub(): unknown {
  const target = function stub() {} as Record<string | symbol, unknown> & (() => void);

  return new Proxy(target, {
    get(_target, property) {
      // Reading these has meaning elsewhere, and answering with a stub would mislead: a thenable
      // would be awaited forever, and an iterable would be spread into nonsense.
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
  // Read here rather than in the serializer, which runs in the build, is CommonJS, and so cannot
  // import the framework at all. These are this package's own `Type` values, not the module's: the
  // module's framework import is aliased to this file, so there is no other copy to read.
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
