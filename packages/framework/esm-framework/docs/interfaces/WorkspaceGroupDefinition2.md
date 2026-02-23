[O3 Framework](../API.md) / WorkspaceGroupDefinition2

# Interface: WorkspaceGroupDefinition2

Defined in: packages/framework/esm-globals/dist/types.d.ts:297

## Properties

### closeable?

> `optional` **closeable**: `boolean`

Defined in: packages/framework/esm-globals/dist/types.d.ts:299

***

### name

> **name**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:298

***

### overlay?

> `optional` **overlay**: `boolean`

Defined in: packages/framework/esm-globals/dist/types.d.ts:300

***

### persistence?

> `optional` **persistence**: `"app-wide"` \| `"closable"`

Defined in: packages/framework/esm-globals/dist/types.d.ts:310

In app-wide persistence mode, a workspace group renders its
action menu without a close button. This is for
workspace groups that are meant to be opened for the entire duration of the app

In closable persistence mode, a workspace group renders its
action menu with a close button. User may explicitly close the group, along
with any opened windows / workspaces.

***

### scopePattern?

> `optional` **scopePattern**: `string`

Defined in: packages/framework/esm-globals/dist/types.d.ts:320

URL pattern that defines the scope where workspaces in this group should persist.
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
