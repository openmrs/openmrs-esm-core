---
'@openmrs/esm-styleguide': patch
---

(fix) Stop OpenmrsDateRangePicker throwing when a date is cleared, call `onChange` with `undefined` dates instead, and let users type a new range once the range is empty
