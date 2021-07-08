[@openmrs/esm-framework](../API.md) / RetryOptions

# Interface: RetryOptions

Options for configuring the behavior of the [retry](../API.md#retry) function.

## Table of contents

### Methods

- [getDelay](retryoptions.md#getdelay)
- [onError](retryoptions.md#onerror)
- [shouldRetry](retryoptions.md#shouldretry)

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

[packages/framework/esm-utils/src/retry.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/retry.ts#L16)

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

[packages/framework/esm-utils/src/retry.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/retry.ts#L23)

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

[packages/framework/esm-utils/src/retry.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/retry.ts#L10)
