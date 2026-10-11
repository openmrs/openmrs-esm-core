/**
 * Runs an extraction bundle and reports what the module's `startupApp()` declared.
 *
 * A separate process for three reasons: the bundle needs browser globals installed, which would
 * otherwise leak into the build; module-scope code in a real module can throw or hang, and a child
 * can be killed; and a native crash becomes an exit code rather than a dead build.
 *
 * Serialization happens here rather than in the parent because it works off live function
 * identities, matching a validator against the module's exports, and those do not survive being
 * sent between processes.
 */
import { serializeArtifact } from './serialize';
import type { RecordedSchemas, SerializeResult } from './types';

export interface RunnerRequest {
  bundlePath: string;
  moduleName: string;
}

export type RunnerResponse = { ok: true; result: SerializeResult } | { ok: false; error: string };

/**
 * Installs a global, working around the ones Node defines as getter-only, `navigator` among them,
 * which plain assignment throws on.
 */
function defineGlobal(key: string, value: unknown): void {
  try {
    Object.defineProperty(globalThis, key, { value, writable: true, configurable: true });
  } catch {
    // A global that refuses to be replaced is left as Node's. Whether that matters only shows up
    // as a failure to import the module, which is reported with its own stack.
  }
}

/**
 * Whether a function taken off `window` needs to keep `window` as its receiver.
 *
 * Only methods do. Binding a DOM interface such as `HTMLCollection` would strip the `prototype`
 * off it, which breaks `new`, `instanceof`, and libraries that patch the prototype: flatpickr,
 * reached through Carbon's barrel, does exactly that.
 */
function shouldBind(key: string, value: () => unknown): boolean {
  if (/^[A-Z]/.test(key)) {
    return false;
  }

  return !Function.prototype.toString.call(value).startsWith('class');
}

/**
 * The globals Node keeps, where happy-dom also defines one of its own.
 *
 * Everything else that happy-dom provides wins, because `window` and `document` come from
 * happy-dom and a web-platform object has to match the window it is used with: Node and happy-dom
 * both define `Event`, and `window.dispatchEvent(new Event(...))` throws unless the two are the
 * same class.
 *
 * This is the list rather than its complement because happy-dom runs in its own VM realm, so its
 * `Object`, `Array` and `Promise` are different classes from the ones the module's own code is
 * compiled against. Taking those would break `instanceof` and every prototype check in the
 * serializer. The language's intrinsics are also a fixed set, where the web platform's are not:
 * each Node release adopts more of them, and the list that has to keep up should be the one that
 * does not keep growing.
 */
const nodeOwnedGlobals = new Set([
  // ECMAScript intrinsics, which must stay in the realm the module's code runs in.
  'AggregateError',
  'Array',
  'ArrayBuffer',
  'Atomics',
  'BigInt',
  'BigInt64Array',
  'BigUint64Array',
  'Boolean',
  'DataView',
  'Date',
  'Error',
  'EvalError',
  'FinalizationRegistry',
  'Float16Array',
  'Float32Array',
  'Float64Array',
  'Function',
  'Int16Array',
  'Int32Array',
  'Int8Array',
  'Intl',
  'JSON',
  'Map',
  'Math',
  'Number',
  'Object',
  'Promise',
  'Proxy',
  'RangeError',
  'ReferenceError',
  'Reflect',
  'RegExp',
  'Set',
  'SharedArrayBuffer',
  'String',
  'Symbol',
  'SyntaxError',
  'TypeError',
  'URIError',
  'Uint16Array',
  'Uint32Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'WeakMap',
  'WeakRef',
  'WeakSet',
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',
  'escape',
  'eval',
  'global',
  'globalThis',
  'isFinite',
  'isNaN',
  'parseFloat',
  'parseInt',
  'structuredClone',
  'unescape',
  // Node's own, which the runner and the module's imports both need to keep working.
  'Buffer',
  'clearImmediate',
  'clearInterval',
  'clearTimeout',
  // Node's, so that anything a module logs while being imported reaches the build output. Only
  // for a bare `console`: `window.console` is happy-dom's, which buffers rather than prints.
  'console',
  // The fetch family goes together, all of it Node's. `fetch` is Node's because happy-dom's
  // enforces CORS and mixed-content rules that have no meaning in a build, and resolves a relative
  // URL against `http://localhost/` where Node's throws; both of them reach the real network. The
  // rest follow it because Node's `fetch` type-checks what it is handed, so a happy-dom
  // `AbortSignal` makes it throw rather than fetch.
  'AbortController',
  'AbortSignal',
  'Blob',
  'File',
  'FormData',
  'Headers',
  'ReadableStream',
  'Request',
  'Response',
  'TransformStream',
  'WritableStream',
  'fetch',
  'process',
  'queueMicrotask',
  'setImmediate',
  'setInterval',
  'setTimeout',
]);

/**
 * Installs the browser globals a module's entry point may touch while being imported.
 *
 * Nothing is rendered, so this only has to cover what runs at module scope. happy-dom rather than a
 * hand-written stub because real modules reach for more of the DOM than is worth guessing at.
 */
function installDomGlobals(): void {
  // Required lazily so that importing this module for its types does not construct a DOM.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Window } = require('happy-dom');
  const window = new Window({ url: 'http://localhost/' });
  const source = window as unknown as Record<string, unknown>;

  // Copied wholesale rather than named one at a time: the point of running under happy-dom is not
  // to guess which parts of the DOM a module touches while it is being imported.
  for (const key of Object.getOwnPropertyNames(source)) {
    if (key === 'undefined' || nodeOwnedGlobals.has(key)) {
      continue;
    }

    const value = source[key];
    const bindable = typeof value === 'function' && shouldBind(key, value as () => unknown);

    defineGlobal(key, bindable ? (value as () => unknown).bind(window) : value);
  }

  for (const key of ['window', 'document', 'navigator', 'location', 'history', 'localStorage', 'sessionStorage']) {
    defineGlobal(key, key === 'window' ? window : source[key]);
  }

  // The app shell defines these before any module loads, and a module is entitled to read them at
  // module scope.
  const openmrsGlobals: Record<string, unknown> = {
    openmrsBase: '/openmrs',
    spaBase: '/openmrs/spa',
    spaEnv: 'production',
    spaVersion: 'local',
    getOpenmrsSpaBase: () => '/openmrs/spa/',
  };

  for (const [key, value] of Object.entries(openmrsGlobals)) {
    defineGlobal(key, value);
    source[key] = value;
  }
}

export async function runExtraction(request: RunnerRequest): Promise<SerializeResult> {
  installDomGlobals();

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bundle = require(request.bundlePath);
  const extract = bundle?.extract ?? bundle?.default?.extract;

  if (typeof extract !== 'function') {
    throw new Error('The extraction bundle did not export an `extract` function. This is a bug in the plugin.');
  }

  // Awaited because `startupApp` may be async, in which case the schemas are not recorded until it
  // settles. A rejection has to arrive here as well, so that it is reported as a failed extraction
  // rather than as an unhandled rejection racing this process on its way out.
  const { recorded, authoredValidators, validTypes } = (await extract()) as {
    recorded: RecordedSchemas;
    authoredValidators?: Record<string, unknown>;
    validTypes: Array<string>;
  };

  return serializeArtifact(recorded, { moduleName: request.moduleName, authoredValidators, validTypes });
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? `${error.name}: ${error.message}`;
  }

  return String(error);
}

if (require.main === module) {
  process.on('message', async (request: RunnerRequest) => {
    let response: RunnerResponse;

    try {
      response = { ok: true, result: await runExtraction(request) };
    } catch (error) {
      response = { ok: false, error: describeError(error) };
    }

    process.send?.(response, () => process.exit(response.ok ? 0 : 1));
  });
}
