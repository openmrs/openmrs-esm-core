[O3 Framework](../API.md) / oneOf

# Function: oneOf()

> **oneOf**(`allowedValues`): [`Validator`](../type-aliases/Validator.md)

Defined in: [packages/framework/esm-config/src/validators/validators.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/validators/validators.ts#L62)

Verifies that the value is one of the allowed options.

## Parameters

### allowedValues

The list of allowable values

`any`[] | readonly `any`[]

## Returns

[`Validator`](../type-aliases/Validator.md)

A validator function that checks if a value is in the allowed list.
