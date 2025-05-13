[@openmrs/esm-framework](../API.md) / Patient

# Interface: Patient

## Hierarchy

- `OpenmrsResourceStrict`

  ↳ **`Patient`**

## Table of contents

### Properties

- [auditInfo](Patient.md#auditinfo)
- [display](Patient.md#display)
- [identifiers](Patient.md#identifiers)
- [links](Patient.md#links)
- [person](Patient.md#person)
- [resourceVersion](Patient.md#resourceversion)
- [uuid](Patient.md#uuid)
- [voided](Patient.md#voided)

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

### identifiers

• `Optional` **identifiers**: [`PatientIdentifier`](PatientIdentifier.md)[]

#### Defined in

[packages/framework/esm-emr-api/src/types/patient-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L16)

___

### links

• `Optional` **links**: `Link`[]

#### Inherited from

OpenmrsResourceStrict.links

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:13

___

### person

• `Optional` **person**: `Person`

#### Defined in

[packages/framework/esm-emr-api/src/types/patient-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L17)

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

[packages/framework/esm-emr-api/src/types/patient-resource.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L18)
