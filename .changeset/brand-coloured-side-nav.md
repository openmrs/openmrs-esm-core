---
'@openmrs/esm-styleguide': patch
---

(fix) Use the brand colours for the Carbon side nav's current-page bar and focus outline. Carbon drew both in its default blue, so side navs built from `SideNavLink` and `SideNavMenu` (like the billing admin left panel) didn't match the rest of the app. The current-page bar now uses `--brand-01`, the same colour as the app's own left nav, and the focus outline uses `--brand-03`, the same as tabs.
