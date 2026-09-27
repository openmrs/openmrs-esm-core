---
'@openmrs/esm-styleguide': patch
---

Place the app shell's startup loading spinner in the body grid's `appRoots` area. The spinner is appended to `<body>`, and without a grid area it was auto-placed in an extra row below the fold, inside the `min-content` left nav column. That kept the spinner out of sight and widened the column by about 84 px while it was mounted, which caused two layout shifts on every cold load. The spinner now shows centered in the viewport and the layout stays put.
