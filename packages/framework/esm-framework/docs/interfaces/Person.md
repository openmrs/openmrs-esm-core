[@openmrs/esm-framework](../API.md) / Person

# Interface: Person

## Hierarchy

- [`OpenmrsResourceStrict`](OpenmrsResourceStrict.md)

  ↳ **`Person`**

## Table of contents

### Properties

- [addresses](Person.md#addresses)
- [age](Person.md#age)
- [attributes](Person.md#attributes)
- [auditInfo](Person.md#auditinfo)
- [birthdate](Person.md#birthdate)
- [birthdateEstimated](Person.md#birthdateestimated)
- [birthtime](Person.md#birthtime)
- [causeOfDeath](Person.md#causeofdeath)
- [causeOfDeathNonCoded](Person.md#causeofdeathnoncoded)
- [dead](Person.md#dead)
- [deathDate](Person.md#deathdate)
- [deathdateEstimated](Person.md#deathdateestimated)
- [display](Person.md#display)
- [gender](Person.md#gender)
- [links](Person.md#links)
- [names](Person.md#names)
- [preferredAddress](Person.md#preferredaddress)
- [preferredName](Person.md#preferredname)
- [resourceVersion](Person.md#resourceversion)
- [uuid](Person.md#uuid)
- [voided](Person.md#voided)

## Properties

### addresses

• `Optional` **addresses**: [`PersonAddress`](PersonAddress.md)[]

#### Defined in

[packages/framework/esm-api/src/types/person-resource.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L21)

___

### age

• `Optional` **age**: `number`

#### Defined in

[packages/framework/esm-api/src/types/person-resource.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L12)

___

### attributes

• `Optional` **attributes**: [`PersonAttribute`](PersonAttribute.md)[]

#### Defined in

[packages/framework/esm-api/src/types/person-resource.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L22)

___

### auditInfo

• `Optional` **auditInfo**: [`AuditInfo`](AuditInfo.md)

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[auditInfo](OpenmrsResourceStrict.md#auditinfo)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

___

### birthdate

• `Optional` **birthdate**: `string`

#### Defined in

[packages/framework/esm-api/src/types/person-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L13)

___

### birthdateEstimated

• `Optional` **birthdateEstimated**: `boolean`

#### Defined in

[packages/framework/esm-api/src/types/person-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L14)

___

### birthtime

• `Optional` **birthtime**: ``null`` \| `string`

#### Defined in

[packages/framework/esm-api/src/types/person-resource.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L24)

___

### causeOfDeath

• `Optional` **causeOfDeath**: ``null`` \| [`Concept`](Concept.md)

#### Defined in

[packages/framework/esm-api/src/types/person-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L17)

___

### causeOfDeathNonCoded

• `Optional` **causeOfDeathNonCoded**: ``null`` \| `string`

#### Defined in

[packages/framework/esm-api/src/types/person-resource.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L26)

___

### dead

• `Optional` **dead**: `boolean`

#### Defined in

[packages/framework/esm-api/src/types/person-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L15)

___

### deathDate

• `Optional` **deathDate**: ``null`` \| `string`

#### Defined in

[packages/framework/esm-api/src/types/person-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L16)

___

### deathdateEstimated

• `Optional` **deathdateEstimated**: `boolean`

#### Defined in

[packages/framework/esm-api/src/types/person-resource.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L25)

___

### display

• `Optional` **display**: `string`

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[display](OpenmrsResourceStrict.md#display)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

___

### gender

• `Optional` **gender**: `string`

#### Defined in

[packages/framework/esm-api/src/types/person-resource.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L11)

___

### links

• `Optional` **links**: [`Link`](Link.md)[]

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[links](OpenmrsResourceStrict.md#links)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

___

### names

• `Optional` **names**: [`PersonName`](PersonName.md)[]

#### Defined in

[packages/framework/esm-api/src/types/person-resource.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L20)

___

### preferredAddress

• `Optional` **preferredAddress**: [`PersonAddress`](PersonAddress.md)

#### Defined in

[packages/framework/esm-api/src/types/person-resource.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L19)

___

### preferredName

• `Optional` **preferredName**: [`PersonName`](PersonName.md)

#### Defined in

[packages/framework/esm-api/src/types/person-resource.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L18)

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

[packages/framework/esm-api/src/types/person-resource.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L23)
