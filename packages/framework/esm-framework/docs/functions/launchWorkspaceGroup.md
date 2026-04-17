[O3 Framework](../API.md) / launchWorkspaceGroup

# Function: ~~launchWorkspaceGroup()~~

> **launchWorkspaceGroup**(`groupName`, `args`): `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:216](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L216)

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

## Deprecated

migrate to workspace v2 and use launchWorkspaceGroup2 instead. See:
https://openmrs.atlassian.net/wiki/spaces/docs/pages/615677981/Workspace+v2+Migration+Guide
