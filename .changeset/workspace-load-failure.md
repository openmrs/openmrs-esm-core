---
'@openmrs/esm-styleguide': patch
'@openmrs/esm-framework': patch
---

(fix) Show an error notification when a workspace fails to load instead of leaving it loading indefinitely. Other workspaces in the window still render, and each failure is reported once.
