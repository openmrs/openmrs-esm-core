[@openmrs/esm-framework](../API.md) / RegisterDynamicRouteMessage

# Interface: RegisterDynamicRouteMessage

## Hierarchy

- [`OmrsServiceWorkerMessage`](OmrsServiceWorkerMessage.md)<``"registerDynamicRoute"``\>

  ↳ **`RegisterDynamicRouteMessage`**

## Table of contents

### Offline Properties

- [pattern](RegisterDynamicRouteMessage.md#pattern)
- [strategy](RegisterDynamicRouteMessage.md#strategy)
- [type](RegisterDynamicRouteMessage.md#type)
- [url](RegisterDynamicRouteMessage.md#url)

## Offline Properties

### pattern

• `Optional` **pattern**: `string`

#### Defined in

[packages/framework/esm-offline/src/service-worker-messaging.ts:36](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-messaging.ts#L36)

___

### strategy

• `Optional` **strategy**: [`OmrsOfflineCachingStrategy`](../API.md#omrsofflinecachingstrategy)

#### Defined in

[packages/framework/esm-offline/src/service-worker-messaging.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-messaging.ts#L38)

___

### type

• **type**: ``"registerDynamicRoute"``

#### Inherited from

[OmrsServiceWorkerMessage](OmrsServiceWorkerMessage.md).[type](OmrsServiceWorkerMessage.md#type)

#### Defined in

[packages/framework/esm-offline/src/service-worker-messaging.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-messaging.ts#L26)

___

### url

• `Optional` **url**: `string`

#### Defined in

[packages/framework/esm-offline/src/service-worker-messaging.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-messaging.ts#L37)
