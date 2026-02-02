[O3 Framework](../API.md) / reportError

# Function: reportError()

> **reportError**(`err`): `void`

Defined in: packages/framework/esm-error-handling/dist/index.d.ts:22

Reports an error to the global error handler. The error will be displayed
to the user as a toast notification. This function ensures the error is
converted to an Error object if it isn't already one.

The error is thrown asynchronously (via setTimeout) to ensure it's caught
by the global window.onerror handler.

## Parameters

### err

`unknown`

The error to report. Can be an Error object, string, or any other value.

## Returns

`void`

## Example

```ts
import { reportError } from '@openmrs/esm-framework';
try {
  await riskyOperation();
} catch (error) {
  reportError(error);
}
```
