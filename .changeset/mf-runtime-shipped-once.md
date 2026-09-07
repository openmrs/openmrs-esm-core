---
'@openmrs/rspack-config': major
'@openmrs/webpack-config': major
'@openmrs/esm-app-shell': major
'openmrs': major
---

(feat) O3-5873: Ship the Module Federation runtime once, from the app shell

Remote entries no longer embed their own copy of `@module-federation/runtime-core`; the app shell
publishes it on a global and remotes read it from there, so a page downloads it once rather than once per
app. Measured on `@openmrs/esm-login-app`, a production remote entry drops from ~85 kB to ~32 kB raw
(~26 kB to ~9.7 kB gzipped); the remainder is per-build federation glue plus the ~14 kB of runtime that
has to stay per remote.

Both shared configs now build with `@module-federation/enhanced` rather than the bundlers' built-in
Module Federation plugins, which also brings the webpack path onto the Module Federation 2.0 runtime.
Webpack-built remote entries grow as a result — ~8.7 kB to ~23 kB raw on the same app — because they
previously shipped a classic container with no runtime at all. Neither config emits an `mf-manifest.json`
or federated type declarations, as before.

**This is a breaking change for apps and app shells upgraded separately.** An app built with this version
of `@openmrs/rspack-config`, `@openmrs/webpack-config` or the `openmrs` CLI requires an app shell of this
version or newer, and refuses to start under an older one with an error in the browser console naming
itself. Apps built with older tooling keep working in the new app shell, so a distribution can mix old
apps with a new app shell but not the reverse. An app and its app shell should also be built against the
same Module Federation minor; a mismatch logs a warning rather than failing the load, because minor skew
usually works and a changed runtime helper only sometimes breaks shared-dependency de-duplication. There
is deliberately no machine-readable compatibility field yet — the app shell's own version is the contract.

One consequence worth knowing: because every remote now shares the app shell's `runtime-core`, that
build's identifier and its `experiments.optimization` settings apply to every app's federation instance.
The app shell therefore sets only `target: 'web'`, which is true of every app in a distribution.
