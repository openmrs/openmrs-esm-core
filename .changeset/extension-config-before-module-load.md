---
'@openmrs/esm-config': patch
'@openmrs/esm-framework': patch
---

(fix) Stop reporting an extension's config keys as unknown before the extension's module has finished starting, including extensions that define their own config schema
