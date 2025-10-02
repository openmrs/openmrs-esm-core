[O3 Framework](../API.md) / ActionMenuButton2

# Variable: ActionMenuButton2

> `const` **ActionMenuButton2**: `React.FC`\<`ActionMenuButtonProps2`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/action-menu2/action-menu-button2.component.tsx:65](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/action-menu2/action-menu-button2.component.tsx#L65)

**`Experimental`**

The ActionMenuButton2 component is used to render a button in the action menu of a workspace group.
The button is associated with a specific workspace window, defined in routes.json of the app with the button.
When one or more workspaces within the window are opened, the button will be highlighted.
If the window is hidden, either `tagContent` (if defined) or an exclamation mark will be displayed
on top of the icon.

On clicked, The button either:
1. restores the workspace window if it is opened and hidden; or
2. launch a workspace from within that window, if the window is not opened.
