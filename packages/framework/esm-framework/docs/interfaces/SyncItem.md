[@openmrs/esm-framework](../API.md) / SyncItem

# Interface: SyncItem

## Table of contents

### Properties

- [content](SyncItem.md#content)
- [createdOn](SyncItem.md#createdon)
- [descriptor](SyncItem.md#descriptor)
- [id](SyncItem.md#id)
- [lastError](SyncItem.md#lasterror)
- [type](SyncItem.md#type)
- [userId](SyncItem.md#userid)

## Properties

### content

• **content**: `any`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L9)

___

### createdOn

• **createdOn**: `Date`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L10)

___

### descriptor

• **descriptor**: [`QueueItemDescriptor`](QueueItemDescriptor.md)

#### Defined in

[packages/framework/esm-offline/src/sync.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L11)

___

### id

• `Optional` **id**: `number`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L6)

___

### lastError

• `Optional` **lastError**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `name?` | `string` |

#### Defined in

[packages/framework/esm-offline/src/sync.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L12)

___

### type

• **type**: `string`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L8)

___

### userId

• **userId**: `string`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L7)
