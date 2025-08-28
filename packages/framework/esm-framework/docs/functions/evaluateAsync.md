[O3 Framework](../API.md) / evaluateAsync

# Function: evaluateAsync()

> **evaluateAsync**(`expression`, `variables`): `Promise`\<[`DefaultEvaluateReturnType`](../type-aliases/DefaultEvaluateReturnType.md)\>

Defined in: [packages/framework/esm-expression-evaluator/src/evaluator.ts:167](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-expression-evaluator/src/evaluator.ts#L167)

`evaluateAsync()` implements a relatively safe version of `eval()` that can evaluate Javascript expressions
that use Promises. This allows us to safely add features that depend on user-supplied code without
polluting the global namespace or needing to support `eval()` and the like.

By default it supports any expression that evalutes to a string, number, boolean, Date, null, or undefined.
Other values will result in an error.

## Parameters

### expression

The expression to evaluate, either as a string or pre-parsed expression

`string` | `Expression`

### variables

[`VariablesMap`](../type-aliases/VariablesMap.md) = `{}`

Optional object which contains any variables, functions, etc. that will be available to
 the expression.

## Returns

`Promise`\<[`DefaultEvaluateReturnType`](../type-aliases/DefaultEvaluateReturnType.md)\>

The result of evaluating the expression

## Examples

```ts
// shouldDisplayOptionalData will be false
const shouldDisplayOptionalData = await evaluateAsync('Promise.resolve(!isEmpty(array))', {
 array: [],
 isEmpty(arr: unknown) {
  return Array.isArray(arr) && arr.length === 0;
 }
})
```

Since this only implements the expression lanaguage part of Javascript, there is no support for assigning
values, creating functions, or creating objects, so the following will throw an error:

```ts
evaluateAsync('var a = 1; a');
```

In addition to string expressions, `evaluate()` can use an existing `jsep.Expression`, such as that returned
from the `compile()` function. The goal here is to support cases where the same expression will be evaluated
multiple times, possibly with different variables, e.g.,

```ts
const expr = compile('Promise.resolve(isEmpty(array))');

// then we use it like
evaluateAsync(expr, {
 array: [],
 isEmpty(arr: unknown) {
  return Array.isArray(arr) && arr.length === 0;
 }
));

evaluateAsync(expr, {
 array: ['value'],
 isEmpty(arr: unknown) {
  return Array.isArray(arr) && arr.length === 0;
 }
));
```

This saves the overhead of parsing the expression everytime and simply allows us to evaluate it.

The `variables` parameter should be used to supply any variables or functions that should be in-scope for
the evaluation. A very limited number of global objects, like NaN and Infinity are always available, but
any non-global values will need to be passed as a variable. Note that expressions do not have any access to
the variables in the scope in which they were defined unless they are supplied here.

**Note:** `evaluateAsync()` currently only supports Promise-based asynchronous flows and does not support
the `await` keyword.
