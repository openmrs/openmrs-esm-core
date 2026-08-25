---
"@openmrs/esm-styleguide": patch
---

Exclude Carbon's CodeSnippet copy button from the global primary button override. Carbon builds the copy button as a primary button and then repaints it with a layer background, but the styleguide's `.cds--btn--primary` override won the cascade on source order, so every CodeSnippet copy button rendered as a solid brand-teal primary button. The copy button now keeps Carbon's subtle layer background across rest, hover, active, and focus states in both light and dark themes.
