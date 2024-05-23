[@openmrs/esm-framework](../API.md) / OpenmrsResourceStrict

# Interface: OpenmrsResourceStrict

Superclass for all Openmrs Resources, with strict typings.
If the subclass does not have all attributes (including optional ones)
accounted for, use OpenmrsResource instead.

## Hierarchy

- **`OpenmrsResourceStrict`**

  ↳ [`OpenmrsResource`](OpenmrsResource.md)

  ↳ [`PatientIdentifierType`](PatientIdentifierType.md)

  ↳ [`Patient`](Patient.md)

  ↳ [`PatientIdentifier`](PatientIdentifier.md)

  ↳ [`PersonAttribute`](PersonAttribute.md)

  ↳ [`Person`](Person.md)

  ↳ [`PersonName`](PersonName.md)

  ↳ [`PersonAddress`](PersonAddress.md)

## Table of contents

### Properties

- [auditInfo](OpenmrsResourceStrict.md#auditinfo)
- [display](OpenmrsResourceStrict.md#display)
- [links](OpenmrsResourceStrict.md#links)
- [resourceVersion](OpenmrsResourceStrict.md#resourceversion)
- [uuid](OpenmrsResourceStrict.md#uuid)

## Properties

### auditInfo

• `Optional` **auditInfo**: [`AuditInfo`](AuditInfo.md)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

___

### display

• `Optional` **display**: `string`

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

___

### links

• `Optional` **links**: [`Link`](Link.md)[]

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

___

### resourceVersion

• `Optional` **resourceVersion**: `string`

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L17)

___

### uuid

• **uuid**: `string`

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L13)
