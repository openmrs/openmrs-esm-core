[O3 Framework](../API.md) / WorkspaceGroupDefinition2

# Interface: WorkspaceGroupDefinition2

Defined in: [packages/framework/esm-globals/src/types.ts:304](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L304)

## Properties

### closeable?

> `optional` **closeable**: `boolean`

Defined in: [packages/framework/esm-globals/src/types.ts:306](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L306)

***

### name

> **name**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:305](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L305)

***

### overlay?

> `optional` **overlay**: `boolean`

Defined in: [packages/framework/esm-globals/src/types.ts:307](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L307)

***

### persistence?

> `optional` **persistence**: `"app-wide"` \| `"closable"`

Defined in: [packages/framework/esm-globals/src/types.ts:318](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L318)

In app-wide persistence mode, a workspace group renders its
action menu without a close button. This is for
workspace groups that are meant to be opened for the entire duration of the app

In closable persistence mode, a workspace group renders its
action menu with a close button. User may explicitly close the group, along
with any opened windows / workspaces.

***

### scopePattern?

> `optional` **scopePattern**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:333](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L333)

URL pattern that defines the scope where workspaces in this group should persist.
The pattern is matched against the pathname relative to the configured SPA base path.
Navigating outside the configured SPA base path closes the workspace group.
For backward compatibility, if the pattern does not match both SPA-relative pathnames, it is
retried against both full pathnames.
- If not defined: workspaces close only when navigating to a different app
- If defined without capture groups: workspaces close when URL doesn't match pattern
- If defined with capture groups: workspaces close when captured values change

#### Examples

```ts
"^/home/appointments" - static scope for appointments dashboard
```

```ts
"^/patient/([^/]+)/chart" - dynamic scope by patient UUID
```
