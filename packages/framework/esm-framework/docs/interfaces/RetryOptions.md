[@openmrs/esm-framework](../API.md) / RetryOptions

# Interface: RetryOptions

Options for configuring the behavior of the [retry](../API.md#retry) function.

## Table of contents

### Methods

- [getDelay](RetryOptions.md#getdelay)
- [onError](RetryOptions.md#onerror)
- [shouldRetry](RetryOptions.md#shouldretry)

## Methods

### getDelay

▸ `Optional` **getDelay**(`attempt`): `number`

Calculates the next delay (in milliseconds) before a retry attempt.
Returning a value for the inital attempt (`0`) delays the initial function invocation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `attempt` | `number` | The current (zero-based) retry attempt. `0` indicates the initial attempt. |

#### Returns

`number`

#### Defined in

[packages/framework/esm-utils/src/retry.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/retry.ts#L18)

___

### onError

▸ `Optional` **onError**(`e`, `attempt`): `void`

Called when invoking the function resulted in an error.
Allows running side-effects on errors, e.g. logging.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `e` | `any` | The error thrown by the function. |
| `attempt` | `number` | The current (zero-based) retry attempt. `0` indicates the initial attempt. |

#### Returns

`void`

#### Defined in

[packages/framework/esm-utils/src/retry.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/retry.ts#L25)

___

### shouldRetry

▸ `Optional` **shouldRetry**(`attempt`): `any`

Determines whether the retry function should retry executing the function after it failed
with an error on the current attempt.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `attempt` | `number` | The current (zero-based) retry attempt. `0` indicates the initial attempt. |

#### Returns

`any`

#### Defined in

[packages/framework/esm-utils/src/retry.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/retry.ts#L12)
