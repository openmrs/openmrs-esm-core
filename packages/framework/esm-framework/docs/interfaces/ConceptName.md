[O3 Framework](../API.md) / ConceptName

# Interface: ConceptName

Defined in: [packages/framework/esm-api/src/types/concept-resource.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/concept-resource.ts#L27)

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

### conceptNameType?

> `optional` **conceptNameType**: `"FULLY_SPECIFIED"` \| `"SHORT"` \| `"INDEX_TERM"`

Defined in: [packages/framework/esm-api/src/types/concept-resource.ts:31](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/concept-resource.ts#L31)

***

### display?

> `optional` **display**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`display`](OpenmrsResource.md#display)

***

### links?

> `optional` **links**: [`Link`](Link.md)[]

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`links`](OpenmrsResource.md#links)

***

### locale?

> `optional` **locale**: `string`

Defined in: [packages/framework/esm-api/src/types/concept-resource.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/concept-resource.ts#L29)

***

### localPreferred?

> `optional` **localPreferred**: `boolean`

Defined in: [packages/framework/esm-api/src/types/concept-resource.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/concept-resource.ts#L30)

***

### name?

> `optional` **name**: `string`

Defined in: [packages/framework/esm-api/src/types/concept-resource.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/concept-resource.ts#L28)

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
