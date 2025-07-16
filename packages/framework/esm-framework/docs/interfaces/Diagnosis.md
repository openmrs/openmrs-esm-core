[O3 Framework](../API.md) / Diagnosis

# Interface: Diagnosis

Defined in: [packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L6)

## Extends

- `OpenmrsResource`

## Indexable

\[`anythingElse`: `string`\]: `any`

## Properties

### auditInfo?

> `optional` **auditInfo**: `AuditInfo`

Defined in: packages/framework/esm-api/dist/types/openmrs-resource.d.ts:14

#### Inherited from

`OpenmrsResource.auditInfo`

***

### certainty?

> `optional` **certainty**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L19)

***

### diagnosis?

> `optional` **diagnosis**: `object`

Defined in: [packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L7)

#### coded?

> `optional` **coded**: `object`

##### coded.conceptClass?

> `optional` **conceptClass**: `ConceptClass`

##### coded.datatype?

> `optional` **datatype**: `OpenmrsResource`

##### coded.display?

> `optional` **display**: `string`

##### coded.name?

> `optional` **name**: `Concept`

##### coded.uuid

> **uuid**: `string`

#### nonCoded?

> `optional` **nonCoded**: `string`

***

### display?

> `optional` **display**: `string`

Defined in: packages/framework/esm-api/dist/types/openmrs-resource.d.ts:12

#### Inherited from

`OpenmrsResource.display`

***

### encounter?

> `optional` **encounter**: [`Encounter`](Encounter.md)

Defined in: [packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L18)

***

### formFieldNamespace?

> `optional` **formFieldNamespace**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L21)

***

### formFieldPath?

> `optional` **formFieldPath**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L22)

***

### links?

> `optional` **links**: `Link`[]

Defined in: packages/framework/esm-api/dist/types/openmrs-resource.d.ts:13

#### Inherited from

`OpenmrsResource.links`

***

### patient?

> `optional` **patient**: [`Patient`](Patient.md)

Defined in: [packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L17)

***

### rank?

> `optional` **rank**: `number`

Defined in: [packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L20)

***

### resourceVersion?

> `optional` **resourceVersion**: `string`

Defined in: packages/framework/esm-api/dist/types/openmrs-resource.d.ts:15

#### Inherited from

`OpenmrsResource.resourceVersion`

***

### uuid

> **uuid**: `string`

Defined in: packages/framework/esm-api/dist/types/openmrs-resource.d.ts:11

#### Inherited from

`OpenmrsResource.uuid`

***

### voided?

> `optional` **voided**: `boolean`

Defined in: [packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L23)
