[O3 Framework](../API.md) / OpenmrsResourceStrict

# Interface: OpenmrsResourceStrict

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L12)

Superclass for all Openmrs Resources, with strict typings.
If the subclass does not have all attributes (including optional ones)
accounted for, use OpenmrsResource instead.

## Extended by

- [`OpenmrsResource`](OpenmrsResource.md)
- [`PersonAttribute`](PersonAttribute.md)
- [`Person`](Person.md)
- [`PersonName`](PersonName.md)
- [`PersonAddress`](PersonAddress.md)
- [`PatientIdentifierType`](PatientIdentifierType.md)
- [`Patient`](Patient.md)
- [`PatientIdentifier`](PatientIdentifier.md)

## Properties

### auditInfo?

> `optional` **auditInfo**: [`AuditInfo`](AuditInfo.md)

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

***

### display?

> `optional` **display**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

***

### links?

> `optional` **links**: [`Link`](Link.md)[]

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

***

### resourceVersion?

> `optional` **resourceVersion**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L17)

***

### uuid

> **uuid**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L13)
