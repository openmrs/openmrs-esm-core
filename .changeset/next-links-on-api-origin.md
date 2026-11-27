---
'@openmrs/esm-api': patch
'@openmrs/esm-react-utils': patch
'@openmrs/esm-styleguide': patch
---

Move a server's next-page link onto the OpenMRS API origin in one place, for the REST and FHIR pagination handlers, `openmrsFetchAll` and the location picker, and only when the link's path is under the OpenMRS web services path. The pagination handlers now use the API origin from `openmrsBase` rather than the page's origin, and the location picker no longer requests `Location??_getpages=...` for its next page.
