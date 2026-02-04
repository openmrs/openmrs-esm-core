[O3 Framework](../API.md) / createErrorHandler

# Function: createErrorHandler()

> **createErrorHandler**(): (`incomingErr`) => `void`

Defined in: packages/framework/esm-error-handling/dist/index.d.ts:42

Creates an error handler function that captures the current stack trace at
the time of creation. When the returned handler is invoked with an error,
it appends the captured stack trace to provide better debugging information
for asynchronous operations.

This is particularly useful for handling errors in Promise chains or
callback-based APIs where the original call site would otherwise be lost.

## Returns

A function that accepts an error and reports it with an enhanced stack trace.

> (`incomingErr`): `void`

### Parameters

#### incomingErr

`unknown`

### Returns

`void`

## Example

```ts
import { createErrorHandler } from '@openmrs/esm-framework';
const handleError = createErrorHandler();
someAsyncOperation()
  .then(processResult)
  .catch(handleError);
```
