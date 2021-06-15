[Back to README.md](../README.md)

# @openmrs/esm-offline

## Table of contents

### Interfaces

- [ClearDynamicRoutesMessage](interfaces/cleardynamicroutesmessage.md)
- [MessageServiceWorkerResult](interfaces/messageserviceworkerresult.md)
- [NetworkRequestFailedEvent](interfaces/networkrequestfailedevent.md)
- [OfflineStore](interfaces/offlinestore.md)
- [OmrsServiceWorkerEvent](interfaces/omrsserviceworkerevent.md)
- [OmrsServiceWorkerMessage](interfaces/omrsserviceworkermessage.md)
- [OnImportMapChangedMessage](interfaces/onimportmapchangedmessage.md)
- [RegisterDynamicRouteMessage](interfaces/registerdynamicroutemessage.md)

### Type aliases

- [KnownOmrsServiceWorkerEvents](API.md#knownomrsserviceworkerevents)
- [KnownOmrsServiceWorkerMessages](API.md#knownomrsserviceworkermessages)
- [SynchronizeCallback](API.md#synchronizecallback)

### Functions

- [dispatchNetworkRequestFailed](API.md#dispatchnetworkrequestfailed)
- [getOmrsServiceWorker](API.md#getomrsserviceworker)
- [getSynchronizationCallbacks](API.md#getsynchronizationcallbacks)
- [messageOmrsServiceWorker](API.md#messageomrsserviceworker)
- [patchXMLHttpRequest](API.md#patchxmlhttprequest)
- [registerOmrsServiceWorker](API.md#registeromrsserviceworker)
- [registerSynchronizationCallback](API.md#registersynchronizationcallback)
- [subscribeNetworkRequestFailed](API.md#subscribenetworkrequestfailed)

## Type aliases

### KnownOmrsServiceWorkerEvents

Ƭ **KnownOmrsServiceWorkerEvents**: [*NetworkRequestFailedEvent*](interfaces/networkrequestfailedevent.md)

Defined in: [service-worker-events.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-events.ts#L15)

___

### KnownOmrsServiceWorkerMessages

Ƭ **KnownOmrsServiceWorkerMessages**: [*OnImportMapChangedMessage*](interfaces/onimportmapchangedmessage.md) \| [*ClearDynamicRoutesMessage*](interfaces/cleardynamicroutesmessage.md) \| [*RegisterDynamicRouteMessage*](interfaces/registerdynamicroutemessage.md)

Defined in: [service-worker-messaging.ts:36](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-messaging.ts#L36)

___

### SynchronizeCallback

Ƭ **SynchronizeCallback**: () => *Promise*<void\>

#### Type declaration

▸ (): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [store.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/store.ts#L3)

## Functions

### dispatchNetworkRequestFailed

▸ **dispatchNetworkRequestFailed**(`data`: [*NetworkRequestFailedEvent*](interfaces/networkrequestfailedevent.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [*NetworkRequestFailedEvent*](interfaces/networkrequestfailedevent.md) |

**Returns:** *void*

Defined in: [events.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/events.ts#L5)

___

### getOmrsServiceWorker

▸ **getOmrsServiceWorker**(): *Promise*<Workbox\>

Returns a `Workbox` instance which allows interacting with the application's global Service Worker.

**Warning:** The promise may never resolve if the Service Worker is never registered (which
can, for example, happen when the browser is missing the required capabilities).

**Returns:** *Promise*<Workbox\>

A promise which will resolve once the application's Service Worker has been initialized.

Defined in: [service-worker.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker.ts#L49)

___

### getSynchronizationCallbacks

▸ **getSynchronizationCallbacks**(): [*SynchronizeCallback*](API.md#synchronizecallback)[]

**Returns:** [*SynchronizeCallback*](API.md#synchronizecallback)[]

Defined in: [store.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/store.ts#L13)

___

### messageOmrsServiceWorker

▸ **messageOmrsServiceWorker**(`message`: [*KnownOmrsServiceWorkerMessages*](API.md#knownomrsserviceworkermessages)): *Promise*<[*MessageServiceWorkerResult*](interfaces/messageserviceworkerresult.md)<any\>\>

Sends the specified message to the application's service worker.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [*KnownOmrsServiceWorkerMessages*](API.md#knownomrsserviceworkermessages) | The message to be sent. |

**Returns:** *Promise*<[*MessageServiceWorkerResult*](interfaces/messageserviceworkerresult.md)<any\>\>

A promise which completes when the message has been successfully processed by the Service Worker.

Defined in: [service-worker-messaging.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-messaging.ts#L9)

___

### patchXMLHttpRequest

▸ **patchXMLHttpRequest**(): *void*

**Returns:** *void*

Defined in: [patches.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/patches.ts#L1)

___

### registerOmrsServiceWorker

▸ **registerOmrsServiceWorker**(`scriptUrl`: *string*, `registerOptions?`: *object*): *Workbox*

If not yet registered, registers the application's global Service Worker.
Throws if registration is not possible.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptUrl` | *string* |
| `registerOptions?` | *object* |

**Returns:** *Workbox*

The registered Service Worker.

Defined in: [service-worker.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker.ts#L18)

___

### registerSynchronizationCallback

▸ **registerSynchronizationCallback**(`cb`: [*SynchronizeCallback*](API.md#synchronizecallback)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [*SynchronizeCallback*](API.md#synchronizecallback) |

**Returns:** *void*

Defined in: [store.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/store.ts#L17)

___

### subscribeNetworkRequestFailed

▸ **subscribeNetworkRequestFailed**(`cb`: (`data`: [*NetworkRequestFailedEvent*](interfaces/networkrequestfailedevent.md)) => *void*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`data`: [*NetworkRequestFailedEvent*](interfaces/networkrequestfailedevent.md)) => *void* |

**Returns:** () => *void*

Defined in: [events.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/events.ts#L11)
