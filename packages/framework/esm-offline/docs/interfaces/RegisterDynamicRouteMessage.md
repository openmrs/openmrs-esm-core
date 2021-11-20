[@openmrs/esm-offline](../API.md) / RegisterDynamicRouteMessage

# Interface: RegisterDynamicRouteMessage

## Hierarchy

- [`OmrsServiceWorkerMessage`](OmrsServiceWorkerMessage.md)<``"registerDynamicRoute"``\>

  ↳ **`RegisterDynamicRouteMessage`**

## Table of contents

### Properties

- [pattern](RegisterDynamicRouteMessage.md#pattern)
- [strategy](RegisterDynamicRouteMessage.md#strategy)
- [type](RegisterDynamicRouteMessage.md#type)
- [url](RegisterDynamicRouteMessage.md#url)

## Properties

### pattern

• `Optional` **pattern**: `string`

#### Defined in

[service-worker-messaging.ts:40](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-messaging.ts#L40)

___

### strategy

• `Optional` **strategy**: [`OmrsOfflineCachingStrategy`](../API.md#omrsofflinecachingstrategy)

#### Defined in

[service-worker-messaging.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-messaging.ts#L42)

___

### type

• **type**: ``"registerDynamicRoute"``

#### Inherited from

[OmrsServiceWorkerMessage](OmrsServiceWorkerMessage.md).[type](OmrsServiceWorkerMessage.md#type)

#### Defined in

[service-worker-messaging.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-messaging.ts#L27)

___

### url

• `Optional` **url**: `string`

#### Defined in

[service-worker-messaging.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-messaging.ts#L41)
