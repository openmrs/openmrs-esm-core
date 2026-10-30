---
'@openmrs/esm-styleguide': patch
'@openmrs/esm-translations': patch
---

(fix) O3-6008: Pluralize pagination counts and translate previous/next buttons

Pluralize item counts and page counts in `Pagination`, ensuring singular "1 / 1 item" and "of 1 page" render when counts are 1, while passing `backwardText` and `forwardText` to Carbon Pagination buttons. Also export a typed `getCarbonPaginationTranslationProps` helper so direct Carbon consumers can share consistent, translated pagination labels.
