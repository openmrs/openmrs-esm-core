[O3 Framework](../API.md) / isUrlWithTemplateParameters

# Function: isUrlWithTemplateParameters()

> **isUrlWithTemplateParameters**(`allowedTemplateParameters`): [`Validator`](../type-aliases/Validator.md)

Defined in: [packages/framework/esm-config/src/validators/validators.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/validators/validators.ts#L23)

Verifies that a string contains only the default URL template
parameters, plus any specified in `allowedTemplateParameters`.

## Parameters

### allowedTemplateParameters

`string`[] \| readonly `string`[]

To be added to `openmrsBase` and `openmrsSpaBase`

## Returns

[`Validator`](../type-aliases/Validator.md)

A validator function that checks if a URL contains only allowed template parameters.
