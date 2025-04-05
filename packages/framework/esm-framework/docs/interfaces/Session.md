[@openmrs/esm-framework](../API.md) / Session

# Interface: Session

## Table of contents

### Properties

- [allowedLocales](Session.md#allowedlocales)
- [authenticated](Session.md#authenticated)
- [currentProvider](Session.md#currentprovider)
- [locale](Session.md#locale)
- [sessionId](Session.md#sessionid)
- [sessionLocation](Session.md#sessionlocation)
- [user](Session.md#user)

## Properties

### allowedLocales

• `Optional` **allowedLocales**: `string`[]

#### Defined in

[packages/framework/esm-api/src/types/user-resource.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L5)

___

### authenticated

• **authenticated**: `boolean`

#### Defined in

[packages/framework/esm-api/src/types/user-resource.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L6)

___

### currentProvider

• `Optional` **currentProvider**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `identifier` | `string` |
| `uuid` | `string` |

#### Defined in

[packages/framework/esm-api/src/types/user-resource.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L10)

___

### locale

• `Optional` **locale**: `string`

#### Defined in

[packages/framework/esm-api/src/types/user-resource.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L7)

___

### sessionId

• **sessionId**: `string`

#### Defined in

[packages/framework/esm-api/src/types/user-resource.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L8)

___

### sessionLocation

• `Optional` **sessionLocation**: [`SessionLocation`](SessionLocation.md)

#### Defined in

[packages/framework/esm-api/src/types/user-resource.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L11)

___

### user

• `Optional` **user**: [`LoggedInUser`](LoggedInUser.md)

#### Defined in

[packages/framework/esm-api/src/types/user-resource.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/user-resource.ts#L9)
