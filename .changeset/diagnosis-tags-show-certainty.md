---
'@openmrs/esm-styleguide': minor
'@openmrs/esm-translations': minor
---

`DiagnosisTags` takes an optional `showCertainty` prop. When set, diagnoses recorded as PROVISIONAL get a leading "?" (read out as "Provisional"), and everything else shows the name alone. Long names truncate while the "?" stays visible, and only truncated names get a tooltip and a tab stop. Adds the `provisional` core translation key.
