[@openmrs/esm-framework](../API.md) / PatientIdentifier

# Interface: PatientIdentifier

## Hierarchy

- `OpenmrsResourceStrict`

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

• `Optional` **auditInfo**: `AuditInfo`

#### Inherited from

OpenmrsResourceStrict.auditInfo

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:14

___

### display

• `Optional` **display**: `string`

#### Inherited from

OpenmrsResourceStrict.display

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:12

___

### identifier

• `Optional` **identifier**: `string`

#### Defined in

[packages/framework/esm-emr-api/src/types/patient-resource.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L22)

___

### identifierType

• `Optional` **identifierType**: [`PatientIdentifierType`](PatientIdentifierType.md)

#### Defined in

[packages/framework/esm-emr-api/src/types/patient-resource.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L23)

___

### links

• `Optional` **links**: `Link`[]

#### Inherited from

OpenmrsResourceStrict.links

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:13

___

### location

• `Optional` **location**: `Location`

#### Defined in

[packages/framework/esm-emr-api/src/types/patient-resource.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L24)

___

### preferred

• `Optional` **preferred**: `boolean`

#### Defined in

[packages/framework/esm-emr-api/src/types/patient-resource.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L25)

___

### resourceVersion

• `Optional` **resourceVersion**: `string`

#### Inherited from

OpenmrsResourceStrict.resourceVersion

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:15

___

### uuid

• **uuid**: `string`

#### Inherited from

OpenmrsResourceStrict.uuid

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:11

___

### voided

• `Optional` **voided**: `boolean`

#### Defined in

[packages/framework/esm-emr-api/src/types/patient-resource.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L26)
