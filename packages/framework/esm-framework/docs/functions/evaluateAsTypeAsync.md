[O3 Framework](../API.md) / evaluateAsTypeAsync

# Function: evaluateAsTypeAsync()

> **evaluateAsTypeAsync**\<`T`\>(`expression`, `variables`, `typePredicate`): `Promise`\<`T`\>

Defined in: [packages/framework/esm-expression-evaluator/src/evaluator.ts:285](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-expression-evaluator/src/evaluator.ts#L285)

`evaluateAsTypeAsync()` is a type-safe version of [()](evaluateAsync.md) which returns a result if the result
passes a custom type predicate. The main use-case for this is to narrow the return types allowed based on
context, e.g., if the expected result should be a number or boolean, you can supply a custom type-guard
to ensure that only number or boolean results are returned.

## Type Parameters

### T

`T`

## Parameters

### expression

The expression to evaluate, either as a string or pre-parsed expression

`string` | `Expression`

### variables

[`VariablesMap`](../type-aliases/VariablesMap.md) = `{}`

Optional object which contains any variables, functions, etc. that will be available to
 the expression.

### typePredicate

(`result`) => `result is T`

A [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
 which asserts that the result value matches one of the expected results.

## Returns

`Promise`\<`T`\>

The result of evaluating the expression
