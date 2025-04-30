[O3 Framework](../API.md) / messageOmrsServiceWorker

# Function: messageOmrsServiceWorker()

> **messageOmrsServiceWorker**(`message`): `Promise`\<[`MessageServiceWorkerResult`](../interfaces/MessageServiceWorkerResult.md)\<`any`\>\>

Defined in: [packages/framework/esm-offline/src/service-worker-messaging.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-offline/src/service-worker-messaging.ts#L11)

Sends the specified message to the application's service worker.

## Parameters

### message

[`KnownOmrsServiceWorkerMessages`](../type-aliases/KnownOmrsServiceWorkerMessages.md)

The message to be sent.

## Returns

`Promise`\<[`MessageServiceWorkerResult`](../interfaces/MessageServiceWorkerResult.md)\<`any`\>\>

A promise which completes when the message has been successfully processed by the Service Worker.
