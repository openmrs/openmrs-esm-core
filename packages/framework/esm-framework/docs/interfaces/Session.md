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

[packages/framework/esm-api/src/types/user-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/types/user-resource.ts#L14)

___

### authenticated

• **authenticated**: `boolean`

#### Defined in

[packages/framework/esm-api/src/types/user-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/types/user-resource.ts#L15)

___

### currentProvider

• `Optional` **currentProvider**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `identifier` | `string` |
| `uuid` | `string` |

#### Defined in

[packages/framework/esm-api/src/types/user-resource.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/types/user-resource.ts#L19)

___

### locale

• `Optional` **locale**: `string`

#### Defined in

[packages/framework/esm-api/src/types/user-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/types/user-resource.ts#L16)

___

### sessionId

• **sessionId**: `string`

#### Defined in

[packages/framework/esm-api/src/types/user-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/types/user-resource.ts#L17)

___

### sessionLocation

• `Optional` **sessionLocation**: [`SessionLocation`](SessionLocation.md)

#### Defined in

[packages/framework/esm-api/src/types/user-resource.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/types/user-resource.ts#L20)

___

### user

• `Optional` **user**: [`LoggedInUser`](LoggedInUser.md)

#### Defined in

[packages/framework/esm-api/src/types/user-resource.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/src/types/user-resource.ts#L18)
