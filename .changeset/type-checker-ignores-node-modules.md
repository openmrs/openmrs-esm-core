---
'@openmrs/rspack-config': patch
'@openmrs/webpack-config': patch
---

(fix) Keep the dev server running on macOS for an app whose tsconfig has no `include`. The type checker watched the whole app directory, `node_modules` included, and the dev server died with `EMFILE: too many open files, watch` a few seconds after the first type check. With Rspack, watching builds now ignore `.git`, `node_modules` and `test-results`, so an edit made directly inside `node_modules` no longer triggers a rebuild. Symlinked packages are still watched. With Webpack, only the type checker's own watcher changes: it skips `node_modules` and the build output.
