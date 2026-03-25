[O3 Framework](../API.md) / getSyncLifecycle

# Function: getSyncLifecycle()

> **getSyncLifecycle**\<`T`\>(`Component`, `options`): () => `Promise`\<`ReactAppOrParcel`\<`T`\>\>

Defined in: [packages/framework/esm-react-utils/src/getLifecycle.ts:77](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/getLifecycle.ts#L77)

Creates a single-spa lifecycle for a React component that is already loaded.
Unlike [getAsyncLifecycle](getAsyncLifecycle.md), this wraps a synchronously-available component
in a Promise to match the expected lifecycle interface. Use this when the
component doesn't need lazy loading.

## Type Parameters

### T

`T`

## Parameters

### Component

`ComponentType`\<`T`\>

The React component to create a lifecycle for.

### options

`ComponentDecoratorOptions`

Configuration options for the OpenMRS component decorator.

## Returns

A function that returns a Promise resolving to a single-spa lifecycle object.

> (): `Promise`\<`ReactAppOrParcel`\<`T`\>\>

### Returns

`Promise`\<`ReactAppOrParcel`\<`T`\>\>

## Example

```ts
import { getSyncLifecycle } from '@openmrs/esm-framework';
import MyComponent from './MyComponent';
const options = { featureName: 'my-feature', moduleName: '@openmrs/esm-my-app' };
export const myExtension = getSyncLifecycle(MyComponent, options);
```
