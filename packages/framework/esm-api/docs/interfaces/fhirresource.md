[@openmrs/esm-api](../API.md) / FHIRResource

# Interface: FHIRResource

## Table of contents

### Properties

- [resource](fhirresource.md#resource)

## Properties

### resource

• **resource**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code` | `Object` |
| `code.coding` | [FHIRCode](fhircode.md)[] |
| `effectiveDateTime` | `Date` |
| `encounter` | `Object` |
| `encounter.reference` | `string` |
| `encounter.type` | `string` |
| `id` | `string` |
| `issued` | `Date` |
| `referenceRange` | `any` |
| `resourceType` | `string` |
| `status` | `string` |
| `subject` | `Object` |
| `subject.display` | `string` |
| `subject.identifier` | `Object` |
| `subject.identifier.id` | `string` |
| `subject.identifier.system` | `string` |
| `subject.identifier.use` | `string` |
| `subject.identifier.value` | `string` |
| `subject.reference` | `string` |
| `subject.type` | `string` |
| `valueQuantity` | `Object` |
| `valueQuantity.value` | `number` |

#### Defined in

[packages/framework/esm-api/src/types/fhir-resource.ts:2](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/types/fhir-resource.ts#L2)
