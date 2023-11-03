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

[packages/framework/esm-offline/src/service-worker-messaging.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-messaging.ts#L41)

___

### strategy

• `Optional` **strategy**: [`OmrsOfflineCachingStrategy`](../API.md#omrsofflinecachingstrategy)

#### Defined in

[packages/framework/esm-offline/src/service-worker-messaging.ts:43](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-messaging.ts#L43)

___

### type

• **type**: ``"registerDynamicRoute"``

#### Inherited from

[OmrsServiceWorkerMessage](OmrsServiceWorkerMessage.md).[type](OmrsServiceWorkerMessage.md#type)

#### Defined in

[packages/framework/esm-offline/src/service-worker-messaging.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-messaging.ts#L28)

___

### url

• `Optional` **url**: `string`

#### Defined in

[packages/framework/esm-offline/src/service-worker-messaging.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/service-worker-messaging.ts#L42)
