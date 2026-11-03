---
'@openmrs/esm-api': patch
'@openmrs/esm-app-shell': patch
'@openmrs/esm-framework': patch
'@openmrs/esm-login-app': patch
'@openmrs/esm-primary-navigation-app': patch
---

(fix) Support authentication failures from the backend

This is a set of small changes that:

* Makes `openmrsFetch()` able to handle 401s or 403s on the session endpoint where the response needs to be processed by the framework
* Updates the session-tracking machinery to leverage this feature and handle errors appropriately
* Moves the calls that the login app and primary navigation app made to the session endpoint to appropriate esm-api calls
* Adds an error handler in the app shell so that if the first fetch of the session fails, the user is presented with an error screen instead of a blank screen
