[O3 Framework](../API.md) / getAsyncLifecycle

# Function: getAsyncLifecycle()

> **getAsyncLifecycle**\<`T`\>(`lazy`, `options`): () => `Promise`\<`ReactAppOrParcel`\<`T`\>\>

Defined in: [packages/framework/esm-react-utils/src/getLifecycle.ts:52](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/getLifecycle.ts#L52)

Creates a lazy-loading single-spa lifecycle for a React component. The component
is loaded asynchronously via dynamic import only when it's needed, which helps
reduce initial bundle size. This is the recommended way to define lifecycles
for most modules.

## Type Parameters

### T

`T`

## Parameters

### lazy

() => `Promise`\<\{ `default`: `ComponentType`\<`T`\>; \}\>

A function that returns a Promise resolving to a module with the
  component as its default export (i.e., a dynamic import).

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
import { getAsyncLifecycle } from '@openmrs/esm-framework';
const options = { featureName: 'my-feature', moduleName: '@openmrs/esm-my-app' };
export const root = getAsyncLifecycle(() => import('./root.component'), options);
```
