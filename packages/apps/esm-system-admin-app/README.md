# openmrs-esm-system-administration

openmrs-esm-system-administration is a page with card views to external applications that we want to extend from the core OpenMRS.

## Purpose

This app has an interstitial page that will hold a number of card views pointing to different pages or applications outside the OpenMRS main.

Usage is documented both below and in the
[Import Map Overrides](http://o3-dev.docs.openmrs.org/#/getting_started/setup?id=import-map-overrides)
section of the developer documentation.

## Implementation notes

openmrs-esm-devtools is using
[import-map-overrides](https://github.com/joeldenning/import-map-overrides) 
to accomplish this behavior. 
If you prefer using the browser console instead of a UI to manage module 
overrides, check out the documentation in that github project.
