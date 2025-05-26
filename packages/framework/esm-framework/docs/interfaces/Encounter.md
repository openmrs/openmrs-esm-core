[@openmrs/esm-framework](../API.md) / Encounter

# Interface: Encounter

## Hierarchy

- `OpenmrsResource`

  ↳ **`Encounter`**

## Table of contents

### Properties

- [auditInfo](Encounter.md#auditinfo)
- [diagnoses](Encounter.md#diagnoses)
- [display](Encounter.md#display)
- [encounterDatetime](Encounter.md#encounterdatetime)
- [encounterProviders](Encounter.md#encounterproviders)
- [encounterType](Encounter.md#encountertype)
- [form](Encounter.md#form)
- [links](Encounter.md#links)
- [location](Encounter.md#location)
- [obs](Encounter.md#obs)
- [patient](Encounter.md#patient)
- [resourceVersion](Encounter.md#resourceversion)
- [uuid](Encounter.md#uuid)
- [visit](Encounter.md#visit)

## Properties

### auditInfo

• `Optional` **auditInfo**: `AuditInfo`

#### Inherited from

OpenmrsResource.auditInfo

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:14

___

### diagnoses

• `Optional` **diagnoses**: [`Diagnosis`](Diagnosis.md)[]

#### Defined in

[packages/framework/esm-emr-api/src/types/encounter-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L17)

___

### display

• `Optional` **display**: `string`

#### Inherited from

OpenmrsResource.display

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:12

___

### encounterDatetime

• `Optional` **encounterDatetime**: `string`

#### Defined in

[packages/framework/esm-emr-api/src/types/encounter-resource.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L10)

___

### encounterProviders

• `Optional` **encounterProviders**: [`EncounterProvider`](EncounterProvider.md)[]

#### Defined in

[packages/framework/esm-emr-api/src/types/encounter-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L16)

___

### encounterType

• `Optional` **encounterType**: [`EncounterType`](EncounterType.md)

#### Defined in

[packages/framework/esm-emr-api/src/types/encounter-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L13)

___

### form

• `Optional` **form**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-emr-api/src/types/encounter-resource.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L18)

___

### links

• `Optional` **links**: `Link`[]

#### Inherited from

OpenmrsResource.links

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:13

___

### location

• `Optional` **location**: [`Location`](Location.md)

#### Defined in

[packages/framework/esm-emr-api/src/types/encounter-resource.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L12)

___

### obs

• `Optional` **obs**: [`Obs`](Obs.md)[]

#### Defined in

[packages/framework/esm-emr-api/src/types/encounter-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L14)

___

### patient

• `Optional` **patient**: [`Patient`](Patient.md)

#### Defined in

[packages/framework/esm-emr-api/src/types/encounter-resource.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L11)

___

### resourceVersion

• `Optional` **resourceVersion**: `string`

#### Inherited from

OpenmrsResource.resourceVersion

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:15

___

### uuid

• **uuid**: `string`

#### Inherited from

OpenmrsResource.uuid

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:11

___

### visit

• `Optional` **visit**: [`Visit`](Visit.md)

#### Defined in

[packages/framework/esm-emr-api/src/types/encounter-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/encounter-resource.ts#L15)
