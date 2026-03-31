[O3 Framework](../API.md) / PatientIdentifier

# Interface: PatientIdentifier

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:21](https://github.com/DushmanthaHerath1/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L21)

Superclass for all Openmrs Resources, with strict typings.
If the subclass does not have all attributes (including optional ones)
accounted for, use OpenmrsResource instead.

## Extends

- [`OpenmrsResourceStrict`](OpenmrsResourceStrict.md)

## Properties

### auditInfo?

> `optional` **auditInfo**: [`AuditInfo`](AuditInfo.md)

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/DushmanthaHerath1/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`auditInfo`](OpenmrsResourceStrict.md#auditinfo)

***

### display?

> `optional` **display**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/DushmanthaHerath1/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`display`](OpenmrsResourceStrict.md#display)

***

### identifier?

> `optional` **identifier**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:22](https://github.com/DushmanthaHerath1/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L22)

***

### identifierType?

> `optional` **identifierType**: [`PatientIdentifierType`](PatientIdentifierType.md)

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:23](https://github.com/DushmanthaHerath1/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L23)

***

### links?

> `optional` **links**: [`Link`](Link.md)[]

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/DushmanthaHerath1/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`links`](OpenmrsResourceStrict.md#links)

***

### location?

> `optional` **location**: `Location`

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:24](https://github.com/DushmanthaHerath1/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L24)

***

### preferred?

> `optional` **preferred**: `boolean`

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:25](https://github.com/DushmanthaHerath1/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L25)

***

### resourceVersion?

> `optional` **resourceVersion**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:17](https://github.com/DushmanthaHerath1/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L17)

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`resourceVersion`](OpenmrsResourceStrict.md#resourceversion)

***

### uuid

> **uuid**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:13](https://github.com/DushmanthaHerath1/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L13)

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`uuid`](OpenmrsResourceStrict.md#uuid)

***

### voided?

> `optional` **voided**: `boolean`

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:26](https://github.com/DushmanthaHerath1/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L26)
