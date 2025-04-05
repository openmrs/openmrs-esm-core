[@openmrs/esm-framework](../API.md) / FHIRResource

# Interface: FHIRResource

## Table of contents

### Properties

- [resource](FHIRResource.md#resource)

## Properties

### resource

• **resource**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code` | { `coding`: [`FHIRCode`](FHIRCode.md)[]  } |
| `code.coding` | [`FHIRCode`](FHIRCode.md)[] |
| `effectiveDateTime` | `Date` |
| `encounter` | { `reference`: `string` ; `type`: `string`  } |
| `encounter.reference` | `string` |
| `encounter.type` | `string` |
| `id` | `string` |
| `issued` | `Date` |
| `referenceRange` | `any` |
| `resourceType` | `string` |
| `status` | `string` |
| `subject` | { `display`: `string` ; `identifier`: { `id`: `string` ; `system`: `string` ; `use`: `string` ; `value`: `string`  } ; `reference`: `string` ; `type`: `string`  } |
| `subject.display` | `string` |
| `subject.identifier` | { `id`: `string` ; `system`: `string` ; `use`: `string` ; `value`: `string`  } |
| `subject.identifier.id` | `string` |
| `subject.identifier.system` | `string` |
| `subject.identifier.use` | `string` |
| `subject.identifier.value` | `string` |
| `subject.reference` | `string` |
| `subject.type` | `string` |
| `valueCodeableConcept` | { `coding`: [`FHIRCode`](FHIRCode.md)[]  } |
| `valueCodeableConcept.coding` | [`FHIRCode`](FHIRCode.md)[] |
| `valueQuantity` | { `value`: `number`  } |
| `valueQuantity.value` | `number` |
| `valueString` | `string` |

#### Defined in

[packages/framework/esm-api/src/types/fhir-resource.ts:2](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/fhir-resource.ts#L2)
