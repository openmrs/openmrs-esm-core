[O3 Framework](../API.md) / evaluateAsNumber

# Function: evaluateAsNumber()

> **evaluateAsNumber**(`expression`, `variables`): `number`

Defined in: [packages/framework/esm-expression-evaluator/src/evaluator.ts:205](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-expression-evaluator/src/evaluator.ts#L205)

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
