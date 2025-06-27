[O3 Framework](../API.md) / evaluateAsNumber

# Function: evaluateAsNumber()

> **evaluateAsNumber**(`expression`, `variables`): `number`

Defined in: [packages/framework/esm-expression-evaluator/src/evaluator.ts:206](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-expression-evaluator/src/evaluator.ts#L206)

`evaluateAsNumber()` is a variant of [()](evaluate.md) which only supports number results. Useful
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

`number`

The result of evaluating the expression
