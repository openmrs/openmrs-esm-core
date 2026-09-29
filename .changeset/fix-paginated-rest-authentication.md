---
'@openmrs/esm-api': patch
---

Suppress browser Basic authentication prompts for absolute REST URLs, including pagination links, by matching requests against the configured OpenMRS API origin and REST path. Preserve explicit header overrides and support API bases with trailing slashes.
