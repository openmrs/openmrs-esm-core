[@openmrs/esm-framework](../API.md) / OfflineSynchronizationStore

# Interface: OfflineSynchronizationStore

Represents the data inside the global offline synchronization store.
Provides information about a currently ongoing synchronization.

## Table of contents

### Properties

- [synchronization](OfflineSynchronizationStore.md#synchronization)

## Properties

### synchronization

• `Optional` **synchronization**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abortController` | `AbortController` |
| `pendingCount` | `number` |
| `totalCount` | `number` |

#### Defined in

[packages/framework/esm-offline/src/sync.ts:93](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L93)
