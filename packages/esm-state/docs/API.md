[Back to README.md](../README.md)

# @openmrs/esm-state

## Table of contents

### Interfaces

- [AppState](interfaces/appstate.md)

### Functions

- [createAppState](API.md#createappstate)
- [createGlobalStore](API.md#createglobalstore)
- [getAppState](API.md#getappstate)
- [getGlobalStore](API.md#getglobalstore)
- [update](API.md#update)

## Functions

### createAppState

▸ **createAppState**(`initialState`: [*AppState*](interfaces/appstate.md)): *Store*<[*AppState*](interfaces/appstate.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`initialState` | [*AppState*](interfaces/appstate.md) |

**Returns:** *Store*<[*AppState*](interfaces/appstate.md)\>

Defined in: [state.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-state/src/state.ts#L59)

___

### createGlobalStore

▸ **createGlobalStore**<TState\>(`name`: *string*, `initialState`: TState): *Store*<TState\>

#### Type parameters:

Name |
:------ |
`TState` |

#### Parameters:

Name | Type |
:------ | :------ |
`name` | *string* |
`initialState` | TState |

**Returns:** *Store*<TState\>

Defined in: [state.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-state/src/state.ts#L10)

___

### getAppState

▸ **getAppState**(): *Store*<[*AppState*](interfaces/appstate.md)\>

**Returns:** *Store*<[*AppState*](interfaces/appstate.md)\>

Defined in: [state.ts:63](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-state/src/state.ts#L63)

___

### getGlobalStore

▸ **getGlobalStore**<TState\>(`name`: *string*, `fallbackState?`: TState): *Store*<TState\>

#### Type parameters:

Name | Default |
:------ | :------ |
`TState` | *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`name` | *string* |
`fallbackState?` | TState |

**Returns:** *Store*<TState\>

Defined in: [state.ts:39](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-state/src/state.ts#L39)

___

### update

▸ **update**<T\>(`obj`: T, `__namedParameters`: *string*[], `value`: *any*): T

#### Type parameters:

Name | Type |
:------ | :------ |
`T` | *Record*<string, any\> |

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | T |
`__namedParameters` | *string*[] |
`value` | *any* |

**Returns:** T

Defined in: [update.ts:1](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-state/src/update.ts#L1)
