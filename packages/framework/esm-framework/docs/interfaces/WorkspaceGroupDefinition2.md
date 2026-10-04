[O3 Framework](../API.md) / WorkspaceGroupDefinition2

# Interface: WorkspaceGroupDefinition2

Defined in: [packages/framework/esm-globals/src/types.ts:205](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L205)

## Properties

### closeable?

> `optional` **closeable**: `boolean`

Defined in: [packages/framework/esm-globals/src/types.ts:207](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L207)

***

### name

> **name**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:206](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L206)

***

### overlay?

> `optional` **overlay**: `boolean`

Defined in: [packages/framework/esm-globals/src/types.ts:208](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L208)

***

### persistence?

> `optional` **persistence**: `"app-wide"` \| `"closable"`

Defined in: [packages/framework/esm-globals/src/types.ts:219](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L219)

In app-wide persistence mode, a workspace group renders its
action menu without a close button. This is for
workspace groups that are meant to be opened for the entire duration of the app

In closable persistence mode, a workspace group renders its
action menu with a close button. User may explicitly close the group, along
with any opened windows / workspaces.

***

### scopePattern?

> `optional` **scopePattern**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:234](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L234)

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
