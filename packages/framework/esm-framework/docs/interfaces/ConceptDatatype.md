[O3 Framework](../API.md) / ConceptDatatype

# Interface: ConceptDatatype

Defined in: [packages/framework/esm-api/src/types/concept-resource.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/concept-resource.ts#L20)

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

### description?

> `optional` **description**: `string`

Defined in: [packages/framework/esm-api/src/types/concept-resource.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/concept-resource.ts#L22)

***

### display?

> `optional` **display**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`display`](OpenmrsResource.md#display)

***

### hl7Abbreviation?

> `optional` **hl7Abbreviation**: `string`

Defined in: [packages/framework/esm-api/src/types/concept-resource.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/concept-resource.ts#L23)

***

### links?

> `optional` **links**: [`Link`](Link.md)[]

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`links`](OpenmrsResource.md#links)

***

### name?

> `optional` **name**: `string`

Defined in: [packages/framework/esm-api/src/types/concept-resource.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/concept-resource.ts#L21)

***

### resourceVersion?

> `optional` **resourceVersion**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L17)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`resourceVersion`](OpenmrsResource.md#resourceversion)

***

### retired?

> `optional` **retired**: `boolean`

Defined in: [packages/framework/esm-api/src/types/concept-resource.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/concept-resource.ts#L24)

***

### uuid

> **uuid**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L13)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`uuid`](OpenmrsResource.md#uuid)
