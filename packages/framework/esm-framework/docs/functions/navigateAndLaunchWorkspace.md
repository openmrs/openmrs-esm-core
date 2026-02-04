[O3 Framework](../API.md) / navigateAndLaunchWorkspace

# Function: navigateAndLaunchWorkspace()

> **navigateAndLaunchWorkspace**(`options`): `void`

Defined in: [packages/framework/esm-styleguide/src/workspaces/workspaces.ts:390](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/workspaces.ts#L390)

Use this function to navigate to a new page and launch a workspace on that page.

## Parameters

### options

The options for navigating and launching the workspace.

#### additionalProps?

`object`

Additional props to pass to the workspace component being launched.

#### contextKey

`string`

The context key used by the target page.

#### targetUrl

`string`

The URL to navigate to. Will be passed to [[navigate]].

#### workspaceName

`string`

The name of the workspace to launch.

## Returns

`void`
