---
'@openmrs/esm-styleguide': patch
---

(fix) Use the brand colours in the side nav and date picker. Carbon drew the side nav's current-page bar and focus outline in its default blue, so side navs built from `SideNavLink` and `SideNavMenu` (like the billing admin left panel) didn't match the rest of the app. The current-page bar now uses `--brand-01`, the same colour as the app's own left nav, and the focus outline uses `--brand-03`, the same as tabs. The date picker's selected day, today's date and its marker were hard-coded to Carbon's blue. They now use `--brand-03`, the same colour as primary buttons and tabs.
