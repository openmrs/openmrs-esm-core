[O3 Framework](../API.md) / WorkspaceContainer

# Function: WorkspaceContainer()

> **WorkspaceContainer**(`__namedParameters`): `Element`

Defined in: [packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx:68](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces/container/workspace-container.component.tsx#L68)

Use this component to render the [workspace window](https://zeroheight.com/23a080e38/p/483a22-workspace)
in an app such as the patient chart, or a workspace overlay in an app such as the clinic dashboard.
This allows workspaces to be opened on the page where this component is mounted. This component
must not be mounted multiple times on the same page. If there are multiple apps on a page, only
one of those apps should use this component—it "hosts" the workspaces.

Workspaces may be opened with the [[launchWorkspace]] function from `@openmrs/esm-framework`
(among other options).

The `overlay` prop determines whether the workspace is rendered as an overlay or a window.
When a workspace window is opened, the other content on the screen will be pushed to the left.
When an overlay is opened, it will cover other content on the screen.

The context key is a string that appears in the URL, which defines the pages on which workspaces
are valid. If the URL changes in a way such that it no longer contains the context key, then
all workspaces will be closed. This ensures that, for example, workspaces on the home page do
not stay open when the user transitions to the patient dashboard; and also that workspaces do
not stay open when the user navigates to a different patient. The context key must be a valid
sub-path of the URL, with no initial or trailing slash. So if the URL is
`https://example.com/patient/123/foo`, then `patient` and `patient/123` and `123/foo` are valid
context keys, but `patient/12` and `pati` are not.

An extension slot is provided in the workspace header. Its name is derived from the `featureName` of
the top-level component in which it is defined (feature names are generally provided in the lifecycle
functions in an app's `index.ts` file). The slot is named `workspace-header-${featureName}-slot`.
For the patient chart, this is `workspace-header-patient-chart-slot`.

This component also provides the [Siderail and Bottom Nav](https://zeroheight.com/23a080e38/p/948cf1-siderail-and-bottom-nav/b/86907e).
To use this, pass the `showSiderailAndBottomNav` prop. The Siderail is rendered on the right side of the screen
on desktop, and the Bottom Nav is rendered at the bottom of the screen on tablet or mobile. The sidebar/bottom-nav
menu provides an extension slot, to which buttons are attached as extensions. The slot
derives its name from the `featureName` of the top-level component in which this `WorkspaceContainer`
appears (feature names are generally provided in the lifecycle functions in an app's `index.ts` file).
The slot is named `action-menu-${featureName}-items-slot`. For the patient chart, this is
`action-menu-patient-chart-items-slot`.

This component also provides everything needed for workspace notifications to be rendered.

## Parameters

### \_\_namedParameters

[`WorkspaceContainerProps`](../interfaces/WorkspaceContainerProps.md)

## Returns

`Element`
