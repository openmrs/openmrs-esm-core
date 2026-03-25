[O3 Framework](../API.md) / PageHeaderContent

# Variable: PageHeaderContent

> `const` **PageHeaderContent**: `React.FC`\<[`PageHeaderContentProps`](../interfaces/PageHeaderContentProps.md)\>

Defined in: [packages/framework/esm-styleguide/src/page-header/page-header.component.tsx:90](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/page-header/page-header.component.tsx#L90)

The PageHeaderContent component should be used inside the [[PageHeader]] component. It is used if the page
header should include some content on the right side, in addition to the pictogram and the name of the page.
If only the page header is needed, without any additional content, the [[PageHeader]] component can be used
on its own, and the PageHeaderContent component is not needed.

## Example

```tsx
  <PageHeader>
    <PageHeaderContent title="My Dashboard" illustration={<Illustration />} />
    <Button>Click me</Button>
  </PageHeader>
```
