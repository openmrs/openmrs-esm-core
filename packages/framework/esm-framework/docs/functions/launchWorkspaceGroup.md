[O3 Framework](../API.md) / launchWorkspaceGroup

# Function: launchWorkspaceGroup()

> **launchWorkspaceGroup**(`groupName`, `args`): `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:210](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L210)

Launches a workspace group with the specified name and configuration.
If there are any open workspaces, it will first close them before launching the new workspace group.

## Parameters

### groupName

`string`

The name of the workspace group to launch

### args

`LaunchWorkspaceGroupArg`

Configuration object for launching the workspace group

## Returns

`void`

## Example

```ts
launchWorkspaceGroup("myGroup", {
  state: initialState,
  onWorkspaceGroupLaunch: () => console.log("Workspace group launched"),
  workspaceGroupCleanup: () => console.log("Cleaning up workspace group")
});
```
