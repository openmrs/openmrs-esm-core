---
"@openmrs/esm-config": patch
"@openmrs/esm-extensions": major
"@openmrs/esm-framework": major
"@openmrs/esm-react-utils": minor
"@openmrs/esm-routes": patch
---

(BREAKING) Rework extension and configuration derivation so writes invalidate only the affected slots instead of recomputing the complete extension graph.

Extension rendering state is now tracked separately from registrations, and slot-local display conditions are evaluated for each rendering. `registerExtensionSlot` no longer accepts rendering state, and `ExtensionInfo` no longer contains live instances.

Extensions added only through `config.add` now retain their configuration order when no other ordering information is present.
