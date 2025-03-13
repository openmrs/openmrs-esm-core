[@openmrs/esm-framework](../API.md) / Obs

# Interface: Obs

## Hierarchy

- [`OpenmrsResourceStrict`](OpenmrsResourceStrict.md)

  ↳ **`Obs`**

## Table of contents

### Properties

- [accessionNumber](Obs.md#accessionnumber)
- [auditInfo](Obs.md#auditinfo)
- [comment](Obs.md#comment)
- [concept](Obs.md#concept)
- [display](Obs.md#display)
- [encounter](Obs.md#encounter)
- [formFilePath](Obs.md#formfilepath)
- [formFiledNamespace](Obs.md#formfilednamespace)
- [groupMembers](Obs.md#groupmembers)
- [interpretation](Obs.md#interpretation)
- [links](Obs.md#links)
- [location](Obs.md#location)
- [obsDatetime](Obs.md#obsdatetime)
- [obsGroup](Obs.md#obsgroup)
- [order](Obs.md#order)
- [person](Obs.md#person)
- [resourceVersion](Obs.md#resourceversion)
- [status](Obs.md#status)
- [uuid](Obs.md#uuid)
- [value](Obs.md#value)
- [valueCodedName](Obs.md#valuecodedname)
- [valueModifier](Obs.md#valuemodifier)

## Properties

### accessionNumber

• `Optional` **accessionNumber**: `string`

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L11)

___

### auditInfo

• `Optional` **auditInfo**: [`AuditInfo`](AuditInfo.md)

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[auditInfo](OpenmrsResourceStrict.md#auditinfo)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

___

### comment

• `Optional` **comment**: `string`

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L15)

___

### concept

• `Optional` **concept**: [`Concept`](Concept.md)

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L8)

___

### display

• `Optional` **display**: `string`

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[display](OpenmrsResourceStrict.md#display)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

___

### encounter

• `Optional` **encounter**: [`Encounter`](Encounter.md)

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L18)

___

### formFilePath

• `Optional` **formFilePath**: `string`

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L21)

___

### formFiledNamespace

• `Optional` **formFiledNamespace**: `string`

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L22)

___

### groupMembers

• `Optional` **groupMembers**: [`Obs`](Obs.md)[]

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L14)

___

### interpretation

• `Optional` **interpretation**: `string`

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L24)

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

[packages/framework/esm-api/src/types/obs-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L16)

___

### obsDatetime

• `Optional` **obsDatetime**: `string`

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L10)

___

### obsGroup

• `Optional` **obsGroup**: [`Obs`](Obs.md)

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L12)

___

### order

• `Optional` **order**: [`OpenmrsResource`](OpenmrsResource.md)

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L17)

___

### person

• `Optional` **person**: [`Person`](Person.md)

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L9)

___

### resourceVersion

• `Optional` **resourceVersion**: `string`

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[resourceVersion](OpenmrsResourceStrict.md#resourceversion)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L17)

___

### status

• `Optional` **status**: ``"PRELIMINARY"`` \| ``"FINAL"`` \| ``"AMENDED"``

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L23)

___

### uuid

• **uuid**: `string`

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[uuid](OpenmrsResourceStrict.md#uuid)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L13)

___

### value

• `Optional` **value**: `string` \| `number` \| `boolean` \| [`OpenmrsResource`](OpenmrsResource.md)

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L19)

___

### valueCodedName

• `Optional` **valueCodedName**: [`OpenmrsResource`](OpenmrsResource.md)

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L13)

___

### valueModifier

• `Optional` **valueModifier**: `string`

#### Defined in

[packages/framework/esm-api/src/types/obs-resource.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/obs-resource.ts#L20)
