[@openmrs/esm-framework](../API.md) / Obs

# Interface: Obs

## Hierarchy

- `OpenmrsResource`

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

[packages/framework/esm-emr-api/src/types/obs-resource.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L9)

___

### auditInfo

• `Optional` **auditInfo**: `AuditInfo`

#### Inherited from

OpenmrsResource.auditInfo

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:14

___

### comment

• `Optional` **comment**: `string`

#### Defined in

[packages/framework/esm-emr-api/src/types/obs-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L13)

___

### concept

• `Optional` **concept**: `Concept`

#### Defined in

[packages/framework/esm-emr-api/src/types/obs-resource.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L6)

___

### display

• `Optional` **display**: `string`

#### Inherited from

OpenmrsResource.display

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:12

___

### encounter

• `Optional` **encounter**: [`Encounter`](Encounter.md)

#### Defined in

[packages/framework/esm-emr-api/src/types/obs-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L16)

___

### formFilePath

• `Optional` **formFilePath**: `string`

#### Defined in

[packages/framework/esm-emr-api/src/types/obs-resource.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L19)

___

### formFiledNamespace

• `Optional` **formFiledNamespace**: `string`

#### Defined in

[packages/framework/esm-emr-api/src/types/obs-resource.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L20)

___

### groupMembers

• `Optional` **groupMembers**: [`Obs`](Obs.md)[]

#### Defined in

[packages/framework/esm-emr-api/src/types/obs-resource.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L12)

___

### interpretation

• `Optional` **interpretation**: `string`

#### Defined in

[packages/framework/esm-emr-api/src/types/obs-resource.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L22)

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

[packages/framework/esm-emr-api/src/types/obs-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L14)

___

### obsDatetime

• `Optional` **obsDatetime**: `string`

#### Defined in

[packages/framework/esm-emr-api/src/types/obs-resource.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L8)

___

### obsGroup

• `Optional` **obsGroup**: [`Obs`](Obs.md)

#### Defined in

[packages/framework/esm-emr-api/src/types/obs-resource.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L10)

___

### order

• `Optional` **order**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-emr-api/src/types/obs-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L15)

___

### person

• `Optional` **person**: `Person`

#### Defined in

[packages/framework/esm-emr-api/src/types/obs-resource.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L7)

___

### resourceVersion

• `Optional` **resourceVersion**: `string`

#### Inherited from

OpenmrsResource.resourceVersion

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:15

___

### status

• `Optional` **status**: ``"PRELIMINARY"`` \| ``"FINAL"`` \| ``"AMENDED"``

#### Defined in

[packages/framework/esm-emr-api/src/types/obs-resource.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L21)

___

### uuid

• **uuid**: `string`

#### Inherited from

OpenmrsResource.uuid

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:11

___

### value

• `Optional` **value**: `string` \| `number` \| `boolean` \| `OpenmrsResource`

#### Defined in

[packages/framework/esm-emr-api/src/types/obs-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L17)

___

### valueCodedName

• `Optional` **valueCodedName**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-emr-api/src/types/obs-resource.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L11)

___

### valueModifier

• `Optional` **valueModifier**: `string`

#### Defined in

[packages/framework/esm-emr-api/src/types/obs-resource.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/obs-resource.ts#L18)
