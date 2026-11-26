---
'@openmrs/esm-primary-navigation-app': patch
---

(fix) Give the navbar logo link a focus ring that matches the other header actions. It had no focus style, so keyboard focus showed the browser's default rounded blue ring on the brand-coloured navbar. It now shows the same 2px white ring, drawn inside the link.
