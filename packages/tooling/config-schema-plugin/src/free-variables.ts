import { parseSync } from '@swc/core';

/**
 * Finds the names a function body reads from outside itself.
 *
 * A custom validator written inline in a schema is lifted into the module's `./config-validators`
 * entry point by copying its source there. That only works if the function is self-contained: one
 * that reads a constant from the module it was written in compiles fine and then throws
 * `ReferenceError` the first time it runs, in production, in a code path an implementer triggers.
 * So the lift is refused unless this returns nothing.
 *
 * Names are collected from anywhere in the function and bindings are subtracted the same way,
 * without modelling nested scopes. The one thing that gets past it is a name declared in an inner
 * scope and captured in an outer one: `a.length < limit && a.every((b) => { const limit = ...; })`
 * reads as fully bound. Modelling scopes properly is the fix, and is more machinery than the
 * handful of validators this runs over has ever warranted; a body involved enough to shadow its
 * own names is one worth writing as a named export instead.
 *
 * Erring the other way is worse, because it is not a limitation but an accusation: a validator
 * reported as capturing something it does not cannot be made to pass, and the message names an
 * identifier the author cannot do anything about. So property names, member names and labels are
 * all excluded explicitly rather than swept up and left for the binding pass to cancel out.
 */

/**
 * Globals a transposed function may use.
 *
 * An allowlist rather than a check against the build's own `globalThis`, which would wave through
 * Node-only globals that do not exist in the browser the validator actually runs in. It therefore
 * has to carry the browser's own globals as well as the language's, since a validator that reads
 * `window` is reading something that will be there.
 */
const allowedGlobals = new Set([
  'AbortController',
  'AggregateError',
  'Array',
  'ArrayBuffer',
  'Atomics',
  'BigInt',
  'BigInt64Array',
  'BigUint64Array',
  'Blob',
  'Boolean',
  'DataView',
  'Date',
  'Error',
  'EvalError',
  'Float32Array',
  'Float64Array',
  'FormData',
  'Headers',
  'Infinity',
  'Int16Array',
  'Int32Array',
  'Int8Array',
  'Intl',
  'JSON',
  'Map',
  'Math',
  'NaN',
  'Number',
  'Object',
  'Promise',
  'Proxy',
  'RangeError',
  'ReferenceError',
  'Reflect',
  'RegExp',
  'Request',
  'Response',
  'Set',
  'String',
  'Symbol',
  'SyntaxError',
  'TextDecoder',
  'TextEncoder',
  'TypeError',
  'URIError',
  'URL',
  'URLSearchParams',
  'Uint16Array',
  'Uint32Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'WeakMap',
  'WeakRef',
  'WeakSet',
  'atob',
  'btoa',
  'clearInterval',
  'clearTimeout',
  'console',
  'crypto',
  'decodeURI',
  'decodeURIComponent',
  'document',
  'encodeURI',
  'encodeURIComponent',
  'fetch',
  'globalThis',
  'isFinite',
  'isNaN',
  'localStorage',
  'location',
  'navigator',
  'parseFloat',
  'parseInt',
  'performance',
  'queueMicrotask',
  'sessionStorage',
  'setInterval',
  'setTimeout',
  'structuredClone',
  'undefined',
  'window',
]);

/**
 * Names in scope inside a function without the function declaring them.
 *
 * `arguments` is bound by every non-arrow function. A module has no `arguments` of its own for one
 * to capture, since a module is not a function, so a reference to it is never the capture this is
 * looking for.
 */
const implicitBindings = new Set(['arguments']);

/**
 * Node types whose `key` names a member rather than reading a variable: `{ a: b }`, `{ a() {} }`,
 * `get a() {}`, and their class equivalents. A computed key is an expression and does get read.
 */
const memberNamedByKey = new Set([
  'KeyValueProperty',
  'MethodProperty',
  'GetterProperty',
  'SetterProperty',
  'ClassMethod',
  'ClassProperty',
  'PrivateMethod',
  'PrivateProperty',
]);

type Node = Record<string, any>;

/** Collects the names a binding pattern introduces: `a`, `{a, b: c}`, `[a]`, `a = 1`, `...rest`. */
function collectPattern(node: unknown, into: Set<string>): void {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    node.forEach((child) => collectPattern(child, into));
    return;
  }

  const current = node as Node;

  switch (current.type) {
    case 'Identifier':
      into.add(current.value);
      return;
    // An arrow's parameters are patterns directly; a function's are wrapped, under either name
    // depending on the swc version.
    case 'Param':
    case 'Parameter':
      collectPattern(current.pat, into);
      return;
    case 'ArrayPattern':
      collectPattern(current.elements, into);
      return;
    case 'ObjectPattern':
      collectPattern(current.properties, into);
      return;
    // `{ a: b }` binds `b`; `a` is a property name.
    case 'KeyValuePatternProperty':
      collectPattern(current.value, into);
      return;
    // `{ a = 1 }` binds `a`, and its default is an expression rather than a pattern.
    case 'AssignmentPatternProperty':
      collectPattern(current.key, into);
      return;
    case 'AssignmentPattern':
      collectPattern(current.left, into);
      return;
    case 'RestElement':
      collectPattern(current.argument, into);
      return;
    default:
      return;
  }
}

/** Collects every name the function binds: parameters, locals, and nested declarations. */
function collectBindings(node: unknown, into: Set<string>): void {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    node.forEach((child) => collectBindings(child, into));
    return;
  }

  const current = node as Node;

  // Anything that takes parameters binds them, whichever kind of function it is.
  if (Array.isArray(current.params)) {
    collectPattern(current.params, into);
  }

  switch (current.type) {
    case 'VariableDeclarator':
      collectPattern(current.id, into);
      break;
    case 'FunctionDeclaration':
    case 'ClassDeclaration':
    case 'FunctionExpression':
    case 'ClassExpression':
      collectPattern(current.identifier, into);
      break;
    // A `catch (e)` binds `e`, and an object literal's setter binds its single parameter, which is
    // `param` rather than the `params` array every other kind of function uses.
    case 'CatchClause':
    case 'SetterProperty':
      collectPattern(current.param, into);
      break;
    default:
      break;
  }

  for (const key of Object.keys(current)) {
    if (key !== 'span') {
      collectBindings(current[key], into);
    }
  }
}

/** Collects every name the function reads, ignoring property names and object keys. */
function collectReferences(node: unknown, into: Set<string>): void {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    node.forEach((child) => collectReferences(child, into));
    return;
  }

  const current = node as Node;

  if (current.type === 'Identifier') {
    into.add(current.value);
    return;
  }

  if (current.type === 'MemberExpression') {
    collectReferences(current.object, into);

    // `a[b]` reads `b`; `a.b` does not.
    if (current.property?.type === 'Computed') {
      collectReferences(current.property, into);
    }

    return;
  }

  if (current.type === 'KeyValuePatternProperty') {
    // `const { a: b } = x` binds `b`; `a` names the property being read off `x`, not a variable.
    collectReferences(current.value, into);
    return;
  }

  if (current.type === 'LabeledStatement') {
    // `outer: for (...)` and the `break outer` that matches it name a label, not a variable.
    collectReferences(current.body, into);
    return;
  }

  if (current.type === 'BreakStatement' || current.type === 'ContinueStatement') {
    return;
  }

  if (memberNamedByKey.has(current.type)) {
    if (current.key?.type === 'Computed') {
      collectReferences(current.key, into);
    }

    for (const key of Object.keys(current)) {
      if (key !== 'span' && key !== 'key') {
        collectReferences(current[key], into);
      }
    }

    return;
  }

  for (const key of Object.keys(current)) {
    if (key !== 'span') {
      collectReferences(current[key], into);
    }
  }
}

/**
 * Returns the names `source` reads from its surrounding scope, sorted, or an empty array when it
 * reads none and can therefore be lifted.
 *
 * @param source The function's source, as `Function.prototype.toString` gives it.
 * @throws If the source cannot be parsed, which means it cannot be lifted either.
 */
export function findFreeVariables(source: string): Array<string> {
  // Wrapped so that a bare arrow or an anonymous function expression parses. A method shorthand,
  // which `Function.prototype.toString` also produces, does not parse even wrapped; it throws here
  // and the caller turns that into a failed build, which is the outcome that matters, since its
  // source could not be written into the generated entry point either.
  const ast = parseSync(`(${source})`, { syntax: 'ecmascript', target: 'es2022' });

  const bindings = new Set<string>();
  const references = new Set<string>();

  collectBindings(ast, bindings);
  collectReferences(ast, references);

  return [...references]
    .filter((name) => !bindings.has(name) && !allowedGlobals.has(name) && !implicitBindings.has(name))
    .sort();
}
