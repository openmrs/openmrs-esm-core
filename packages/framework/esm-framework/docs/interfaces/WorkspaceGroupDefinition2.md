[O3 Framework](../API.md) / WorkspaceGroupDefinition2

# Interface: WorkspaceGroupDefinition2

Defined in: [packages/framework/esm-globals/src/types.ts:317](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L317)

## Properties

### closeable?

> `optional` **closeable**: `boolean`

Defined in: [packages/framework/esm-globals/src/types.ts:319](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L319)

***

### name

> **name**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:318](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L318)

***

### overlay?

> `optional` **overlay**: `boolean`

Defined in: [packages/framework/esm-globals/src/types.ts:320](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L320)

***

### persistence?

> `optional` **persistence**: `"app-wide"` \| `"closable"`

Defined in: [packages/framework/esm-globals/src/types.ts:331](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L331)

In app-wide persistence mode, a workspace group renders its
action menu without a close button. This is for
workspace groups that are meant to be opened for the entire duration of the app

In closable persistence mode, a workspace group renders its
action menu with a close button. User may explicitly close the group, along
with any opened windows / workspaces.

***

### scopePattern?

> `optional` **scopePattern**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:342](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L342)

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
