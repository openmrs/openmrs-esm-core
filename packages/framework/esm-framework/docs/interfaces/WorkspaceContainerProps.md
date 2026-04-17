[O3 Framework](../API.md) / WorkspaceContainerProps

# Interface: ~~WorkspaceContainerProps~~

Defined in: [packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx#L18)

## Deprecated

Workspace container is no longer needed with workspace v2.

## Properties

### ~~actionMenuProps?~~

> `optional` **actionMenuProps**: `Record`\<`string`, `unknown`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx#L37)

Props to pass to the action menu component.

***

### ~~additionalWorkspaceProps?~~

> `optional` **additionalWorkspaceProps**: `object`

Defined in: [packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx:35](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx#L35)

Additional props to pass to the workspace. Using this is unusual; you will generally
want to pass props to the workspace when you open it using `launchWorkspace`. Use this
only for props that will apply to every workspace launched on the page where this
component is mounted.

***

### ~~contextKey~~

> **contextKey**: `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx#L24)

The context key is a path element that identifies the pages on which workspaces should
appear. Defined to ensure workspaces do not stay open when navigating between pages.
Must be a valid sub-path of the URL, with no initial or trailing slash.

***

### ~~overlay?~~

> `optional` **overlay**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx#L26)

When true, renders the workspace as an overlay instead of a side panel window.

***

### ~~showSiderailAndBottomNav?~~

> `optional` **showSiderailAndBottomNav**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx:28](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx#L28)

When true, renders the Siderail (desktop) or Bottom Nav (tablet/mobile) action menu.
