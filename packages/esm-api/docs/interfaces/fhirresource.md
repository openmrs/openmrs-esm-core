[@openmrs/esm-api](../API.md) / FHIRResource

# Interface: FHIRResource

## Table of contents

### Properties

- [resource](fhirresource.md#resource)

## Properties

### resource

• **resource**: *object*

#### Type declaration:

| Name | Type |
| :------ | :------ |
| `code` | *object* |
| `code.coding` | [*FHIRCode*](fhircode.md)[] |
| `effectiveDateTime` | Date |
| `encounter` | *object* |
| `encounter.reference` | *string* |
| `encounter.type` | *string* |
| `id` | *string* |
| `issued` | Date |
| `referenceRange` | *any* |
| `resourceType` | *string* |
| `status` | *string* |
| `subject` | *object* |
| `subject.display` | *string* |
| `subject.identifier` | *object* |
| `subject.identifier.id` | *string* |
| `subject.identifier.system` | *string* |
| `subject.identifier.use` | *string* |
| `subject.identifier.value` | *string* |
| `subject.reference` | *string* |
| `subject.type` | *string* |
| `valueQuantity` | *object* |
| `valueQuantity.value` | *number* |

Defined in: [packages/esm-api/src/types/fhir-resource.ts:2](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-api/src/types/fhir-resource.ts#L2)
