[@openmrs/esm-framework](../API.md) / Encounter

# Interface: Encounter

## Hierarchy

- [`OpenmrsResourceStrict`](OpenmrsResourceStrict.md)

  ↳ **`Encounter`**

## Table of contents

### Properties

- [auditInfo](Encounter.md#auditinfo)
- [diagnoses](Encounter.md#diagnoses)
- [display](Encounter.md#display)
- [encounterDateTime](Encounter.md#encounterdatetime)
- [encounterProviders](Encounter.md#encounterproviders)
- [encounterType](Encounter.md#encountertype)
- [links](Encounter.md#links)
- [location](Encounter.md#location)
- [obs](Encounter.md#obs)
- [patient](Encounter.md#patient)
- [resourceVersion](Encounter.md#resourceversion)
- [uuid](Encounter.md#uuid)
- [visit](Encounter.md#visit)

## Properties

### auditInfo

• `Optional` **auditInfo**: [`AuditInfo`](AuditInfo.md)

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[auditInfo](OpenmrsResourceStrict.md#auditinfo)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

___

### diagnoses

• `Optional` **diagnoses**: [`Diagnosis`](Diagnosis.md)[]

#### Defined in

[packages/framework/esm-api/src/types/encounter-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/encounter-resource.ts#L16)

___

### display

• `Optional` **display**: `string`

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[display](OpenmrsResourceStrict.md#display)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

___

### encounterDateTime

• `Optional` **encounterDateTime**: `string`

#### Defined in

[packages/framework/esm-api/src/types/encounter-resource.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/encounter-resource.ts#L9)

___

### encounterProviders

• `Optional` **encounterProviders**: [`OpenmrsResource`](OpenmrsResource.md)[]

#### Defined in

[packages/framework/esm-api/src/types/encounter-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/encounter-resource.ts#L15)

___

### encounterType

• `Optional` **encounterType**: [`EncounterType`](EncounterType.md)

#### Defined in

[packages/framework/esm-api/src/types/encounter-resource.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/encounter-resource.ts#L12)

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

[packages/framework/esm-api/src/types/encounter-resource.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/encounter-resource.ts#L11)

___

### obs

• `Optional` **obs**: [`Obs`](Obs.md)[]

#### Defined in

[packages/framework/esm-api/src/types/encounter-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/encounter-resource.ts#L13)

___

### patient

• `Optional` **patient**: [`Patient`](Patient.md)

#### Defined in

[packages/framework/esm-api/src/types/encounter-resource.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/encounter-resource.ts#L10)

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

### visit

• `Optional` **visit**: [`Visit`](Visit.md)

#### Defined in

[packages/framework/esm-api/src/types/encounter-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/encounter-resource.ts#L14)
