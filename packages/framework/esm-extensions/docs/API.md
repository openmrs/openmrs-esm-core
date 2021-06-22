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
- [detachAll](API.md#detachall)
- [getAssignedIds](API.md#getassignedids)
- [getCustomProps](API.md#getcustomprops)
- [getExtensionNameFromId](API.md#getextensionnamefromid)
- [getExtensionRegistration](API.md#getextensionregistration)
- [getExtensionRegistrationFrom](API.md#getextensionregistrationfrom)
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

Ƭ **MaybeAsync**<T\>: `T` \| `Promise`<T\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[store.ts:82](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L82)

___

### NavigationContextType

Ƭ **NavigationContextType**: ``"workspace"`` \| ``"dialog"`` \| ``"link"``

#### Defined in

[contexts.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/contexts.ts#L3)

## Variables

### extensionStore

• `Const` **extensionStore**: `Store`<[ExtensionStore](interfaces/extensionstore.md)\>

#### Defined in

[store.ts:77](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L77)

## Functions

### attach

▸ **attach**(`extensionSlotName`, `extensionId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | `string` |
| `extensionId` | `string` |

#### Returns

`void`

#### Defined in

[extensions.ts:72](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L72)

___

### checkStatus

▸ **checkStatus**(`online?`, `offline?`): `boolean`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `online` | `boolean` \| `object` | true |
| `offline` | `boolean` \| `object` | false |

#### Returns

`boolean`

#### Defined in

[helpers.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/helpers.ts#L1)

___

### checkStatusFor

▸ **checkStatusFor**(`status`, `online?`, `offline?`): `boolean`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `status` | `boolean` | `undefined` |
| `online` | `boolean` \| `object` | true |
| `offline` | `boolean` \| `object` | false |

#### Returns

`boolean`

#### Defined in

[helpers.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/helpers.ts#L9)

___

### detach

▸ **detach**(`extensionSlotName`, `extensionId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | `string` |
| `extensionId` | `string` |

#### Returns

`void`

#### Defined in

[extensions.ts:102](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L102)

___

### detachAll

▸ **detachAll**(`extensionSlotName`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotName` | `string` |

#### Returns

`void`

#### Defined in

[extensions.ts:125](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L125)

___

### getAssignedIds

▸ **getAssignedIds**(`instance`, `attachedIds`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | [ExtensionSlotInstance](interfaces/extensionslotinstance.md) |
| `attachedIds` | `string`[] |

#### Returns

`string`[]

#### Defined in

[extensions.ts:158](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L158)

___

### getCustomProps

▸ **getCustomProps**(`online`, `offline`): `object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `online` | `boolean` \| `object` \| `undefined` |
| `offline` | `boolean` \| `object` \| `undefined` |

#### Returns

`object`

#### Defined in

[helpers.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/helpers.ts#L17)

___

### getExtensionNameFromId

▸ **getExtensionNameFromId**(`extensionId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionId` | `string` |

#### Returns

`string`

#### Defined in

[extensions.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L30)

___

### getExtensionRegistration

▸ **getExtensionRegistration**(`extensionId`): [ExtensionRegistration](interfaces/extensionregistration.md) \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionId` | `string` |

#### Returns

[ExtensionRegistration](interfaces/extensionregistration.md) \| `undefined`

#### Defined in

[extensions.ts:43](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L43)

___

### getExtensionRegistrationFrom

▸ **getExtensionRegistrationFrom**(`state`, `extensionId`): [ExtensionRegistration](interfaces/extensionregistration.md) \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [ExtensionStore](interfaces/extensionstore.md) |
| `extensionId` | `string` |

#### Returns

[ExtensionRegistration](interfaces/extensionregistration.md) \| `undefined`

#### Defined in

[extensions.ts:35](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L35)

___

### getExtensionSlotsForModule

▸ **getExtensionSlotsForModule**(`moduleName`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |

#### Returns

`string`[]

#### Defined in

[extensions.ts:270](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L270)

___

### getUpdatedExtensionSlotInfo

▸ **getUpdatedExtensionSlotInfo**(`slotName`, `moduleName`, `extensionSlot`): [ExtensionSlotInfo](interfaces/extensionslotinfo.md)

Returns information describing all extensions which can be rendered into an extension slot with
the specified name.
The returned information describe the extension itself, as well as the extension slot name(s)
with which it has been attached.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `slotName` | `string` | The extension slot name for which matching extension info should be returned. |
| `moduleName` | `string` | The module name. Used for applying extension-specific config values to the result. |
| `extensionSlot` | [ExtensionSlotInfo](interfaces/extensionslotinfo.md) | The extension slot information object. |

#### Returns

[ExtensionSlotInfo](interfaces/extensionslotinfo.md)

#### Defined in

[extensions.ts:297](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L297)

___

### pushNavigationContext

▸ **pushNavigationContext**(`_context`): () => `void`

**`deprecated`** don't use

#### Parameters

| Name | Type |
| :------ | :------ |
| `_context` | [NavigationContext](interfaces/navigationcontext.md) |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[contexts.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/contexts.ts#L24)

___

### registerExtension

▸ `Const` **registerExtension**(`name`, `details`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `details` | [ExtensionDetails](interfaces/extensiondetails.md) |

#### Returns

`void`

#### Defined in

[extensions.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L59)

___

### registerExtensionSlot

▸ **registerExtensionSlot**(`moduleName`, `slotName`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `moduleName` | `string` | The name of the module that contains the extension slot |
| `slotName` | `string` | The extension slot name that is actually used |

#### Returns

`void`

#### Defined in

[extensions.ts:223](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L223)

___

### renderExtension

▸ **renderExtension**(`domElement`, `extensionSlotName`, `extensionSlotModuleName`, `extensionId`, `renderFunction?`, `additionalProps?`): [CancelLoading](interfaces/cancelloading.md)

Mounts into a DOM node (representing an extension slot)
a lazy-loaded component from *any* microfrontend
that registered an extension component for this slot.

#### Parameters

| Name | Type |
| :------ | :------ |
| `domElement` | `HTMLElement` |
| `extensionSlotName` | `string` |
| `extensionSlotModuleName` | `string` |
| `extensionId` | `string` |
| `renderFunction` | (`lifecycle`: [Lifecycle](interfaces/lifecycle.md)) => [Lifecycle](interfaces/lifecycle.md) |
| `additionalProps` | `Record`<string, any\> |

#### Returns

[CancelLoading](interfaces/cancelloading.md)

#### Defined in

[render.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/render.ts#L23)

___

### switchTo

▸ **switchTo**<T\>(`_type`, `link`, `_state?`): `void`

**`deprecated`** use `navigate` directly

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `_type` | [NavigationContextType](API.md#navigationcontexttype) |
| `link` | `string` |
| `_state?` | `T` |

#### Returns

`void`

#### Defined in

[contexts.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/contexts.ts#L13)

___

### unregisterExtensionSlot

▸ **unregisterExtensionSlot**(`moduleName`, `slotName`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |
| `slotName` | `string` |

#### Returns

`void`

#### Defined in

[extensions.ts:246](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/extensions.ts#L246)

___

### updateExtensionStore

▸ **updateExtensionStore**<U\>(`updater`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | `U`: keyof [ExtensionStore](interfaces/extensionstore.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `updater` | (`state`: [ExtensionStore](interfaces/extensionstore.md)) => [MaybeAsync](API.md#maybeasync)<Pick<[ExtensionStore](interfaces/extensionstore.md), U\>\> |

#### Returns

`void`

#### Defined in

[store.ts:86](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L86)
