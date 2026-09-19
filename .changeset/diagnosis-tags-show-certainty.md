---
'@openmrs/esm-styleguide': minor
'@openmrs/esm-translations': minor
---

`DiagnosisTags` takes an optional `showCertainty` prop. When set, diagnoses recorded as CONFIRMED or PROVISIONAL show the certainty beside the name, and anything else shows the name alone. Long names truncate while the certainty stays visible, and only truncated names get a tooltip and a tab stop. Adds the `confirmed` and `provisional` core translation keys.
