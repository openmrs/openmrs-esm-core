---
"@openmrs/esm-app-shell": major
"@openmrs/rspack-config": major
"@openmrs/webpack-config": major
---

(feat) Federate most of the Module Federation runtime

Apps built with these versions of `@openmrs/rspack-config` or `@openmrs/webpack-config` require an app shell that provides the Module Federation runtime. Deploy the app shell first. Rolling the shell back to a pre-change version while those apps remain deployed will prevent them from starting. The new shell remains compatible with apps built using older tooling.
