[Back to README.md](../README.md)

# @openmrs/esm-extensions

## Table of contents

### Interfaces

- [CancelLoading](interfaces/cancelloading.md)
- [ExtensionDetails](interfaces/extensiondetails.md)
- [ExtensionInfo](interfaces/extensioninfo.md)
- [ExtensionInstance](interfaces/extensioninstance.md)
- [ExtensionMeta](interfaces/extensionmeta.md)
- [ExtensionRegistration](interfaces/extensionregistration.md)
- [ExtensionSlotInfo](interfaces/extensionslotinfo.md)
- [ExtensionSlotInstance](interfaces/extensionslotinstance.md)
- [ExtensionStore](interfaces/extensionstore.md)
- [Lifecycle](interfaces/lifecycle.md)
- [NavigationContext](interfaces/navigationcontext.md)

### Type aliases

- [MaybeAsync](API.md#maybeasync)
- [NavigationContextType](API.md#navigationcontexttype)

### Variables

- [extensionStore](API.md#extensionstore)

### Functions

- [attach](API.md#attach)
- [checkStatus](API.md#checkstatus)
- [checkStatusFor](API.md#checkstatusfor)
- [detach](API.md#detach)
- [getAssignedIds](API.md#getassignedids)
- [getCustomProps](API.md#getcustomprops)
- [getExtensionNameFromId](API.md#getextensionnamefromid)
- [getExtensionRegistration](API.md#getextensionregistration)
- [getExtensionSlotsForModule](API.md#getextensionslotsformodule)
- [getUpdatedExtensionSlotInfo](API.md#getupdatedextensionslotinfo)
- [pushNavigationContext](API.md#pushnavigationcontext)
- [registerExtension](API.md#registerextension)
- [registerExtensionSlot](API.md#registerextensionslot)
- [renderExtension](API.md#renderextension)
- [switchTo](API.md#switchto)
- [unregisterExtensionSlot](API.md#unregisterextensionslot)
- [updateExtensionStore](API.md#updateextensionstore)

## Type aliases

### MaybeAsync

Ƭ **MaybeAsync**<T\>: T \| *Promise*<T\>

#### Type parameters:

| Name |
| :------ |
| `T` |

Defined in: [store.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L81)

___

### NavigationContextType

Ƭ **NavigationContextType**: ``"workspace"`` \| ``"dialog"`` \| ``"link"``

Defined in: [contexts.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/contexts.ts#L3)

## Variables

### extensionStore

• `Const` **extensionStore**: *Store*<[*ExtensionStore*](interfaces/extensionstore.md)\>

Defined in: [store.ts:76](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L76)

## Functions

### attach

▸ **attach**(`extensionSlotName`: *string*, `extensionId`: *string*): *void*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | *string* |
| `extensionId` | *string* |

**Returns:** *void*

Defined in: [extensions.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L62)

___

### checkStatus

▸ **checkStatus**(`online?`: *boolean* \| *object*, `offline?`: *boolean* \| *object*): *boolean*

#### Parameters:

| Name | Type | Default value |
| :------ | :------ | :------ |
| `online` | *boolean* \| *object* | true |
| `offline` | *boolean* \| *object* | false |

**Returns:** *boolean*

Defined in: [helpers.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/helpers.ts#L1)

___

### checkStatusFor

▸ **checkStatusFor**(`status`: *boolean*, `online?`: *boolean* \| *object*, `offline?`: *boolean* \| *object*): *boolean*

#### Parameters:

| Name | Type | Default value |
| :------ | :------ | :------ |
| `status` | *boolean* | - |
| `online` | *boolean* \| *object* | true |
| `offline` | *boolean* \| *object* | false |

**Returns:** *boolean*

Defined in: [helpers.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/helpers.ts#L9)

___

### detach

▸ **detach**(`extensionSlotName`: *string*, `extensionId`: *string*): *void*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | *string* |
| `extensionId` | *string* |

**Returns:** *void*

Defined in: [extensions.ts:92](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L92)

___

### getAssignedIds

▸ **getAssignedIds**(`instance`: [*ExtensionSlotInstance*](interfaces/extensionslotinstance.md), `attachedIds`: *string*[]): *string*[]

#### Parameters:

| Name | Type |
| :------ | :------ |
| `instance` | [*ExtensionSlotInstance*](interfaces/extensionslotinstance.md) |
| `attachedIds` | *string*[] |

**Returns:** *string*[]

Defined in: [extensions.ts:115](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L115)

___

### getCustomProps

▸ **getCustomProps**(`online`: *boolean* \| *object* \| *undefined*, `offline`: *boolean* \| *object* \| *undefined*): *object*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `online` | *boolean* \| *object* \| *undefined* |
| `offline` | *boolean* \| *object* \| *undefined* |

**Returns:** *object*

Defined in: [helpers.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/helpers.ts#L17)

___

### getExtensionNameFromId

▸ **getExtensionNameFromId**(`extensionId`: *string*): *string*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `extensionId` | *string* |

**Returns:** *string*

Defined in: [extensions.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L28)

___

### getExtensionRegistration

▸ **getExtensionRegistration**(`extensionId`: *string*): [*ExtensionRegistration*](interfaces/extensionregistration.md) \| *undefined*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `extensionId` | *string* |

**Returns:** [*ExtensionRegistration*](interfaces/extensionregistration.md) \| *undefined*

Defined in: [extensions.ts:33](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L33)

___

### getExtensionSlotsForModule

▸ **getExtensionSlotsForModule**(`moduleName`: *string*): *string*[]

#### Parameters:

| Name | Type |
| :------ | :------ |
| `moduleName` | *string* |

**Returns:** *string*[]

Defined in: [extensions.ts:226](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L226)

___

### getUpdatedExtensionSlotInfo

▸ **getUpdatedExtensionSlotInfo**(`slotName`: *string*, `moduleName`: *string*, `extensionSlot`: [*ExtensionSlotInfo*](interfaces/extensionslotinfo.md)): [*ExtensionSlotInfo*](interfaces/extensionslotinfo.md)

Returns information describing all extensions which can be rendered into an extension slot with
the specified name.
The returned information describe the extension itself, as well as the extension slot name(s)
with which it has been attached.

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `slotName` | *string* | The extension slot name for which matching extension info should be returned. For URL like extension slots, this should be the name where parameters have been replaced with actual values (e.g. `/mySlot/213da954-87a2-432d-91f6-a3c441851726`). |
| `moduleName` | *string* | The module name. Used for applying extension-specific config values to the result. |
| `extensionSlot` | [*ExtensionSlotInfo*](interfaces/extensionslotinfo.md) | The extension slot information object. |

**Returns:** [*ExtensionSlotInfo*](interfaces/extensionslotinfo.md)

Defined in: [extensions.ts:255](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L255)

___

### pushNavigationContext

▸ **pushNavigationContext**(`_context`: [*NavigationContext*](interfaces/navigationcontext.md)): *function*

**`deprecated`** don't use

#### Parameters:

| Name | Type |
| :------ | :------ |
| `_context` | [*NavigationContext*](interfaces/navigationcontext.md) |

**Returns:** () => *void*

Defined in: [contexts.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/contexts.ts#L24)

___

### registerExtension

▸ `Const`**registerExtension**(`name`: *string*, `details`: [*ExtensionDetails*](interfaces/extensiondetails.md)): *void*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `name` | *string* |
| `details` | [*ExtensionDetails*](interfaces/extensiondetails.md) |

**Returns:** *void*

Defined in: [extensions.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L49)

___

### registerExtensionSlot

▸ **registerExtensionSlot**(`moduleName`: *string*, `slotName`: *string*): *void*

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `moduleName` | *string* | The name of the module that contains the extension slot |
| `slotName` | *string* | The extension slot name that is actually used |

**Returns:** *void*

Defined in: [extensions.ts:179](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L179)

___

### renderExtension

▸ **renderExtension**(`domElement`: HTMLElement, `extensionSlotName`: *string*, `extensionSlotModuleName`: *string*, `extensionId`: *string*, `renderFunction?`: (`lifecycle`: [*Lifecycle*](interfaces/lifecycle.md)) => [*Lifecycle*](interfaces/lifecycle.md), `additionalProps?`: *Record*<string, any\>): [*CancelLoading*](interfaces/cancelloading.md)

Mounts into a DOM node (representing an extension slot)
a lazy-loaded component from *any* microfrontend
that registered an extension component for this slot.

#### Parameters:

| Name | Type | Default value |
| :------ | :------ | :------ |
| `domElement` | HTMLElement | - |
| `extensionSlotName` | *string* | - |
| `extensionSlotModuleName` | *string* | - |
| `extensionId` | *string* | - |
| `renderFunction` | (`lifecycle`: [*Lifecycle*](interfaces/lifecycle.md)) => [*Lifecycle*](interfaces/lifecycle.md) | - |
| `additionalProps` | *Record*<string, any\> | {} |

**Returns:** [*CancelLoading*](interfaces/cancelloading.md)

Defined in: [render.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/render.ts#L23)

___

### switchTo

▸ **switchTo**<T\>(`_type`: [*NavigationContextType*](API.md#navigationcontexttype), `link`: *string*, `_state?`: T): *void*

**`deprecated`** use `navigate` directly

#### Type parameters:

| Name |
| :------ |
| `T` |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `_type` | [*NavigationContextType*](API.md#navigationcontexttype) |
| `link` | *string* |
| `_state?` | T |

**Returns:** *void*

Defined in: [contexts.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/contexts.ts#L13)

___

### unregisterExtensionSlot

▸ **unregisterExtensionSlot**(`moduleName`: *string*, `slotName`: *string*): *void*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `moduleName` | *string* |
| `slotName` | *string* |

**Returns:** *void*

Defined in: [extensions.ts:202](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L202)

___

### updateExtensionStore

▸ **updateExtensionStore**<U\>(`updater`: (`state`: [*ExtensionStore*](interfaces/extensionstore.md)) => [*MaybeAsync*](API.md#maybeasync)<Pick<[*ExtensionStore*](interfaces/extensionstore.md), U\>\>): *void*

#### Type parameters:

| Name | Type |
| :------ | :------ |
| `U` | keyof [*ExtensionStore*](interfaces/extensionstore.md) |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `updater` | (`state`: [*ExtensionStore*](interfaces/extensionstore.md)) => [*MaybeAsync*](API.md#maybeasync)<Pick<[*ExtensionStore*](interfaces/extensionstore.md), U\>\> |

**Returns:** *void*

Defined in: [store.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L85)
