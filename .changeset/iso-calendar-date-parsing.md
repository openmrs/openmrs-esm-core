---
'@openmrs/esm-utils': patch
---

(fix) Parse full and partial ISO calendar dates independently of the display locale

Fix birthdate formatting and date-based calculations in locales with non-Latin digits.
Preserve year-only and year-month precision, and reject invalid ISO calendar dates instead
of reinterpreting them or rolling them into another month. Other date formats continue
to use the existing parser.
