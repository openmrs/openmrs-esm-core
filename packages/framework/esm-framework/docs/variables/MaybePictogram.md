[O3 Framework](../API.md) / MaybePictogram

# Variable: MaybePictogram

> `const` **MaybePictogram**: `MemoExoticComponent`\<`ForwardRefExoticComponent`\<`object` & [`PictogramProps`](../type-aliases/PictogramProps.md) & `RefAttributes`\<`SVGSVGElement`\>\>\>

Defined in: [packages/framework/esm-styleguide/src/pictograms/pictograms.tsx:220](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/pictograms/pictograms.tsx#L220)

This is a utility component that takes an `pictogram` and render it if the sprite for the pictogram
is available. The goal is to make it easier to conditionally render configuration-specified pictograms.

## Example

```tsx
  <MaybePictogram pictogram='omrs-icon-baby' className={styles.myPictogramStyles} />
```
