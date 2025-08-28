[O3 Framework](../API.md) / PageHeader

# Variable: PageHeader

> `const` **PageHeader**: `React.FC`\<[`PageHeaderProps`](../type-aliases/PageHeaderProps.md)\>

Defined in: [packages/framework/esm-styleguide/src/page-header/page-header.component.tsx:58](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/page-header/page-header.component.tsx#L58)

The page header is typically located at the top of a dashboard. It includes a pictogram on the left,
the name of the dashboard or page, and the `implementationName` from the configuration, which is typically
the name of the clinic or the authority that is using the implementation. It can also include interactive
content on the right-hand side. It can be used in two ways:

1. Alone, in order to render just the page header, with no content on the right side:

## Examples

```tsx
  <PageHeader title="My Dashboard" illustration={<Illustration />} />
```

2. Wrapped around the [[PageHeaderContent]] component, in order to render the page header on the left
and some other content on the right side:

```tsx
  <PageHeader>
    <PageHeaderContent title="My Dashboard" illustration={<Illustration />} />
    <Button>Click me</Button>
  </PageHeader>
```
