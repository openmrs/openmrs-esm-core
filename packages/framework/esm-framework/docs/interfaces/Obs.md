[O3 Framework](../API.md) / Obs

# Interface: Obs

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:5](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L5)

Superclass for all Openmrs Resources, with strict typings.
If the subclass does not have all attributes (including optional ones)
accounted for, use OpenmrsResource instead.

## Extends

- [`OpenmrsResource`](OpenmrsResource.md)

## Indexable

\[`anythingElse`: `string`\]: `any`

## Properties

### accessionNumber?

> `optional` **accessionNumber**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:9](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L9)

***

### auditInfo?

> `optional` **auditInfo**: [`AuditInfo`](AuditInfo.md)

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`auditInfo`](OpenmrsResource.md#auditinfo)

***

### comment?

> `optional` **comment**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:13](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L13)

***

### concept?

> `optional` **concept**: [`Concept`](Concept.md)

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:6](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L6)

***

### display?

> `optional` **display**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`display`](OpenmrsResource.md#display)

***

### encounter?

> `optional` **encounter**: [`Encounter`](Encounter.md)

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:16](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L16)

***

### formFiledNamespace?

> `optional` **formFiledNamespace**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:20](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L20)

***

### formFilePath?

> `optional` **formFilePath**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:19](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L19)

***

### groupMembers?

> `optional` **groupMembers**: `Obs`[]

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:12](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L12)

***

### interpretation?

> `optional` **interpretation**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:22](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L22)

***

### links?

> `optional` **links**: [`Link`](Link.md)[]

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`links`](OpenmrsResource.md#links)

***

### location?

> `optional` **location**: [`Location`](Location.md)

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:14](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L14)

***

### obsDatetime?

> `optional` **obsDatetime**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:8](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L8)

***

### obsGroup?

> `optional` **obsGroup**: `Obs`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:10](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L10)

***

### order?

> `optional` **order**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:15](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L15)

***

### person?

> `optional` **person**: [`Person`](Person.md)

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:7](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L7)

***

### resourceVersion?

> `optional` **resourceVersion**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:17](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L17)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`resourceVersion`](OpenmrsResource.md#resourceversion)

***

### status?

> `optional` **status**: `"PRELIMINARY"` \| `"FINAL"` \| `"AMENDED"`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:21](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L21)

***

### uuid

> **uuid**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:13](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L13)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`uuid`](OpenmrsResource.md#uuid)

***

### value?

> `optional` **value**: `string` \| `number` \| `boolean` \| [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:17](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L17)

***

### valueCodedName?

> `optional` **valueCodedName**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:11](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L11)

***

### valueModifier?

> `optional` **valueModifier**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:18](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L18)
