[O3 Framework](../API.md) / RenderIfValueIsTruthy

# Variable: RenderIfValueIsTruthy

> `const` **RenderIfValueIsTruthy**: `React.FC`\<`PropsWithChildren`\<\{ `fallback?`: `React.ReactNode`; `value`: `unknown`; \}\>\>

Defined in: [packages/framework/esm-react-utils/src/RenderIfValueIsTruthy.tsx:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/RenderIfValueIsTruthy.tsx#L17)

A really simple component that renders its children if the prop named `value` has a truthy value

## Example

```tsx
<RenderIfValueIsTruthy value={variable}>
 <Component value={variable} />
</RenderIfValueIsTruthy>
````

@param props.value The value to check whether or not its truthy
@param props.fallback What to render if the value is not truthy. If not specified, nothing will be rendered
@param props.children The components to render if the `value` is truthy
