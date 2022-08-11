[@openmrs/esm-framework](../API.md) / SyncItem

# Interface: SyncItem<T\>

Defines an item queued up in the offline synchronization queue.
A `SyncItem` contains both meta information about the item in the sync queue, as well as the
actual data to be synchronized (i.e. the item's `content`).

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Table of contents

### Offline Properties

- [content](SyncItem.md#content)
- [createdOn](SyncItem.md#createdon)
- [descriptor](SyncItem.md#descriptor)
- [id](SyncItem.md#id)
- [lastError](SyncItem.md#lasterror)
- [type](SyncItem.md#type)
- [userId](SyncItem.md#userid)

## Offline Properties

### content

• **content**: `T`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L16)

___

### createdOn

• **createdOn**: `Date`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L17)

___

### descriptor

• **descriptor**: [`QueueItemDescriptor`](QueueItemDescriptor.md)

#### Defined in

[packages/framework/esm-offline/src/sync.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L18)

___

### id

• `Optional` **id**: `number`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L13)

___

### lastError

• `Optional` **lastError**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `name?` | `string` |

#### Defined in

[packages/framework/esm-offline/src/sync.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L19)

___

### type

• **type**: `string`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L15)

___

### userId

• **userId**: `string`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L14)
