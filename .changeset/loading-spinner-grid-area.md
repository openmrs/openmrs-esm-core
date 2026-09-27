---
'@openmrs/esm-styleguide': patch
---

Place the app shell's startup loading spinner and fatal error page in the body grid's `appRoots` area. Both are appended to `<body>`, and without a grid area the browser auto-placed them in an extra row below the fold, inside the `min-content` left nav column. The spinner was never visible and widened the column by about 84 px while it was mounted, which caused two layout shifts on every cold load. When the app shell failed to start, the "Application Error" page rendered below the fold, so users saw a blank screen. Both now show in the app area, and a long error message no longer widens the page past the viewport.
