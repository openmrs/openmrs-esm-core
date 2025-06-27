[O3 Framework](../API.md) / retry

# Function: retry()

> **retry**\<`T`\>(`fn`, `options?`): `Promise`\<`T`\>

Defined in: packages/framework/esm-utils/dist/retry.d.ts:38

Executes the specified function and retries executing on failure with a custom backoff strategy
defined by the options.

If not configured otherwise, this function uses the following default options:
* Retries 5 times beyond the initial attempt.
* Uses an exponential backoff starting with an initial delay of 1000ms.

## Type Parameters

### T

`T`

## Parameters

### fn

() => `Promise`\<`T`\>

The function to be executed and retried on failure.

### options?

[`RetryOptions`](../interfaces/RetryOptions.md)

Additional options which configure the retry behavior.

## Returns

`Promise`\<`T`\>

The result of successfully executing `fn`.

## Throws

Rethrows the final error of running `fn` when the function stops retrying.
