[O3 Framework](../API.md) / LeftNavMenu

# Variable: LeftNavMenu

> `const` **LeftNavMenu**: `ForwardRefExoticComponent`\<`Omit`\<`SideNavProps`, `"ref"`\> & `RefAttributes`\<`HTMLElement`\>\>

Defined in: [packages/framework/esm-styleguide/src/left-nav/index.tsx:52](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-styleguide/src/left-nav/index.tsx#L52)

This component renders the left nav in desktop mode. It's also used to render the same
nav when the hamburger menu is clicked on in tablet mode. See side-menu-panel.component.tsx

Use of this component by anything other than <SideMenuPanel> (where isChildOfHeader == false)
is deprecated; it simply renders nothing.
