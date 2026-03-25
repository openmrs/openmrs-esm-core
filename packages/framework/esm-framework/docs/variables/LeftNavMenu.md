[O3 Framework](../API.md) / LeftNavMenu

# Variable: LeftNavMenu

> `const` **LeftNavMenu**: `ForwardRefExoticComponent`\<`LeftNavMenuProps` & `RefAttributes`\<`HTMLElement`\>\>

Defined in: [packages/framework/esm-styleguide/src/left-nav/index.tsx:33](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/left-nav/index.tsx#L33)

This component renders the left nav in desktop mode. It's also used to render the same
nav when the hamburger menu is clicked on in tablet mode. See side-menu-panel.component.tsx

Use of this component by anything other than <SideMenuPanel> (where isChildOfHeader == false)
is deprecated; it simply renders nothing.
