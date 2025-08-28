[O3 Framework](../API.md) / LeftNavMenu

# Variable: LeftNavMenu

> `const` **LeftNavMenu**: `ForwardRefExoticComponent`\<`LeftNavMenuProps` & `RefAttributes`\<`HTMLElement`\>\>

Defined in: [packages/framework/esm-styleguide/src/left-nav/index.tsx:32](https://github.com/its-kios09/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/left-nav/index.tsx#L32)

This component renders the left nav in desktop mode. It's also used to render the same
nav when the hamburger menu is clicked on in tablet mode. See side-menu-panel.component.tsx

Use of this component by anything other than <SideMenuPanel> (where isChildOfHeader == false)
is deprecated; it simply renders nothing.
