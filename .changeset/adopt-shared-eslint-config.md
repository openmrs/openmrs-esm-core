---
"@openmrs/esm-api": patch
"@openmrs/esm-app-shell": patch
"@openmrs/esm-config": patch
"@openmrs/esm-expression-evaluator": patch
"@openmrs/esm-globals": patch
"@openmrs/esm-offline": patch
"openmrs": patch
"@openmrs/rspack-config": patch
"@openmrs/webpack-config": patch
---

(chore) Migrate the repo to ESLint 9 and the shared `@openmrs/eslint-config` flat config. The source changes are removals of stale `eslint-disable` comments that ESLint 9 newly reports as unused. No functional changes.
