[O3 Framework](../API.md) / evaluateAsNumberAsync

# Function: evaluateAsNumberAsync()

> **evaluateAsNumberAsync**(`expression`, `variables`): `Promise`\<`number`\>

Defined in: [packages/framework/esm-expression-evaluator/src/evaluator.ts:219](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-expression-evaluator/src/evaluator.ts#L219)

`evaluateAsNumberAsync()` is a variant of [()](evaluateAsync.md) which only supports number results. Useful
if valid expression must return numeric values.

## Parameters

### expression

The expression to evaluate, either as a string or pre-parsed expression

`string` | `Expression`

### variables

[`VariablesMap`](../type-aliases/VariablesMap.md) = `{}`

Optional object which contains any variables, functions, etc. that will be available to
 the expression.

## Returns

`Promise`\<`number`\>

The result of evaluating the expression
