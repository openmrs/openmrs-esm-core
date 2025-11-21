[O3 Framework](../API.md) / launchWorkspaceGroup2

# Function: launchWorkspaceGroup2()

> **launchWorkspaceGroup2**\<`GroupProps`\>(`groupName`, `groupProps`): `Promise`\<`boolean`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/workspace2.ts:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/workspace2.ts#L32)

**`Experimental`**

Attempts to launch the specified workspace group with the given group props. Note that only one workspace group
may be opened at any given time. If a workspace group is already opened, calling `launchWorkspaceGroup2` with
either a different group name, or same group name but different incompatible props**, will result in prompting to
confirm closing workspaces. If the user confirms, the opened group, along with its windows (and their workspaces), is closed, and
the requested group is immediately opened.

** 2 sets of props are compatible if either one is nullish, or if they are shallow equal.

## Type Parameters

### GroupProps

`GroupProps` *extends* `object`

## Parameters

### groupName

`string`

### groupProps

`null` | `GroupProps`

## Returns

`Promise`\<`boolean`\>

a Promise that resolves to true if the specified workspace group with the specified group props
 is successfully opened, or that it already is opened.
