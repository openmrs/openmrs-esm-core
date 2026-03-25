[O3 Framework](../API.md) / Diagnosis

# Interface: Diagnosis

Defined in: [packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L6)

Superclass for all Openmrs Resources, with strict typings.
If the subclass does not have all attributes (including optional ones)
accounted for, use OpenmrsResource instead.

## Extends

- [`OpenmrsResource`](OpenmrsResource.md)

## Indexable

\[`anythingElse`: `string`\]: `any`

## Properties

### auditInfo?

> `optional` **auditInfo**: [`AuditInfo`](AuditInfo.md)

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`auditInfo`](OpenmrsResource.md#auditinfo)

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

> `optional` **conceptClass**: [`ConceptClass`](ConceptClass.md)

##### coded.datatype?

> `optional` **datatype**: [`OpenmrsResource`](OpenmrsResource.md)

##### coded.display?

> `optional` **display**: `string`

##### coded.name?

> `optional` **name**: [`Concept`](Concept.md)

##### coded.uuid

> **uuid**: `string`

#### nonCoded?

> `optional` **nonCoded**: `string`

***

### display?

> `optional` **display**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`display`](OpenmrsResource.md#display)

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

> `optional` **links**: [`Link`](Link.md)[]

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`links`](OpenmrsResource.md#links)

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

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L17)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`resourceVersion`](OpenmrsResource.md#resourceversion)

***

### uuid

> **uuid**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L13)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`uuid`](OpenmrsResource.md#uuid)

***

### voided?

> `optional` **voided**: `boolean`

Defined in: [packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L23)
