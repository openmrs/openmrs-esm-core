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
- [OfflineSynchronizationStore](interfaces/OfflineSynchronizationStore.md)
- [OmrsServiceWorkerEvent](interfaces/OmrsServiceWorkerEvent.md)
- [OmrsServiceWorkerMessage](interfaces/OmrsServiceWorkerMessage.md)
- [OnImportMapChangedMessage](interfaces/OnImportMapChangedMessage.md)
- [QueueItemDescriptor](interfaces/QueueItemDescriptor.md)
- [RegisterDynamicRouteMessage](interfaces/RegisterDynamicRouteMessage.md)
- [SyncItem](interfaces/SyncItem.md)
- [SyncProcessOptions](interfaces/SyncProcessOptions.md)

### Type aliases

- [KnownOmrsServiceWorkerEvents](API.md#knownomrsserviceworkerevents)
- [KnownOmrsServiceWorkerMessages](API.md#knownomrsserviceworkermessages)
- [OmrsOfflineCachingStrategy](API.md#omrsofflinecachingstrategy)
- [OmrsOfflineHttpHeaderNames](API.md#omrsofflinehttpheadernames)
- [OmrsOfflineHttpHeaders](API.md#omrsofflinehttpheaders)
- [ProcessSyncItem](API.md#processsyncitem)

### Variables

- [offlineUuidPrefix](API.md#offlineuuidprefix)
- [omrsOfflineCachingStrategyHttpHeaderName](API.md#omrsofflinecachingstrategyhttpheadername)
- [omrsOfflineResponseBodyHttpHeaderName](API.md#omrsofflineresponsebodyhttpheadername)
- [omrsOfflineResponseStatusHttpHeaderName](API.md#omrsofflineresponsestatushttpheadername)

### Functions

- [deleteSynchronizationItem](API.md#deletesynchronizationitem)
- [dispatchNetworkRequestFailed](API.md#dispatchnetworkrequestfailed)
- [generateOfflineUuid](API.md#generateofflineuuid)
- [getOfflinePatientDataStore](API.md#getofflinepatientdatastore)
- [getOfflineSynchronizationStore](API.md#getofflinesynchronizationstore)
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
- [runSynchronization](API.md#runsynchronization)
- [setupOfflineSync](API.md#setupofflinesync)
- [subscribeNetworkRequestFailed](API.md#subscribenetworkrequestfailed)
- [syncOfflinePatientData](API.md#syncofflinepatientdata)

## Type aliases

### KnownOmrsServiceWorkerEvents

Ƭ **KnownOmrsServiceWorkerEvents**: [`NetworkRequestFailedEvent`](interfaces/NetworkRequestFailedEvent.md)

#### Defined in

[service-worker-events.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-events.ts#L15)

___

### KnownOmrsServiceWorkerMessages

Ƭ **KnownOmrsServiceWorkerMessages**: [`OnImportMapChangedMessage`](interfaces/OnImportMapChangedMessage.md) \| [`ClearDynamicRoutesMessage`](interfaces/ClearDynamicRoutesMessage.md) \| [`RegisterDynamicRouteMessage`](interfaces/RegisterDynamicRouteMessage.md)

#### Defined in

[service-worker-messaging.ts:45](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-messaging.ts#L45)

___

### OmrsOfflineCachingStrategy

Ƭ **OmrsOfflineCachingStrategy**: ``"network-only-or-cache-only"`` \| ``"network-first"``

* `cache-or-network`: The default strategy, equal to the absence of this header.
  The SW attempts to resolve the request via the network, but falls back to the cache if required.
  The service worker decides the strategy to be used.
* `network-first`: See https://developers.google.com/web/tools/workbox/modules/workbox-strategies#network_first_network_falling_back_to_cache.

#### Defined in

[service-worker-http-headers.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L16)

___

### OmrsOfflineHttpHeaderNames

Ƭ **OmrsOfflineHttpHeaderNames**: keyof [`OmrsOfflineHttpHeaders`](API.md#omrsofflinehttpheaders)

#### Defined in

[service-worker-http-headers.ts:43](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L43)

___

### OmrsOfflineHttpHeaders

Ƭ **OmrsOfflineHttpHeaders**: `Object`

Defines the keys of the custom headers which can be appended to an HTTP request.
HTTP requests with these headers are handled in a special way by the SPA's service worker.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `x-omrs-offline-caching-strategy?` | [`OmrsOfflineCachingStrategy`](API.md#omrsofflinecachingstrategy) | Instructs the service worker to use a specific caching strategy for this request. |
| `x-omrs-offline-response-body?` | `string` | If the client is offline and the request cannot be read from the cache (i.e. if there is no way to receive any kind of data for this request), the service worker will return a response with the body in this header. |
| `x-omrs-offline-response-status?` | \`${number}\` | If the client is offline and the request cannot be read from the cache (i.e. if there is no way to receive any kind of data for this request), the service worker will return a response with the status code defined in this header. |

#### Defined in

[service-worker-http-headers.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-http-headers.ts#L24)

___

### ProcessSyncItem

Ƭ **ProcessSyncItem**<`T`\>: (`item`: `T`, `options`: [`SyncProcessOptions`](interfaces/SyncProcessOptions.md)<`T`\>) => `Promise`<`any`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`item`, `options`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `T` |
| `options` | [`SyncProcessOptions`](interfaces/SyncProcessOptions.md)<`T`\> |

##### Returns

`Promise`<`any`\>

#### Defined in

[sync.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L28)

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

### deleteSynchronizationItem

▸ **deleteSynchronizationItem**(`id`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

[sync.ts:251](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L251)

___

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

[offline-patient-data.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L85)

___

### getOfflineSynchronizationStore

▸ **getOfflineSynchronizationStore**(): `Store`<[`OfflineSynchronizationStore`](interfaces/OfflineSynchronizationStore.md)\>

#### Returns

`Store`<[`OfflineSynchronizationStore`](interfaces/OfflineSynchronizationStore.md)\>

#### Defined in

[sync.ts:80](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L80)

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

[sync.ts:246](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L246)

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

[sync.ts:232](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L232)

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

[offline-patient-data.ts:199](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L199)

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

[service-worker-messaging.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-messaging.ts#L10)

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

[sync.ts:223](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L223)

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

[sync.ts:195](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L195)

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

[offline-patient-data.ts:96](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L96)

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

### runSynchronization

▸ **runSynchronization**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[sync.ts:84](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L84)

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
| `process` | [`ProcessSyncItem`](API.md#processsyncitem)<`T`\> |

#### Returns

`void`

#### Defined in

[sync.ts:263](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L263)

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

[offline-patient-data.ts:111](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L111)
