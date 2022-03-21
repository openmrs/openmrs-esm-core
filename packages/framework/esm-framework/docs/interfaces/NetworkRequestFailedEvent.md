[@openmrs/esm-framework](../API.md) / NetworkRequestFailedEvent

# Interface: NetworkRequestFailedEvent

## Hierarchy

- [`OmrsServiceWorkerEvent`](OmrsServiceWorkerEvent.md)<``"networkRequestFailed"``\>

  ↳ **`NetworkRequestFailedEvent`**

## Table of contents

### Offline Properties

- [request](NetworkRequestFailedEvent.md#request)
- [type](NetworkRequestFailedEvent.md#type)

## Offline Properties

### request

• **request**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `body` | `string` |
| `headers` | `Record`<`string`, `string`\> |
| `method` | `string` |
| `url` | `string` |

#### Defined in

[packages/framework/esm-offline/src/service-worker-events.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-events.ts#L9)

___

### type

• **type**: ``"networkRequestFailed"``

#### Inherited from

[OmrsServiceWorkerEvent](OmrsServiceWorkerEvent.md).[type](OmrsServiceWorkerEvent.md#type)

#### Defined in

[packages/framework/esm-offline/src/service-worker-events.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-events.ts#L4)
