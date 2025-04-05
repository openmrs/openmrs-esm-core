[@openmrs/esm-framework](../API.md) / PatientIdentifier

# Interface: PatientIdentifier

## Hierarchy

- [`OpenmrsResourceStrict`](OpenmrsResourceStrict.md)

  ↳ **`PatientIdentifier`**

## Table of contents

### Properties

- [auditInfo](PatientIdentifier.md#auditinfo)
- [display](PatientIdentifier.md#display)
- [identifier](PatientIdentifier.md#identifier)
- [identifierType](PatientIdentifier.md#identifiertype)
- [links](PatientIdentifier.md#links)
- [location](PatientIdentifier.md#location)
- [preferred](PatientIdentifier.md#preferred)
- [resourceVersion](PatientIdentifier.md#resourceversion)
- [uuid](PatientIdentifier.md#uuid)
- [voided](PatientIdentifier.md#voided)

## Properties

### auditInfo

• `Optional` **auditInfo**: [`AuditInfo`](AuditInfo.md)

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[auditInfo](OpenmrsResourceStrict.md#auditinfo)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

___

### display

• `Optional` **display**: `string`

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[display](OpenmrsResourceStrict.md#display)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

___

### identifier

• `Optional` **identifier**: `string`

#### Defined in

[packages/framework/esm-api/src/types/patient-resource.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/patient-resource.ts#L23)

___

### identifierType

• `Optional` **identifierType**: [`PatientIdentifierType`](PatientIdentifierType.md)

#### Defined in

[packages/framework/esm-api/src/types/patient-resource.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/patient-resource.ts#L24)

___

### links

• `Optional` **links**: [`Link`](Link.md)[]

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[links](OpenmrsResourceStrict.md#links)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

___

### location

• `Optional` **location**: `Location`

#### Defined in

[packages/framework/esm-api/src/types/patient-resource.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/patient-resource.ts#L25)

___

### preferred

• `Optional` **preferred**: `boolean`

#### Defined in

[packages/framework/esm-api/src/types/patient-resource.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/patient-resource.ts#L26)

___

### resourceVersion

• `Optional` **resourceVersion**: `string`

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[resourceVersion](OpenmrsResourceStrict.md#resourceversion)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L17)

___

### uuid

• **uuid**: `string`

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[uuid](OpenmrsResourceStrict.md#uuid)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L13)

___

### voided

• `Optional` **voided**: `boolean`

#### Defined in

[packages/framework/esm-api/src/types/patient-resource.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/patient-resource.ts#L27)
