[Back to README.md](../README.md)

# @openmrs/esm-state

## Table of contents

### Interfaces

- [AppState](interfaces/appstate.md)

### Functions

- [createGlobalStore](API.md#createglobalstore)
- [getAppState](API.md#getappstate)
- [getGlobalStore](API.md#getglobalstore)
- [subscribeTo](API.md#subscribeto)
- [update](API.md#update)

## Functions

### createGlobalStore

▸ **createGlobalStore**<TState\>(`name`, `initialState`): `Store`<TState\>

Creates a Unistore [store](https://github.com/developit/unistore#store).

#### Type parameters

| Name |
| :------ |
| `TState` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | A name by which the store can be looked up later.    Must be unique across the entire application. |
| `initialState` | `TState` | An object which will be the initial state of the store. |

#### Returns

`Store`<TState\>

The newly created store.

#### Defined in

[state.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/state.ts#L18)

___

### getAppState

▸ **getAppState**(): `Store`<[AppState](interfaces/appstate.md)\>

#### Returns

`Store`<[AppState](interfaces/appstate.md)\>

The [store](https://github.com/developit/unistore#store) named `app`.

#### Defined in

[state.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/state.ts#L85)

___

### getGlobalStore

▸ **getGlobalStore**<TState\>(`name`, `fallbackState?`): `Store`<TState\>

Returns the existing [store](https://github.com/developit/unistore#store) named `name`,
or creates a new store named `name` if none exists.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TState` | `TState` = `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the store to look up. |
| `fallbackState?` | `TState` | The initial value of the new store if no store named `name` exists. |

#### Returns

`Store`<TState\>

The found or newly created store.

#### Defined in

[state.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/state.ts#L55)

___

### subscribeTo

▸ **subscribeTo**<T, U\>(`store`, `select`, `handle`): `Unsubscribe`

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | `Store`<T\> |
| `select` | (`state`: `T`) => `U` |
| `handle` | (`subState`: `U`) => `void` |

#### Returns

`Unsubscribe`

#### Defined in

[state.ts:89](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/state.ts#L89)

___

### update

▸ **update**<T\>(`obj`, `__namedParameters`, `value`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T`: `Record`<string, any\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `T` |
| `__namedParameters` | `string`[] |
| `value` | `any` |

#### Returns

`T`

#### Defined in

[update.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-state/src/update.ts#L1)
