---
'@openmrs/esm-styleguide': patch
---

(fix) Use the brand colour for focus rings. Carbon draws focus rings with its `focus` token, which the styleguide didn't set, so buttons, inputs, selects, dropdowns, date pickers, table headers, tiles and overflow menus showed Carbon's blue when focused. The styleguide now sets `--cds-focus` to `--brand-03` on `:root`, so every Carbon focus ring uses the brand colour, including those in apps that compile their own Carbon styles. This replaces the separate focus overrides for tabs, side nav links and primary and tertiary buttons.
