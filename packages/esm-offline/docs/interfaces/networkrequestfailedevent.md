[@openmrs/esm-offline](../API.md) / NetworkRequestFailedEvent

# Interface: NetworkRequestFailedEvent

## Hierarchy

* [*OmrsServiceWorkerEvent*](omrsserviceworkerevent.md)<``"networkRequestFailed"``\>

  ↳ **NetworkRequestFailedEvent**

## Table of contents

### Properties

- [request](networkrequestfailedevent.md#request)
- [type](networkrequestfailedevent.md#type)

## Properties

### request

• **request**: *object*

#### Type declaration:

| Name | Type |
| :------ | :------ |
| `body` | *string* |
| `headers` | *Record*<string, string\> |
| `method` | *string* |
| `url` | *string* |

Defined in: [service-worker-events.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-offline/src/service-worker-events.ts#L7)

___

### type

• **type**: ``"networkRequestFailed"``

Inherited from: [OmrsServiceWorkerEvent](omrsserviceworkerevent.md).[type](omrsserviceworkerevent.md#type)

Defined in: [service-worker-events.ts:2](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-offline/src/service-worker-events.ts#L2)
