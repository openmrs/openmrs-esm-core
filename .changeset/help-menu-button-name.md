---
'@openmrs/esm-help-menu-app': patch
---

Give the help menu button an accessible name. Screen readers announced the icon-only button as "button". It is now labelled "Help menu" and reports whether the menu is open with `aria-expanded`. The popup it opens uses `role="group"` instead of `role="menu"`, since it holds links and a button rather than menu items, and pressing Escape closes it and returns focus to the button.
