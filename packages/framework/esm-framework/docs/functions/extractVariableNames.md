[O3 Framework](../API.md) / extractVariableNames

# Function: extractVariableNames()

> **extractVariableNames**(`expression`): `string`[]

Defined in: [packages/framework/esm-expression-evaluator/src/extractor.ts:44](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-expression-evaluator/src/extractor.ts#L44)

`extractVariableNames()` is a companion function for `evaluate()` and `evaluateAsync()` which extracts the
names of all unbound identifiers used in the expression. The idea is to be able to extract all of the names
of variables that will need to be supplied in order to correctly process the expression.

## Parameters

### expression

`string` | `Expression`

## Returns

`string`[]

## Examples

```ts
// variables will be ['isEmpty', 'array']
const variables = extractVariableNames('!isEmpty(array)')
```

An identifier is considered "unbound" if it is not a reference to the property of an object, is not defined
as a parameter to an inline arrow function, and is not a global value. E.g.,

```ts
// variables will be ['obj']
const variables = extractVariableNames('obj.prop()')
```

```ts
// variables will be ['arr', 'needle']
const variables = extractVariableNames('arr.filter(v => v === needle)')
```

```ts
// variables will be ['myVar']
const  variables = extractVariableNames('new String(myVar)')
```

Note that because this expression evaluator uses a restricted definition of "global" there are some Javascript
globals that will be reported as a unbound expression. This is expected because the evaluator will still fail
on these expressions.
