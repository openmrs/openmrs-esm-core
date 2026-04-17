[O3 Framework](../API.md) / getLifecycle

# Function: getLifecycle()

> **getLifecycle**\<`T`\>(`Component`, `options`): `ReactAppOrParcel`\<`T`\>

Defined in: [packages/framework/esm-react-utils/src/getLifecycle.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/getLifecycle.ts#L26)

Creates a single-spa lifecycle object for a React component. The component is
wrapped with the OpenMRS component decorator which provides standard functionality
like error boundaries, configuration, and extension support.

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

`ReactAppOrParcel`\<`T`\>

A single-spa lifecycle object with bootstrap, mount, and unmount functions.

## Example

```ts
import { getLifecycle } from '@openmrs/esm-framework';
import MyComponent from './MyComponent';
export const lifecycle = getLifecycle(MyComponent, { featureName: 'my-feature', moduleName: '@openmrs/esm-my-app' });
```
