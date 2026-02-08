[O3 Framework](../API.md) / WorkspaceContainerProps

# Interface: WorkspaceContainerProps

Defined in: [packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx#L15)

## Properties

### actionMenuProps?

> `optional` **actionMenuProps**: `Record`\<`string`, `unknown`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx:34](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx#L34)

Props to pass to the action menu component.

***

### additionalWorkspaceProps?

> `optional` **additionalWorkspaceProps**: `object`

Defined in: [packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx#L32)

Additional props to pass to the workspace. Using this is unusual; you will generally
want to pass props to the workspace when you open it using `launchWorkspace`. Use this
only for props that will apply to every workspace launched on the page where this
component is mounted.

***

### contextKey

> **contextKey**: `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx#L21)

The context key is a path element that identifies the pages on which workspaces should
appear. Defined to ensure workspaces do not stay open when navigating between pages.
Must be a valid sub-path of the URL, with no initial or trailing slash.

***

### overlay?

> `optional` **overlay**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx#L23)

When true, renders the workspace as an overlay instead of a side panel window.

***

### showSiderailAndBottomNav?

> `optional` **showSiderailAndBottomNav**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx#L25)

When true, renders the Siderail (desktop) or Bottom Nav (tablet/mobile) action menu.
