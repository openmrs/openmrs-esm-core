[@openmrs/esm-framework](../API.md) / NetworkRequestFailedEvent

# Interface: NetworkRequestFailedEvent

## Hierarchy

- [`OmrsServiceWorkerEvent`](OmrsServiceWorkerEvent.md)<``"networkRequestFailed"``\>

  ↳ **`NetworkRequestFailedEvent`**

## Table of contents

### Properties

- [request](NetworkRequestFailedEvent.md#request)
- [type](NetworkRequestFailedEvent.md#type)

## Properties

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

[packages/framework/esm-offline/src/service-worker-events.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-events.ts#L7)

___

### type

• **type**: ``"networkRequestFailed"``

#### Inherited from

[OmrsServiceWorkerEvent](OmrsServiceWorkerEvent.md).[type](OmrsServiceWorkerEvent.md#type)

#### Defined in

[packages/framework/esm-offline/src/service-worker-events.ts:2](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-events.ts#L2)
