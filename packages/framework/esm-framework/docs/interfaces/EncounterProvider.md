[O3 Framework](../API.md) / EncounterProvider

# Interface: EncounterProvider

Defined in: [packages/framework/esm-emr-api/src/types/encounter-resource.ts:27](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L27)

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

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`auditInfo`](OpenmrsResource.md#auditinfo)

***

### display?

> `optional` **display**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`display`](OpenmrsResource.md#display)

***

### encounterRole?

> `optional` **encounterRole**: [`EncounterRole`](EncounterRole.md)

Defined in: [packages/framework/esm-emr-api/src/types/encounter-resource.ts:29](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L29)

***

### links?

> `optional` **links**: [`Link`](Link.md)[]

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`links`](OpenmrsResource.md#links)

***

### provider?

> `optional` **provider**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/encounter-resource.ts:28](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L28)

***

### resourceVersion?

> `optional` **resourceVersion**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:17](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L17)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`resourceVersion`](OpenmrsResource.md#resourceversion)

***

### uuid

> **uuid**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:13](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L13)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`uuid`](OpenmrsResource.md#uuid)
