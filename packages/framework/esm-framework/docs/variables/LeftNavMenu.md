[O3 Framework](../API.md) / LeftNavMenu

# Variable: LeftNavMenu

> `const` **LeftNavMenu**: `ForwardRefExoticComponent`\<`LeftNavMenuProps` & `RefAttributes`\<`HTMLElement`\>\>

Defined in: [packages/framework/esm-styleguide/src/left-nav/index.tsx:32](https://github.com/openmrs/openmrs-esm-core/blob/18d2874f03a33a6ab8295af0e87ac97fdd150718/packages/framework/esm-styleguide/src/left-nav/index.tsx#L32)

This component renders the left nav in desktop mode. It's also used to render the same
nav when the hamburger menu is clicked on in tablet mode. See side-menu-panel.component.tsx

Use of this component by anything other than <SideMenuPanel> (where isChildOfHeader == false)
is deprecated; it simply renders nothing.
