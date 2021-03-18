[Back to README.md](../README.md)

# @openmrs/esm-extensions

## Table of contents

### Interfaces

- [CancelLoading](interfaces/cancelloading.md)
- [ExtensionInfo](interfaces/extensioninfo.md)
- [ExtensionInstance](interfaces/extensioninstance.md)
- [ExtensionRegistration](interfaces/extensionregistration.md)
- [ExtensionSlotInfo](interfaces/extensionslotinfo.md)
- [ExtensionSlotInstance](interfaces/extensionslotinstance.md)
- [ExtensionStore](interfaces/extensionstore.md)
- [Lifecycle](interfaces/lifecycle.md)
- [NavigationContext](interfaces/navigationcontext.md)
- [PageDefinition](interfaces/pagedefinition.md)

### Type aliases

- [MaybeAsync](API.md#maybeasync)
- [NavigationContextType](API.md#navigationcontexttype)

### Variables

- [extensionStore](API.md#extensionstore)

### Functions

- [attach](API.md#attach)
- [detach](API.md#detach)
- [getActualRouteProps](API.md#getactualrouteprops)
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

Name |
:------ |
`T` |

Defined in: [store.ts:100](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L100)

___

### NavigationContextType

Ƭ **NavigationContextType**: *workspace* \| *dialog* \| *link*

Defined in: [contexts.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/contexts.ts#L14)

## Variables

### extensionStore

• `Const` **extensionStore**: *Store*<[*ExtensionStore*](interfaces/extensionstore.md)\>

Defined in: [store.ts:95](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L95)

## Functions

### attach

▸ **attach**(`extensionSlotName`: *string*, `extensionId`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`extensionSlotName` | *string* |
`extensionId` | *string* |

**Returns:** *void*

Defined in: [extensions.ts:65](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L65)

___

### detach

▸ **detach**(`extensionSlotName`: *string*, `extensionId`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`extensionSlotName` | *string* |
`extensionId` | *string* |

**Returns:** *void*

Defined in: [extensions.ts:95](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L95)

___

### getActualRouteProps

▸ **getActualRouteProps**(`pathTemplate`: *string*, `url`: *string*): *object* \| *undefined*

#### Parameters:

Name | Type |
:------ | :------ |
`pathTemplate` | *string* |
`url` | *string* |

**Returns:** *object* \| *undefined*

Defined in: [route.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/route.ts#L3)

___

### getExtensionRegistration

▸ **getExtensionRegistration**(`extensionId`: *string*): [*ExtensionRegistration*](interfaces/extensionregistration.md) \| *undefined*

#### Parameters:

Name | Type |
:------ | :------ |
`extensionId` | *string* |

**Returns:** [*ExtensionRegistration*](interfaces/extensionregistration.md) \| *undefined*

Defined in: [extensions.ts:34](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L34)

___

### getExtensionSlotsForModule

▸ **getExtensionSlotsForModule**(`moduleName`: *string*): *string*[]

#### Parameters:

Name | Type |
:------ | :------ |
`moduleName` | *string* |

**Returns:** *string*[]

Defined in: [extensions.ts:282](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L282)

___

### getUpdatedExtensionSlotInfo

▸ **getUpdatedExtensionSlotInfo**(`actualExtensionSlotName`: *string*, `moduleName`: *string*, `extensionSlot`: [*ExtensionSlotInfo*](interfaces/extensionslotinfo.md)): *Promise*<[*ExtensionSlotInfo*](interfaces/extensionslotinfo.md)\>

Returns information describing all extensions which can be rendered into an extension slot with
the specified name.
The returned information describe the extension itself, as well as the extension slot name(s)
with which it has been attached.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`actualExtensionSlotName` | *string* | The extension slot name for which matching extension info should be returned. For URL like extension slots, this should be the name where parameters have been replaced with actual values (e.g. `/mySlot/213da954-87a2-432d-91f6-a3c441851726`).   |
`moduleName` | *string* | The module name. Used for applying extension-specific config values to the result.   |
`extensionSlot` | [*ExtensionSlotInfo*](interfaces/extensionslotinfo.md) | The extension slot information object.    |

**Returns:** *Promise*<[*ExtensionSlotInfo*](interfaces/extensionslotinfo.md)\>

Defined in: [extensions.ts:311](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L311)

___

### pushNavigationContext

▸ **pushNavigationContext**(`context`: [*NavigationContext*](interfaces/navigationcontext.md)): *function*

#### Parameters:

Name | Type |
:------ | :------ |
`context` | [*NavigationContext*](interfaces/navigationcontext.md) |

**Returns:** () => *void*

Defined in: [contexts.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/contexts.ts#L37)

___

### registerExtension

▸ `Const`**registerExtension**(`moduleName`: *string*, `name`: *string*, `load`: () => *Promise*<any\>, `meta?`: *Record*<string, any\>): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`moduleName` | *string* |
`name` | *string* |
`load` | () => *Promise*<any\> |
`meta?` | *Record*<string, any\> |

**Returns:** *void*

Defined in: [extensions.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L42)

___

### registerExtensionSlot

▸ **registerExtensionSlot**(`moduleName`: *string*, `actualExtensionSlotName`: *string*, `domElement`: HTMLElement): *void*

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`moduleName` | *string* | The name of the module that contains the extension slot   |
`actualExtensionSlotName` | *string* | The extension slot name that is actually used   |
`domElement` | HTMLElement | The HTML element of the extension slot    |

**Returns:** *void*

Defined in: [extensions.ts:216](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L216)

___

### renderExtension

▸ **renderExtension**(`domElement`: HTMLElement, `actualExtensionSlotName`: *string*, `attachedExtensionSlotName`: *string*, `extensionSlotModuleName`: *string*, `extensionId`: *string*, `renderFunction?`: (`lifecycle`: [*Lifecycle*](interfaces/lifecycle.md)) => [*Lifecycle*](interfaces/lifecycle.md), `additionalProps?`: *Record*<string, any\>): [*CancelLoading*](interfaces/cancelloading.md)

Mounts into a DOM node (representing an extension slot)
a lazy-loaded component from *any* microfrontend
that registered an extension component for this slot.

#### Parameters:

Name | Type |
:------ | :------ |
`domElement` | HTMLElement |
`actualExtensionSlotName` | *string* |
`attachedExtensionSlotName` | *string* |
`extensionSlotModuleName` | *string* |
`extensionId` | *string* |
`renderFunction` | (`lifecycle`: [*Lifecycle*](interfaces/lifecycle.md)) => [*Lifecycle*](interfaces/lifecycle.md) |
`additionalProps` | *Record*<string, any\> |

**Returns:** [*CancelLoading*](interfaces/cancelloading.md)

Defined in: [render.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/render.ts#L23)

___

### switchTo

▸ **switchTo**<T\>(`type`: [*NavigationContextType*](API.md#navigationcontexttype), `link`: *string*, `state?`: T): *void*

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`type` | [*NavigationContextType*](API.md#navigationcontexttype) |
`link` | *string* |
`state?` | T |

**Returns:** *void*

Defined in: [contexts.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/contexts.ts#L21)

___

### unregisterExtensionSlot

▸ **unregisterExtensionSlot**(`moduleName`: *string*, `actualExtensionSlotName`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`moduleName` | *string* |
`actualExtensionSlotName` | *string* |

**Returns:** *void*

Defined in: [extensions.ts:251](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/extensions.ts#L251)

___

### updateExtensionStore

▸ **updateExtensionStore**<U\>(`updater`: (`state`: [*ExtensionStore*](interfaces/extensionstore.md)) => [*MaybeAsync*](API.md#maybeasync)<Pick<[*ExtensionStore*](interfaces/extensionstore.md), U\>\>): *void*

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *extensions* \| *slots* |

#### Parameters:

Name | Type |
:------ | :------ |
`updater` | (`state`: [*ExtensionStore*](interfaces/extensionstore.md)) => [*MaybeAsync*](API.md#maybeasync)<Pick<[*ExtensionStore*](interfaces/extensionstore.md), U\>\> |

**Returns:** *void*

Defined in: [store.ts:104](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-extensions/src/store.ts#L104)
