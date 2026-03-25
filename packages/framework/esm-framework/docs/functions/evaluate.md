[O3 Framework](../API.md) / evaluate

# Function: evaluate()

> **evaluate**(`expression`, `variables`): [`DefaultEvaluateReturnType`](../type-aliases/DefaultEvaluateReturnType.md)

Defined in: [packages/framework/esm-expression-evaluator/src/evaluator.ts:97](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-expression-evaluator/src/evaluator.ts#L97)

`evaluate()` implements a relatively safe version of `eval()` that is limited to evaluating synchronous
Javascript expressions. This allows us to safely add features that depend on user-supplied code without
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

[`DefaultEvaluateReturnType`](../type-aliases/DefaultEvaluateReturnType.md)

The result of evaluating the expression

## Examples

```ts
// shouldDisplayOptionalData will be false
const shouldDisplayOptionalData = evaluate('!isEmpty(array)', {
 array: [],
 isEmpty(arr: unknown) {
  return Array.isArray(arr) && arr.length === 0;
 }
})
```

Since this only implements the expression lanaguage part of Javascript, there is no support for assigning
values, creating functions, or creating objects, so the following will throw an error:

```ts
evaluate('var a = 1; a');
```

In addition to string expressions, `evaluate()` can use an existing `jsep.Expression`, such as that returned
from the `compile()` function. The goal here is to support cases where the same expression will be evaluated
multiple times, possibly with different variables, e.g.,

```ts
const expr = compile('isEmpty(array)');

// then we use it like
evaluate(expr, {
 array: [],
 isEmpty(arr: unknown) {
  return Array.isArray(arr) && arr.length === 0;
 }
));

evaluate(expr, {
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
