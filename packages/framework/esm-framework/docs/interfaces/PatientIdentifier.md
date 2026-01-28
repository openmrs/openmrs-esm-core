[O3 Framework](../API.md) / PatientIdentifier

# Interface: PatientIdentifier

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L21)

Superclass for all Openmrs Resources, with strict typings.
If the subclass does not have all attributes (including optional ones)
accounted for, use OpenmrsResource instead.

## Extends

- [`OpenmrsResourceStrict`](OpenmrsResourceStrict.md)

## Properties

### auditInfo?

> `optional` **auditInfo**: `AuditInfo`

Defined in: packages/framework/esm-api/dist/types/openmrs-resource.d.ts:14

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`auditInfo`](OpenmrsResourceStrict.md#auditinfo)

***

### display?

> `optional` **display**: `string`

Defined in: packages/framework/esm-api/dist/types/openmrs-resource.d.ts:12

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`display`](OpenmrsResourceStrict.md#display)

***

### identifier?

> `optional` **identifier**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L22)

***

### identifierType?

> `optional` **identifierType**: [`PatientIdentifierType`](PatientIdentifierType.md)

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L23)

***

### links?

> `optional` **links**: `Link`[]

Defined in: packages/framework/esm-api/dist/types/openmrs-resource.d.ts:13

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`links`](OpenmrsResourceStrict.md#links)

***

### location?

> `optional` **location**: `Location`

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L24)

***

### preferred?

> `optional` **preferred**: `boolean`

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L25)

***

### resourceVersion?

> `optional` **resourceVersion**: `string`

Defined in: packages/framework/esm-api/dist/types/openmrs-resource.d.ts:15

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`resourceVersion`](OpenmrsResourceStrict.md#resourceversion)

***

### uuid

> **uuid**: `string`

Defined in: packages/framework/esm-api/dist/types/openmrs-resource.d.ts:11

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`uuid`](OpenmrsResourceStrict.md#uuid)

***

### voided?

> `optional` **voided**: `boolean`

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L26)
