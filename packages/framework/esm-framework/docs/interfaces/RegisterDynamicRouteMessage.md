[O3 Framework](../API.md) / RegisterDynamicRouteMessage

# Interface: RegisterDynamicRouteMessage

Defined in: [packages/framework/esm-offline/src/service-worker-messaging.ts:36](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-messaging.ts#L36)

## Extends

- [`OmrsServiceWorkerMessage`](OmrsServiceWorkerMessage.md)\<`"registerDynamicRoute"`\>

## Properties

### pattern?

> `optional` **pattern**: `string`

Defined in: [packages/framework/esm-offline/src/service-worker-messaging.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-messaging.ts#L37)

***

### strategy?

> `optional` **strategy**: [`OmrsOfflineCachingStrategy`](../type-aliases/OmrsOfflineCachingStrategy.md)

Defined in: [packages/framework/esm-offline/src/service-worker-messaging.ts:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-messaging.ts#L39)

***

### type

> **type**: `"registerDynamicRoute"`

Defined in: [packages/framework/esm-offline/src/service-worker-messaging.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-messaging.ts#L26)

#### Inherited from

[`OmrsServiceWorkerMessage`](OmrsServiceWorkerMessage.md).[`type`](OmrsServiceWorkerMessage.md#type)

***

### url?

> `optional` **url**: `string`

Defined in: [packages/framework/esm-offline/src/service-worker-messaging.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-messaging.ts#L38)
