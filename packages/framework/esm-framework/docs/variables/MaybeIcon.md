[O3 Framework](../API.md) / MaybeIcon

# Variable: MaybeIcon

> `const` **MaybeIcon**: `MemoExoticComponent`\<`ForwardRefExoticComponent`\<`object` & [`IconProps`](../type-aliases/IconProps.md) & `RefAttributes`\<`SVGSVGElement`\>\>\>

Defined in: [packages/framework/esm-styleguide/src/icons/icons.tsx:864](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/icons/icons.tsx#L864)

This is a utility component that takes an `icon` and renders it if the sprite for the icon
is available. The goal is to make it easier to conditionally render configuration-specified icons.

## Example

```tsx
  <MaybeIcon icon='omrs-icon-baby' className={styles.myIconStyles} />
```
