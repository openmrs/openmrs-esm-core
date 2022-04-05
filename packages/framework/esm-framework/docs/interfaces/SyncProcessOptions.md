[@openmrs/esm-framework](../API.md) / SyncProcessOptions

# Interface: SyncProcessOptions<T\>

Additional data which can be used for synchronizing data in a [ProcessSyncItem](../API.md#processsyncitem) function.

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [abort](SyncProcessOptions.md#abort)
- [dependencies](SyncProcessOptions.md#dependencies)
- [index](SyncProcessOptions.md#index)
- [items](SyncProcessOptions.md#items)
- [userId](SyncProcessOptions.md#userid)

## Properties

### abort

• **abort**: `AbortController`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:54](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L54)

___

### dependencies

• **dependencies**: `any`[]

#### Defined in

[packages/framework/esm-offline/src/sync.ts:58](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L58)

___

### index

• **index**: `number`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:56](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L56)

___

### items

• **items**: `T`[]

#### Defined in

[packages/framework/esm-offline/src/sync.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L57)

___

### userId

• **userId**: `string`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L55)
