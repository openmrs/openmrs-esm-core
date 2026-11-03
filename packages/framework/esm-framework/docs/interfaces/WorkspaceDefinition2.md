[O3 Framework](../API.md) / WorkspaceDefinition2

# Interface: WorkspaceDefinition2

Defined in: [packages/framework/esm-globals/src/types.ts:248](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L248)

## Properties

### component

> **component**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:250](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L250)

***

### meta?

> `optional` **meta**: `object`

Defined in: [packages/framework/esm-globals/src/types.ts:261](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L261)

Meta describes any properties that are passed down to the workspace when it is loaded. It is
available to the workspace component via `useWorkspace2Context().workspaceMeta`.

#### Index Signature

\[`k`: `string`\]: `unknown`

***

### name

> **name**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:249](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L249)

***

### width?

> `optional` **width**: `"narrow"` \| `"wider"` \| `"extra-wide"`

Defined in: [packages/framework/esm-globals/src/types.ts:256](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L256)

Overrides the window's `width` while this workspace is the top-most workspace in its window.
The whole window, including any parent workspaces beneath it, renders at this width.

***

### window

> **window**: `string`

Defined in: [packages/framework/esm-globals/src/types.ts:251](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L251)
