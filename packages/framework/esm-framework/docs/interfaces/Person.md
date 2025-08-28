[O3 Framework](../API.md) / Person

# Interface: Person

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L10)

Superclass for all Openmrs Resources, with strict typings.
If the subclass does not have all attributes (including optional ones)
accounted for, use OpenmrsResource instead.

## Extends

- [`OpenmrsResourceStrict`](OpenmrsResourceStrict.md)

## Properties

### addresses?

> `optional` **addresses**: [`PersonAddress`](PersonAddress.md)[]

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L21)

***

### age?

> `optional` **age**: `number`

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L12)

***

### attributes?

> `optional` **attributes**: [`PersonAttribute`](PersonAttribute.md)[]

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L22)

***

### auditInfo?

> `optional` **auditInfo**: [`AuditInfo`](AuditInfo.md)

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`auditInfo`](OpenmrsResourceStrict.md#auditinfo)

***

### birthdate?

> `optional` **birthdate**: `string`

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L13)

***

### birthdateEstimated?

> `optional` **birthdateEstimated**: `boolean`

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L14)

***

### birthtime?

> `optional` **birthtime**: `null` \| `string`

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L24)

***

### causeOfDeath?

> `optional` **causeOfDeath**: `null` \| [`Concept`](Concept.md)

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L17)

***

### causeOfDeathNonCoded?

> `optional` **causeOfDeathNonCoded**: `null` \| `string`

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L26)

***

### dead?

> `optional` **dead**: `boolean`

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L15)

***

### deathDate?

> `optional` **deathDate**: `null` \| `string`

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L16)

***

### deathdateEstimated?

> `optional` **deathdateEstimated**: `boolean`

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L25)

***

### display?

> `optional` **display**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`display`](OpenmrsResourceStrict.md#display)

***

### gender?

> `optional` **gender**: `string`

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L11)

***

### links?

> `optional` **links**: [`Link`](Link.md)[]

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`links`](OpenmrsResourceStrict.md#links)

***

### names?

> `optional` **names**: [`PersonName`](PersonName.md)[]

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L20)

***

### preferredAddress?

> `optional` **preferredAddress**: [`PersonAddress`](PersonAddress.md)

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L19)

***

### preferredName?

> `optional` **preferredName**: [`PersonName`](PersonName.md)

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L18)

***

### resourceVersion?

> `optional` **resourceVersion**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L17)

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`resourceVersion`](OpenmrsResourceStrict.md#resourceversion)

***

### uuid

> **uuid**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L13)

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`uuid`](OpenmrsResourceStrict.md#uuid)

***

### voided?

> `optional` **voided**: `boolean`

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L23)
