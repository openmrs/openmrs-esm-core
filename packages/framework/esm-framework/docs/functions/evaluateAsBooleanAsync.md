[O3 Framework](../API.md) / evaluateAsBooleanAsync

# Function: evaluateAsBooleanAsync()

> **evaluateAsBooleanAsync**(`expression`, `variables`): `Promise`\<`boolean`\>

Defined in: [packages/framework/esm-expression-evaluator/src/evaluator.ts:193](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-expression-evaluator/src/evaluator.ts#L193)

`evaluateAsBooleanAsync()` is a variant of [()](evaluateAsync.md) which only supports boolean results. Useful
if valid expression must return boolean values.

## Parameters

### expression

The expression to evaluate, either as a string or pre-parsed expression

`string` | `Expression`

### variables

[`VariablesMap`](../type-aliases/VariablesMap.md) = `{}`

Optional object which contains any variables, functions, etc. that will be available to
 the expression.

## Returns

`Promise`\<`boolean`\>

The result of evaluating the expression
