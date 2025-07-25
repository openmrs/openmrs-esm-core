[O3 Framework](../API.md) / ActionMenuButtonProps2

# Interface: ActionMenuButtonProps2

Defined in: [packages/framework/esm-styleguide/src/workspaces2/action-menu2/action-menu-button2.component.tsx:31](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/action-menu2/action-menu-button2.component.tsx#L31)

## Properties

### icon()

> **icon**: (`props`) => `Element`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/action-menu2/action-menu-button2.component.tsx:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/action-menu2/action-menu-button2.component.tsx#L32)

#### Parameters

##### props

`object`

#### Returns

`Element`

***

### label

> **label**: `string`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/action-menu2/action-menu-button2.component.tsx:33](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/action-menu2/action-menu-button2.component.tsx#L33)

***

### onBeforeWorkspaceLaunch()?

> `optional` **onBeforeWorkspaceLaunch**: () => `Promise`\<`boolean`\>

Defined in: [packages/framework/esm-styleguide/src/workspaces2/action-menu2/action-menu-button2.component.tsx:50](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/action-menu2/action-menu-button2.component.tsx#L50)

An optional callback function to run before launching the workspace.
If provided, the workspace will only be launched if this function returns true.
This can be used to perform checks or prompt the user before launching the workspace.
Note that this function does not run if the action button's window is already opened;
it will just restore (unhide) the window.

#### Returns

`Promise`\<`boolean`\>

***

### tagContent?

> `optional` **tagContent**: `ReactNode`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/action-menu2/action-menu-button2.component.tsx:34](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/action-menu2/action-menu-button2.component.tsx#L34)

***

### workspaceToLaunch

> **workspaceToLaunch**: `object`

Defined in: [packages/framework/esm-styleguide/src/workspaces2/action-menu2/action-menu-button2.component.tsx:35](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/workspaces2/action-menu2/action-menu-button2.component.tsx#L35)

#### groupProps?

> `optional` **groupProps**: `Record`\<`string`, `any`\>

#### windowProps?

> `optional` **windowProps**: `Record`\<`string`, `any`\>

#### workspaceName

> **workspaceName**: `string`

#### workspaceProps

> **workspaceProps**: `Record`\<`string`, `any`\>
