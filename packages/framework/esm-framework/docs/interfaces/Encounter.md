[O3 Framework](../API.md) / Encounter

# Interface: Encounter

Defined in: [packages/framework/esm-emr-api/src/types/encounter-resource.ts:9](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L9)

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

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`auditInfo`](OpenmrsResource.md#auditinfo)

***

### diagnoses?

> `optional` **diagnoses**: [`Diagnosis`](Diagnosis.md)[]

Defined in: [packages/framework/esm-emr-api/src/types/encounter-resource.ts:17](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L17)

***

### display?

> `optional` **display**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`display`](OpenmrsResource.md#display)

***

### encounterDatetime?

> `optional` **encounterDatetime**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/encounter-resource.ts:10](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L10)

***

### encounterProviders?

> `optional` **encounterProviders**: [`EncounterProvider`](EncounterProvider.md)[]

Defined in: [packages/framework/esm-emr-api/src/types/encounter-resource.ts:16](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L16)

***

### encounterType?

> `optional` **encounterType**: [`EncounterType`](EncounterType.md)

Defined in: [packages/framework/esm-emr-api/src/types/encounter-resource.ts:13](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L13)

***

### form?

> `optional` **form**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/encounter-resource.ts:18](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L18)

***

### links?

> `optional` **links**: [`Link`](Link.md)[]

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`links`](OpenmrsResource.md#links)

***

### location?

> `optional` **location**: [`Location`](Location.md)

Defined in: [packages/framework/esm-emr-api/src/types/encounter-resource.ts:12](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L12)

***

### obs?

> `optional` **obs**: [`Obs`](Obs.md)[]

Defined in: [packages/framework/esm-emr-api/src/types/encounter-resource.ts:14](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L14)

***

### patient?

> `optional` **patient**: [`Patient`](Patient.md)

Defined in: [packages/framework/esm-emr-api/src/types/encounter-resource.ts:11](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L11)

***

### resourceVersion?

> `optional` **resourceVersion**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:17](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L17)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`resourceVersion`](OpenmrsResource.md#resourceversion)

***

### uuid

> **uuid**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:13](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L13)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`uuid`](OpenmrsResource.md#uuid)

***

### visit?

> `optional` **visit**: [`Visit`](Visit.md)

Defined in: [packages/framework/esm-emr-api/src/types/encounter-resource.ts:15](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L15)
