[O3 Framework](../API.md) / RetryOptions

# Interface: RetryOptions

Defined in: packages/framework/esm-utils/dist/retry.d.ts:5

Options for configuring the behavior of the [retry](../functions/retry.md) function.

## Methods

### getDelay()?

> `optional` **getDelay**(`attempt`): `number`

Defined in: packages/framework/esm-utils/dist/retry.d.ts:17

Calculates the next delay (in milliseconds) before a retry attempt.
Returning a value for the inital attempt (`0`) delays the initial function invocation.

#### Parameters

##### attempt

`number`

The current (zero-based) retry attempt. `0` indicates the initial attempt.

#### Returns

`number`

***

### onError()?

> `optional` **onError**(`e`, `attempt`): `void`

Defined in: packages/framework/esm-utils/dist/retry.d.ts:24

Called when invoking the function resulted in an error.
Allows running side-effects on errors, e.g. logging.

#### Parameters

##### e

`any`

The error thrown by the function.

##### attempt

`number`

The current (zero-based) retry attempt. `0` indicates the initial attempt.

#### Returns

`void`

***

### shouldRetry()?

> `optional` **shouldRetry**(`attempt`): `any`

Defined in: packages/framework/esm-utils/dist/retry.d.ts:11

Determines whether the retry function should retry executing the function after it failed
with an error on the current attempt.

#### Parameters

##### attempt

`number`

The current (zero-based) retry attempt. `0` indicates the initial attempt.

#### Returns

`any`
