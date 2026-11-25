---
'@openmrs/esm-api': minor
'@openmrs/esm-emr-api': patch
'@openmrs/esm-react-utils': patch
'@openmrs/esm-framework': minor
---

Make REST and FHIR fetch-all hooks refreshable through URL-prefix invalidation while preserving their existing mutation APIs. Avoid repeated first-page requests during automatic expansion and refresh all pages after cache-clearing invalidation while unmounted. Add `openmrsFetchAll` and use it to load every page of attachments and visit types, preserving response metadata and reporting later-page failures (O3-6343).
