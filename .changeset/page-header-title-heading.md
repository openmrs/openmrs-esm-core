---
"@openmrs/esm-styleguide": patch
"@openmrs/esm-framework": patch
---

Render the page header title as an `h1`. `PageHeaderContent` rendered the title in a paragraph, so screen-reader users couldn't reach a page's title through heading navigation. The title keeps its existing styles, so it looks the same.
