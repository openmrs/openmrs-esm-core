[O3 Framework](../API.md) / subscribeOpenmrsEvent

# Function: subscribeOpenmrsEvent()

> **subscribeOpenmrsEvent**\<`T`\>(`event`, `handler`): () => `void`

Defined in: [packages/framework/esm-emr-api/src/events/index.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/events/index.ts#L24)

Subscribes to a custom OpenMRS event

## Type Parameters

### T

`T` *extends* keyof [`OpenmrsEventTypes`](../interfaces/OpenmrsEventTypes.md)

## Parameters

### event

`T`

The name of the event to listen to

### handler

(`payload?`) => `boolean` \| `void`

The callback to be called when the event fires

## Returns

> (): `void`

### Returns

`void`
