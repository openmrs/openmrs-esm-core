---
"@openmrs/esm-config": patch
---

(fix) Accept translation override keys such as `es-419` and `zh-Hant`. The validator only allowed letters in the region and had no room for a script, so these keys logged a configuration error even though the overrides applied. Keys that i18next never looks up, such as `es_419` or `sw-ke`, still log an error, which now says what form to use.
