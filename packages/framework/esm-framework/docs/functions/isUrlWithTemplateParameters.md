[O3 Framework](../API.md) / isUrlWithTemplateParameters

# Function: isUrlWithTemplateParameters()

> **isUrlWithTemplateParameters**(`allowedTemplateParameters`): [`Validator`](../type-aliases/Validator.md)

Defined in: [packages/framework/esm-config/src/validators/validators.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/validators/validators.ts#L21)

Verifies that a string contains only the default URL template
parameters, plus any specified in `allowedTemplateParameters`.

## Parameters

### allowedTemplateParameters

To be added to `openmrsBase` and `openmrsSpaBase`

`string`[] | readonly `string`[]

## Returns

[`Validator`](../type-aliases/Validator.md)
