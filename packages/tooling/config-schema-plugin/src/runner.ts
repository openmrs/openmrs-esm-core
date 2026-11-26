/**
 * Runs an extraction bundle and reports what the module's `startupApp()` declared.
 *
 * A separate process so that browser globals do not leak into the build, and a module that hangs
 * or crashes can be killed or reported.
 *
 * Serializes here rather than in the parent because matching validators against the module's
 * exports needs live function identities.
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
    // Left as Node's. If that matters, importing the module fails with its own stack.
  }
}

/**
 * Whether a function taken off `window` needs `window` as its receiver. Only methods do: binding a
 * DOM interface such as `HTMLCollection` strips its `prototype`, breaking `new`, `instanceof`, and
 * libraries that patch it, such as flatpickr.
 */
function shouldBind(key: string, value: () => unknown): boolean {
  if (/^[A-Z]/.test(key)) {
    return false;
  }

  return !Function.prototype.toString.call(value).startsWith('class');
}

/**
 * Globals where Node's definition wins over happy-dom's. Everything else comes from happy-dom,
 * because web-platform objects must match the `window` they are used with:
 * `window.dispatchEvent(new Event(...))` throws if `Event` is Node's.
 *
 * Node's side is listed because it is the stable one: the language intrinsics are a fixed set, and
 * happy-dom's live in another VM realm, which would break `instanceof` checks in the serializer.
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
  // The fetch family is all Node's: happy-dom's `fetch` enforces CORS rules that mean nothing in a
  // build, and Node's `fetch` rejects a happy-dom `AbortSignal`, so the rest follow it.
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
 * Installs the browser globals a module's entry point may touch at module scope, from happy-dom
 * rather than a stub because real modules reach for more of the DOM than is worth guessing at.
 */
function installDomGlobals(): void {
  // Required lazily so that importing this module for its types does not construct a DOM.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Window } = require('happy-dom');
  const window = new Window({ url: 'http://localhost/' });
  const source = window as unknown as Record<string, unknown>;

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

  // `startupApp` may be async. Awaiting also reports a rejection as a failed extraction rather than
  // an unhandled rejection.
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
