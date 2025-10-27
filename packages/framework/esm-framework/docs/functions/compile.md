[O3 Framework](../API.md) / compile

# Function: compile()

> **compile**(`expression`): `Expression`

Defined in: [packages/framework/esm-expression-evaluator/src/evaluator.ts:338](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-expression-evaluator/src/evaluator.ts#L338)

`compile()` is a companion function for use with [()](evaluate.md) and the various `evaluateAs*()` functions.
It processes an expression string into the resulting AST that is executed by those functions. This is useful if
you have an expression that will need to be evaluated mulitple times, potentially with different values, as the
lexing and parsing steps can be skipped by using the AST object returned from this.

The returned AST is intended to be opaque to client applications, but, of course, it is possible to manipulate
the AST before passing it back to [()](evaluate.md), if desired. This might be useful if, for example, certain
values are known to be constant.

## Parameters

### expression

`string`

The expression to be parsed

## Returns

`Expression`

An executable AST representation of the expression
