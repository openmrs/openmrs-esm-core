---
'@openmrs/esm-styleguide': patch
---

Declare `uuid` as a dependency of the styleguide, which uses it to give each open workspace window an ID. Only `esm-offline` declared it, and that package has been removed, so app shell builds only found `uuid` when a copy brought in by the CLI's dev server happened to be hoisted, and failed with "Can't resolve 'uuid'" when it wasn't.
