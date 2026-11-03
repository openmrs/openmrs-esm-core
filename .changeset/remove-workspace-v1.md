---
"@openmrs/esm-framework": major
"@openmrs/esm-styleguide": major
"@openmrs/esm-extensions": major
"@openmrs/esm-globals": major
"@openmrs/esm-routes": major
---

(BREAKING) Remove workspace v1 in favor of workspace v2. The following are removed from `@openmrs/esm-framework`: `launchWorkspace`, `launchWorkspaceGroup`, `closeWorkspace`, `navigateAndLaunchWorkspace`, `useWorkspaces`, `WorkspaceContainer`, `ActionMenuButton`, and the `WorkspaceRegistration`, `WorkspaceDefinition`, `WorkspaceGroupDefinition`, `WorkspaceWindowState`, `DefaultWorkspaceProps`, `CloseWorkspaceOptions`, `OpenWorkspace`, `WorkspacesInfo` and `Prompt` types. The `workspaces` and `workspaceGroups` properties of `routes.json` are no longer supported: apps that still define them get a console warning and nothing is registered. Migrate to `workspaces2`, `workspaceWindows2` and `workspaceGroups2` and the workspace v2 APIs.
