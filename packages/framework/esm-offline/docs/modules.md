[@openmrs/esm-offline](API.md) / Exports

# @openmrs/esm-offline

## Table of contents

### Interfaces

- [ClearDynamicRoutesMessage](interfaces/cleardynamicroutesmessage.md)
- [MessageServiceWorkerResult](interfaces/messageserviceworkerresult.md)
- [NetworkRequestFailedEvent](interfaces/networkrequestfailedevent.md)
- [OmrsServiceWorkerEvent](interfaces/omrsserviceworkerevent.md)
- [OmrsServiceWorkerMessage](interfaces/omrsserviceworkermessage.md)
- [OnImportMapChangedMessage](interfaces/onimportmapchangedmessage.md)
- [RegisterDynamicRouteMessage](interfaces/registerdynamicroutemessage.md)
- [SyncProcessOptions](interfaces/syncprocessoptions.md)

### Type aliases

- [KnownOmrsServiceWorkerEvents](modules.md#knownomrsserviceworkerevents)
- [KnownOmrsServiceWorkerMessages](modules.md#knownomrsserviceworkermessages)

### Functions

- [dispatchNetworkRequestFailed](modules.md#dispatchnetworkrequestfailed)
- [getOmrsServiceWorker](modules.md#getomrsserviceworker)
- [getSynchronizationItems](modules.md#getsynchronizationitems)
- [getSynchronizationItemsFor](modules.md#getsynchronizationitemsfor)
- [messageOmrsServiceWorker](modules.md#messageomrsserviceworker)
- [patchXMLHttpRequest](modules.md#patchxmlhttprequest)
- [queueSynchronizationItem](modules.md#queuesynchronizationitem)
- [queueSynchronizationItemFor](modules.md#queuesynchronizationitemfor)
- [registerOmrsServiceWorker](modules.md#registeromrsserviceworker)
- [setupOfflineSync](modules.md#setupofflinesync)
- [subscribeNetworkRequestFailed](modules.md#subscribenetworkrequestfailed)
- [triggerSynchronization](modules.md#triggersynchronization)

## Type aliases

### KnownOmrsServiceWorkerEvents

Ƭ **KnownOmrsServiceWorkerEvents**: [NetworkRequestFailedEvent](interfaces/networkrequestfailedevent.md)

#### Defined in

[service-worker-events.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-events.ts#L15)

___

### KnownOmrsServiceWorkerMessages

Ƭ **KnownOmrsServiceWorkerMessages**: [OnImportMapChangedMessage](interfaces/onimportmapchangedmessage.md) \| [ClearDynamicRoutesMessage](interfaces/cleardynamicroutesmessage.md) \| [RegisterDynamicRouteMessage](interfaces/registerdynamicroutemessage.md)

#### Defined in

[service-worker-messaging.ts:36](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker-messaging.ts#L36)

## Functions

### dispatchNetworkRequestFailed

▸ **dispatchNetworkRequestFailed**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [NetworkRequestFailedEvent](interfaces/networkrequestfailedevent.md) |

#### Returns

`void`

#### Defined in

[events.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/events.ts#L5)

___

### getOmrsServiceWorker

▸ **getOmrsServiceWorker**(): `Promise`<Workbox\>

Returns a `Workbox` instance which allows interacting with the application's global Service Worker.

**Warning:** The promise may never resolve if the Service Worker is never registered (which
can, for example, happen when the browser is missing the required capabilities).

#### Returns

`Promise`<Workbox\>

A promise which will resolve once the application's Service Worker has been initialized.

#### Defined in

[service-worker.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker.ts#L49)

___

### getSynchronizationItems

▸ **getSynchronizationItems**<T\>(`type`): `Promise`<T[]\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |

#### Returns

`Promise`<T[]\>

#### Defined in

[sync.ts:92](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L92)

___

### getSynchronizationItemsFor

▸ **getSynchronizationItemsFor**<T\>(`userId`, `type`): `Promise`<T[]\>

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

`Promise`<T[]\>

#### Defined in

[sync.ts:78](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L78)

___

### messageOmrsServiceWorker

▸ **messageOmrsServiceWorker**(`message`): `Promise`<[MessageServiceWorkerResult](interfaces/messageserviceworkerresult.md)<any\>\>

Sends the specified message to the application's service worker.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [KnownOmrsServiceWorkerMessages](modules.md#knownomrsserviceworkermessages) | The message to be sent. |

#### Returns

`Promise`<[MessageServiceWorkerResult](interfaces/messageserviceworkerresult.md)<any\>\>

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

▸ **queueSynchronizationItem**<T\>(`type`, `content`): `Promise`<number\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `content` | `T` |

#### Returns

`Promise`<number\>

#### Defined in

[sync.ts:73](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L73)

___

### queueSynchronizationItemFor

▸ **queueSynchronizationItemFor**<T\>(`userId`, `type`, `content`): `Promise`<number\>

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

#### Returns

`Promise`<number\>

#### Defined in

[sync.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L60)

___

### registerOmrsServiceWorker

▸ **registerOmrsServiceWorker**(`scriptUrl`, `registerOptions?`): `Workbox`

If not yet registered, registers the application's global Service Worker.
Throws if registration is not possible.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptUrl` | `string` |
| `registerOptions?` | `object` |

#### Returns

`Workbox`

The registered Service Worker.

#### Defined in

[service-worker.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/service-worker.ts#L18)

___

### setupOfflineSync

▸ **setupOfflineSync**<T\>(`type`, `dependsOn`, `process`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `dependsOn` | `string`[] |
| `process` | (`item`: `T`, `options`: [SyncProcessOptions](interfaces/syncprocessoptions.md)<T\>) => `Promise`<void\> |

#### Returns

`void`

#### Defined in

[sync.ts:132](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L132)

___

### subscribeNetworkRequestFailed

▸ **subscribeNetworkRequestFailed**(`cb`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`data`: [NetworkRequestFailedEvent](interfaces/networkrequestfailedevent.md)) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[events.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/events.ts#L11)

___

### triggerSynchronization

▸ **triggerSynchronization**(): `Promise`<AbortController\>

#### Returns

`Promise`<AbortController\>

#### Defined in

[sync.ts:97](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/sync.ts#L97)
