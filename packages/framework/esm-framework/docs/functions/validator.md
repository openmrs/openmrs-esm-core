[O3 Framework](../API.md) / validator

# Function: validator()

> **validator**(`validationFunction`, `message`): [`Validator`](../type-aliases/Validator.md)

Defined in: [packages/framework/esm-config/src/validators/validator.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/validators/validator.ts#L25)

Constructs a custom validator.

### Example

```typescript
{
  foo: {
    _default: 0,
    _validators: [
      validator(val => val >= 0, "Must not be negative.")
    ]
  }
}
```

## Parameters

### validationFunction

[`ValidatorFunction`](../type-aliases/ValidatorFunction.md)

Takes the configured value as input. Returns true
   if it is valid, false otherwise.

### message

A string message that explains why the value is invalid. Can
   also be a function that takes the value as input and returns a string.

`string` | (`value`) => `string`

## Returns

[`Validator`](../type-aliases/Validator.md)

A validator ready for use in a config schema
