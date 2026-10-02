---
'@openmrs/esm-error-handling': patch
---

Coerce the reason reaching `window.onerror` and `window.onunhandledrejection` to a string before it is used as the error toast description. An `Error` object passed straight through could not be rendered as a React child, so the toast threw during render and no error was shown to the user at all (O3-5981).
