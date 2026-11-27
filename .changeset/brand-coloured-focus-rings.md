---
'@openmrs/esm-styleguide': patch
'@openmrs/esm-primary-navigation-app': patch
---

(fix) Use the brand colour for focus rings. Carbon draws focus rings with its `focus` token, which the styleguide didn't set, so buttons, inputs, selects, dropdowns, date pickers, table headers, tiles and overflow menus showed Carbon's blue when focused. The styleguide now sets `--cds-focus` to `--brand-03` on `:root`, so every Carbon focus ring uses the brand colour, including those in apps that compile their own Carbon styles. Carbon's light theme wrappers (`white` and `g10`) and light charts set the token back to blue, so the styleguide sets it again for them. This replaces the separate focus overrides for tabs, side nav links, pagination nav pages and primary and tertiary buttons. Focus rings on the navbar's icon buttons and in its user menu panel are white instead, so they stay visible on the dark brand colours. The navbar logo link, which had no focus style and showed the browser's default ring, gets the same white ring, and the logo is now centred inside it. A logo configured as a name shows as white text instead of a blue underlined link.
