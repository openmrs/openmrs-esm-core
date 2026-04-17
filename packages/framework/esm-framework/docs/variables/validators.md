[O3 Framework](../API.md) / validators

# Variable: validators

> `const` **validators**: `object`

Defined in: [packages/framework/esm-config/src/validators/validators.ts:69](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/validators/validators.ts#L69)

## Type declaration

## Navigation

#### isUrlWithTemplateParameters()

> **isUrlWithTemplateParameters**: (`allowedTemplateParameters`) => [`Validator`](../type-aliases/Validator.md)

Verifies that a string contains only the default URL template
parameters, plus any specified in `allowedTemplateParameters`.

##### Parameters

###### allowedTemplateParameters

To be added to `openmrsBase` and `openmrsSpaBase`

`string`[] | readonly `string`[]

##### Returns

[`Validator`](../type-aliases/Validator.md)

A validator function that checks if a URL contains only allowed template parameters.

## Other

#### inRange()

> **inRange**: (`min`, `max`) => [`Validator`](../type-aliases/Validator.md)

Verifies that the value is between the provided minimum and maximum

##### Parameters

###### min

`number`

Minimum acceptable value

###### max

`number`

Maximum acceptable value

##### Returns

[`Validator`](../type-aliases/Validator.md)

A validator function that checks if a value is within the specified range.

#### isUrl

> **isUrl**: [`Validator`](../type-aliases/Validator.md)

#### oneOf()

> **oneOf**: (`allowedValues`) => [`Validator`](../type-aliases/Validator.md)

Verifies that the value is one of the allowed options.

##### Parameters

###### allowedValues

The list of allowable values

`any`[] | readonly `any`[]

##### Returns

[`Validator`](../type-aliases/Validator.md)

A validator function that checks if a value is in the allowed list.
