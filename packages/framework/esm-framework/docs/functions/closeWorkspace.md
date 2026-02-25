[O3 Framework](../API.md) / closeWorkspace

# Function: ~~closeWorkspace()~~

> **closeWorkspace**(`name`, `options`): `boolean`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:448](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L448)

Function to close an opened workspace

## Parameters

### name

`string`

Workspace registration name

### options

[`CloseWorkspaceOptions`](../interfaces/CloseWorkspaceOptions.md) = `{}`

Options to close workspace

## Returns

`boolean`

## Deprecated

migrate to workspace v2 and call closeWorkspace from Workspace2DefinitionProps instead. See:
https://openmrs.atlassian.net/wiki/spaces/docs/pages/615677981/Workspace+v2+Migration+Guide
