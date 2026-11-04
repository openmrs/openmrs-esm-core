---
'@openmrs/esm-login-app': minor
'@openmrs/esm-styleguide': minor
'@openmrs/esm-framework': minor
'@openmrs/esm-api': minor
'@openmrs/esm-app-shell': patch
'@openmrs/esm-translations': patch
---

(feat) Add a loading screen and update the application error screen

This adds a loading screen that is displayed whenever the backend is
loading, determined by the backend redirecting all requests to the 
initial setup screen. 

In order to make the loading screen brandable, I've moved the logo
configuration into the styleguide instead of the login-app, but the
login-app will continue to respect it's own configuration preferentially.

The loading screen is meant to mimic the login page with a plain
background and the widgets displayed on a card. I've also updated the 
Application Error Screen to match this style.

The application error page is now localizable with some caveats, mostly
that i18next isn't available, so advanced features like counts or
interpolations are not currently available, but the displayed strings
can now be localized. This may change in the future to more fully
support i18next's feature set.
