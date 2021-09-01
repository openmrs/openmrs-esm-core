[Back to README.md](../README.md)

# @openmrs/esm-offline

## Table of contents

### Interfaces

- [ClearDynamicRoutesMessage](interfaces/ClearDynamicRoutesMessage.md)
- [MessageServiceWorkerResult](interfaces/MessageServiceWorkerResult.md)
- [NetworkRequestFailedEvent](interfaces/NetworkRequestFailedEvent.md)
- [OfflinePatientArgs](interfaces/OfflinePatientArgs.md)
- [OfflinePatientDataSyncHandler](interfaces/OfflinePatientDataSyncHandler.md)
- [OfflinePatientDataSyncState](interfaces/OfflinePatientDataSyncState.md)
- [OfflinePatientDataSyncStore](interfaces/OfflinePatientDataSyncStore.md)
- [OmrsServiceWorkerEvent](interfaces/OmrsServiceWorkerEvent.md)
- [OmrsServiceWorkerMessage](interfaces/OmrsServiceWorkerMessage.md)
- [OnImportMapChangedMessage](interfaces/OnImportMapChangedMessage.md)
- [QueueItemDescriptor](interfaces/QueueItemDescriptor.md)
- [RegisterDynamicRouteMessage](interfaces/RegisterDynamicRouteMessage.md)
- [SyncProcessOptions](interfaces/SyncProcessOptions.md)

### Type aliases

- [KnownOmrsServiceWorkerEvents](API.md#knownomrsserviceworkerevents)
- [KnownOmrsServiceWorkerMessages](API.md#knownomrsserviceworkermessages)
- [OmrsOfflineHttpHeaderNames](API.md#omrsofflinehttpheadernames)
- [OmrsOfflineHttpHeaders](API.md#omrsofflinehttpheaders)

### Variables

- [offlineUuidPrefix](API.md#offlineuuidprefix)
- [omrsOfflineCachingStrategyHttpHeaderName](API.md#omrsofflinecachingstrategyhttpheadername)
- [omrsOfflineResponseBodyHttpHeaderName](API.md#omrsofflineresponsebodyhttpheadername)
- [omrsOfflineResponseStatusHttpHeaderName](API.md#omrsofflineresponsestatushttpheadername)

### Functions

- [dispatchNetworkRequestFailed](API.md#dispatchnetworkrequestfailed)
- [generateOfflineUuid](API.md#generateofflineuuid)
- [getOfflinePatientDataStore](API.md#getofflinepatientdatastore)
- [getOmrsServiceWorker](API.md#getomrsserviceworker)
- [getSynchronizationItems](API.md#getsynchronizationitems)
- [getSynchronizationItemsFor](API.md#getsynchronizationitemsfor)
- [isOfflineUuid](API.md#isofflineuuid)
- [loadPersistedPatientDataSyncState](API.md#loadpersistedpatientdatasyncstate)
- [messageOmrsServiceWorker](API.md#messageomrsserviceworker)
- [patchXMLHttpRequest](API.md#patchxmlhttprequest)
- [queueSynchronizationItem](API.md#queuesynchronizationitem)
- [queueSynchronizationItemFor](API.md#queuesynchronizationitemfor)
- [registerOfflinePatientHandler](API.md#registerofflinepatienthandler)
- [registerOmrsServiceWorker](API.md#registeromrsserviceworker)
- [setupOfflineSync](API.md#setupofflinesync)
- [subscribeNetworkRequestFailed](API.md#subscribenetworkrequestfailed)
- [syncOfflinePatientData](API.md#syncofflinepatientdata)
- [triggerSynchronization](API.md#triggersynchronization)

## Type aliases

### KnownOmrsServiceWorkerEvents

Ƭ **KnownOmrsServiceWorkerEvents**: [`NetworkRequestFailedEvent`](interfaces/NetworkRequestFailedEvent.md)

#### Defined in

[service-worker-events.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-events.ts#L15)

___

### KnownOmrsServiceWorkerMessages

Ƭ **KnownOmrsServiceWorkerMessages**: [`OnImportMapChangedMessage`](interfaces/OnImportMapChangedMessage.md) \| [`ClearDynamicRoutesMessage`](interfaces/ClearDynamicRoutesMessage.md) \| [`RegisterDynamicRouteMessage`](interfaces/RegisterDynamicRouteMessage.md)

#### Defined in

[service-worker-messaging.ts:43](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-messaging.ts#L43)

___

### OmrsOfflineHttpHeaderNames

Ƭ **OmrsOfflineHttpHeaderNames**: keyof [`OmrsOfflineHttpHeaders`](API.md#omrsofflinehttpheaders)

#### Defined in

[service-worker-http-headers.ts:36](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L36)

___

### OmrsOfflineHttpHeaders

Ƭ **OmrsOfflineHttpHeaders**: `Object`

Defines the keys of the custom headers which can be appended to an HTTP request.
HTTP requests with these headers are handled in a special way by the SPA's service worker.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `x-omrs-offline-caching-strategy?` | ``"default"`` \| ``"network-first"`` | Instructs the service worker to use a specific caching strategy for this request. The supported values are:  * `default`: Equal to the absence of this header/an invalid value.   The service worker decides the strategy to be used. * `network-first`: The service worker will make the request and cache its response. |
| `x-omrs-offline-response-body?` | `string` | If the client is offline and the request cannot be read from the cache (i.e. if there is no way to receive any kind of data for this request), the service worker will return a response with the body in this header. |
| `x-omrs-offline-response-status?` | \`${number}\` | If the client is offline and the request cannot be read from the cache (i.e. if there is no way to receive any kind of data for this request), the service worker will return a response with the status code defined in this header. |

#### Defined in

[service-worker-http-headers.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L12)

## Variables

### offlineUuidPrefix

• `Const` **offlineUuidPrefix**: ``"OFFLINE+"``

#### Defined in

[uuid.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/uuid.ts#L3)

___

### omrsOfflineCachingStrategyHttpHeaderName

• `Const` **omrsOfflineCachingStrategyHttpHeaderName**: ``"x-omrs-offline-caching-strategy"``

#### Defined in

[service-worker-http-headers.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L5)

___

### omrsOfflineResponseBodyHttpHeaderName

• `Const` **omrsOfflineResponseBodyHttpHeaderName**: ``"x-omrs-offline-response-body"``

#### Defined in

[service-worker-http-headers.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L1)

___

### omrsOfflineResponseStatusHttpHeaderName

• `Const` **omrsOfflineResponseStatusHttpHeaderName**: ``"x-omrs-offline-response-status"``

#### Defined in

[service-worker-http-headers.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L3)

## Functions

### dispatchNetworkRequestFailed

▸ **dispatchNetworkRequestFailed**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`NetworkRequestFailedEvent`](interfaces/NetworkRequestFailedEvent.md) |

#### Returns

`void`

#### Defined in

[events.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/events.ts#L5)

___

### generateOfflineUuid

▸ **generateOfflineUuid**(): `string`

Generates a UUID-like string which is used for uniquely identifying objects while offline.

#### Returns

`string`

#### Defined in

[uuid.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/uuid.ts#L6)

___

### getOfflinePatientDataStore

▸ **getOfflinePatientDataStore**(): `Store`<[`OfflinePatientDataSyncStore`](interfaces/OfflinePatientDataSyncStore.md)\>

#### Returns

`Store`<[`OfflinePatientDataSyncStore`](interfaces/OfflinePatientDataSyncStore.md)\>

#### Defined in

[offline-patient-data.ts:76](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L76)

___

### getOmrsServiceWorker

▸ **getOmrsServiceWorker**(): `Promise`<`Workbox` \| `undefined`\>

If a service worker has been registered, returns a promise that resolves to a {@link Workbox}
instance which is used by the application to manage that service worker.

If no service worker has been registered (e.g. when the application is built without offline specific features),
returns a promise which immediately resolves to `undefined`.

#### Returns

`Promise`<`Workbox` \| `undefined`\>

A promise which either resolves to `undefined` or to the app's {@link Workbox} instance.

#### Defined in

[service-worker.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker.ts#L42)

___

### getSynchronizationItems

▸ **getSynchronizationItems**<`T`\>(`type`): `Promise`<`T`[]\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |

#### Returns

`Promise`<`T`[]\>

#### Defined in

[sync.ts:127](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L127)

___

### getSynchronizationItemsFor

▸ **getSynchronizationItemsFor**<`T`\>(`userId`, `type`): `Promise`<`T`[]\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `type` | `string` |

#### Returns

`Promise`<`T`[]\>

#### Defined in

[sync.ts:113](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L113)

___

### isOfflineUuid

▸ **isOfflineUuid**(`uuid`): `boolean`

Checks whether the given string has the format of an offline UUID generated by [generateOfflineUuid](API.md#generateofflineuuid)

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |

#### Returns

`boolean`

#### Defined in

[uuid.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/uuid.ts#L11)

___

### loadPersistedPatientDataSyncState

▸ **loadPersistedPatientDataSyncState**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[offline-patient-data.ts:180](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L180)

___

### messageOmrsServiceWorker

▸ **messageOmrsServiceWorker**(`message`): `Promise`<[`MessageServiceWorkerResult`](interfaces/MessageServiceWorkerResult.md)<`any`\>\>

Sends the specified message to the application's service worker.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`KnownOmrsServiceWorkerMessages`](API.md#knownomrsserviceworkermessages) | The message to be sent. |

#### Returns

`Promise`<[`MessageServiceWorkerResult`](interfaces/MessageServiceWorkerResult.md)<`any`\>\>

A promise which completes when the message has been successfully processed by the Service Worker.

#### Defined in

[service-worker-messaging.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-messaging.ts#L9)

___

### patchXMLHttpRequest

▸ **patchXMLHttpRequest**(): `void`

#### Returns

`void`

#### Defined in

[patches.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/patches.ts#L1)

___

### queueSynchronizationItem

▸ **queueSynchronizationItem**<`T`\>(`type`, `content`, `descriptor?`): `Promise`<`number`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `content` | `T` |
| `descriptor?` | [`QueueItemDescriptor`](interfaces/QueueItemDescriptor.md) |

#### Returns

`Promise`<`number`\>

#### Defined in

[sync.ts:104](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L104)

___

### queueSynchronizationItemFor

▸ **queueSynchronizationItemFor**<`T`\>(`userId`, `type`, `content`, `descriptor?`): `Promise`<`number`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `type` | `string` |
| `content` | `T` |
| `descriptor?` | [`QueueItemDescriptor`](interfaces/QueueItemDescriptor.md) |

#### Returns

`Promise`<`number`\>

#### Defined in

[sync.ts:77](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L77)

___

### registerOfflinePatientHandler

▸ **registerOfflinePatientHandler**(`identifier`, `handler`): `void`

Attempts to add the specified patient handler registration to the list of offline patient handlers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `identifier` | `string` | A key which uniquely identifies the registration. |
| `handler` | [`OfflinePatientDataSyncHandler`](interfaces/OfflinePatientDataSyncHandler.md) | The patient handler registration to be registered. |

#### Returns

`void`

`true` if the registration was successfully made; `false` if another registration with
  the same identifier has already been registered before.

#### Defined in

[offline-patient-data.ts:87](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L87)

___

### registerOmrsServiceWorker

▸ **registerOmrsServiceWorker**(`scriptUrl`, `registerOptions?`): `Promise`<`Workbox`\>

If not yet registered, registers the application's global Service Worker.
Throws if registration is not possible.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptUrl` | `string` |
| `registerOptions?` | `object` |

#### Returns

`Promise`<`Workbox`\>

A promise which resolves to the registered {@link Workbox} instance which manages the SW.

#### Defined in

[service-worker.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker.ts#L12)

___

### setupOfflineSync

▸ **setupOfflineSync**<`T`\>(`type`, `dependsOn`, `process`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `dependsOn` | `string`[] |
| `process` | (`item`: `T`, `options`: [`SyncProcessOptions`](interfaces/SyncProcessOptions.md)<`T`\>) => `Promise`<`any`\> |

#### Returns

`void`

#### Defined in

[sync.ts:165](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L165)

___

### subscribeNetworkRequestFailed

▸ **subscribeNetworkRequestFailed**(`cb`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`data`: [`NetworkRequestFailedEvent`](interfaces/NetworkRequestFailedEvent.md)) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[events.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/events.ts#L11)

___

### syncOfflinePatientData

▸ **syncOfflinePatientData**(`patientUuid`): `Promise`<`void`\>

Notifies all registered offline patient handlers that a new patient must be made available offline.

#### Parameters

| Name | Type |
| :------ | :------ |
| `patientUuid` | `string` |

#### Returns

`Promise`<`void`\>

A promise which resolves once all registered handlers have finished synchronizing.

#### Defined in

[offline-patient-data.ts:102](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L102)

___

### triggerSynchronization

▸ **triggerSynchronization**(`abort`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `abort` | `AbortController` |

#### Returns

`Promise`<`void`\>

#### Defined in

[sync.ts:132](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L132)
