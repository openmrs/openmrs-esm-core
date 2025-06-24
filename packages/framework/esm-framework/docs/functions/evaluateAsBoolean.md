[O3 Framework](../API.md) / evaluateAsBoolean

# Function: evaluateAsBoolean()

> **evaluateAsBoolean**(`expression`, `variables`): `Boolean`

Defined in: [packages/framework/esm-expression-evaluator/src/evaluator.ts:179](https://github.com/openmrs/openmrs-esm-core/blob/18d2874f03a33a6ab8295af0e87ac97fdd150718/packages/framework/esm-expression-evaluator/src/evaluator.ts#L179)

`evaluateAsBoolean()` is a variant of [()](evaluate.md) which only supports boolean results. Useful
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

`Boolean`

The result of evaluating the expression
