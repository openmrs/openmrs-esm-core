[O3 Framework](../API.md) / ExportedWorkspace

# Variable: ExportedWorkspace

> `const` **ExportedWorkspace**: `React.FC`\<[`ExportedWorkspaceProps`](../interfaces/ExportedWorkspaceProps.md)\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx:60](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/exported-workspace.component.tsx#L60)

Renders the content of a registered workspace (the `children` of its `<Workspace2>`) within its own
DOM subtree, independent of the real global workspace window system. It emulates the workspace
window that contains `name`: opening/closing child workspaces (via `launchChildWorkspace()` /
`closeWorkspace()` from within the workspace) navigates within this component, in a window held in
its own local store. It renders no chrome (no title bar, maximize, hide, close, or icon); callers can
render their own around it.
