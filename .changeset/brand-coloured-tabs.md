---
'@openmrs/esm-styleguide': patch
---

(fix) Make selected and focused tabs use the brand colour. The styleguide's tab overrides targeted Carbon v10 class names that Carbon 11 doesn't render, so tabs fell back to Carbon's blue unless an app added its own `!important` overrides. Tabs in apps without their own override now change from blue to the brand colour.
