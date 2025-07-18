[O3 Framework](../API.md) / Obs

# Interface: Obs

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L5)

## Extends

- `OpenmrsResource`

## Indexable

\[`anythingElse`: `string`\]: `any`

## Properties

### accessionNumber?

> `optional` **accessionNumber**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L9)

***

### auditInfo?

> `optional` **auditInfo**: `AuditInfo`

Defined in: packages/framework/esm-api/dist/types/openmrs-resource.d.ts:14

#### Inherited from

`OpenmrsResource.auditInfo`

***

### comment?

> `optional` **comment**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L13)

***

### concept?

> `optional` **concept**: `Concept`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L6)

***

### display?

> `optional` **display**: `string`

Defined in: packages/framework/esm-api/dist/types/openmrs-resource.d.ts:12

#### Inherited from

`OpenmrsResource.display`

***

### encounter?

> `optional` **encounter**: [`Encounter`](Encounter.md)

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L16)

***

### formFiledNamespace?

> `optional` **formFiledNamespace**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L20)

***

### formFilePath?

> `optional` **formFilePath**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L19)

***

### groupMembers?

> `optional` **groupMembers**: `Obs`[]

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L12)

***

### interpretation?

> `optional` **interpretation**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L22)

***

### links?

> `optional` **links**: `Link`[]

Defined in: packages/framework/esm-api/dist/types/openmrs-resource.d.ts:13

#### Inherited from

`OpenmrsResource.links`

***

### location?

> `optional` **location**: [`Location`](Location.md)

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L14)

***

### obsDatetime?

> `optional` **obsDatetime**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L8)

***

### obsGroup?

> `optional` **obsGroup**: `Obs`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L10)

***

### order?

> `optional` **order**: `OpenmrsResource`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L15)

***

### person?

> `optional` **person**: `Person`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L7)

***

### resourceVersion?

> `optional` **resourceVersion**: `string`

Defined in: packages/framework/esm-api/dist/types/openmrs-resource.d.ts:15

#### Inherited from

`OpenmrsResource.resourceVersion`

***

### status?

> `optional` **status**: `"PRELIMINARY"` \| `"FINAL"` \| `"AMENDED"`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L21)

***

### uuid

> **uuid**: `string`

Defined in: packages/framework/esm-api/dist/types/openmrs-resource.d.ts:11

#### Inherited from

`OpenmrsResource.uuid`

***

### value?

> `optional` **value**: `string` \| `number` \| `boolean` \| `OpenmrsResource`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L17)

***

### valueCodedName?

> `optional` **valueCodedName**: `OpenmrsResource`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L11)

***

### valueModifier?

> `optional` **valueModifier**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/obs-resource.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L18)
