[O3 Framework](../API.md) / setupOfflineSync

# Function: setupOfflineSync()

> **setupOfflineSync**\<`T`\>(`type`, `dependsOn`, `process`, `options`): `void`

Defined in: [packages/framework/esm-offline/src/sync.ts:365](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L365)

Registers a new synchronization handler which is able to synchronize data of a specific type.

## Type Parameters

### T

`T`

## Parameters

### type

`string`

The identifying type of the synchronization items which can be handled by this handler.

### dependsOn

`string`[]

An array of other sync item types which must be synchronized before this handler
  can synchronize its own data. Items of these types are effectively dependencies of the data
  synchronized by this handler.

### process

`ProcessSyncItem`\<`T`\>

A function which, when invoked, performs the actual client-server synchronization of the given
  `item` (which is the actual data to be synchronized).

### options

`SetupOfflineSyncOptions`\<`T`\> = `{}`

Additional options which can optionally be provided when setting up a synchronization callback
  for a specific synchronization item type.

## Returns

`void`
