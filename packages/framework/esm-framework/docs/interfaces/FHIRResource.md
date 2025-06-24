[O3 Framework](../API.md) / FHIRResource

# Interface: FHIRResource

Defined in: [packages/framework/esm-emr-api/src/types/fhir-resource.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/fhir-resource.ts#L1)

## Properties

### resource

> **resource**: `object`

Defined in: [packages/framework/esm-emr-api/src/types/fhir-resource.ts:2](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/fhir-resource.ts#L2)

#### code

> **code**: `object`

##### code.coding

> **coding**: [`FHIRCode`](FHIRCode.md)[]

#### effectiveDateTime

> **effectiveDateTime**: `Date`

#### encounter

> **encounter**: `object`

##### encounter.reference

> **reference**: `string`

##### encounter.type

> **type**: `string`

#### id

> **id**: `string`

#### issued

> **issued**: `Date`

#### referenceRange

> **referenceRange**: `any`

#### resourceType

> **resourceType**: `string`

#### status

> **status**: `string`

#### subject

> **subject**: `object`

##### subject.display

> **display**: `string`

##### subject.identifier

> **identifier**: `object`

##### subject.identifier.id

> **id**: `string`

##### subject.identifier.system

> **system**: `string`

##### subject.identifier.use

> **use**: `string`

##### subject.identifier.value

> **value**: `string`

##### subject.reference

> **reference**: `string`

##### subject.type

> **type**: `string`

#### valueCodeableConcept

> **valueCodeableConcept**: `object`

##### valueCodeableConcept.coding

> **coding**: [`FHIRCode`](FHIRCode.md)[]

#### valueQuantity

> **valueQuantity**: `object`

##### valueQuantity.value

> **value**: `number`

#### valueString

> **valueString**: `string`
