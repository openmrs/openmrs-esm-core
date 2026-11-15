---
'@openmrs/webpack-config': patch
---

(chore) Upgrade `fork-ts-checker-webpack-plugin` from 6.5.3 to 9.1.0. Watching builds that poll without a numeric interval, with `poll: true` or `CHOKIDAR_USEPOLLING` set, keep working: version 9 crashes on those, so the config drops the undefined intervals it passes to Chokidar.
