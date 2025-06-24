[O3 Framework](../API.md) / useOnVisible

# Function: useOnVisible()

> **useOnVisible**(`callBack`): `MutableRefObject`\<`HTMLElement`\>

Defined in: [packages/framework/esm-react-utils/src/useOnVisible.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOnVisible.ts#L15)

Returns a ref that can be used on a HTML component to trigger
an action when the component is scrolled into visible view,
This is particularly useful for infinite scrolling UIs to load data on demand.

## Parameters

### callBack

() => `void`

The callback to run when the component is scrolled into visible view.
  Care should be taken with this param. The callback should
  be cached across re-renders (via useCallback) and it should have
  logic to avoid doing work multiple times while scrolling.

## Returns

`MutableRefObject`\<`HTMLElement`\>

a ref that can be passed to an HTML Element
