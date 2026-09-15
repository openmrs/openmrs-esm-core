---
'@openmrs/esm-config': minor
'@openmrs/esm-extensions': major
'@openmrs/esm-framework': major
'@openmrs/esm-react-utils': major
'@openmrs/esm-routes': patch
'@openmrs/esm-styleguide': patch
---

(BREAKING) Rework extension and configuration derivation so writes invalidate only the affected slots instead of recomputing the complete extension graph.

Extension rendering state is now tracked separately from registrations, and slot-local display conditions are evaluated for each rendering. `registerExtensionSlot` no longer accepts rendering state, and `ExtensionInfo` no longer contains live instances.

`ExtensionSlotState.assignedExtensions` is renamed to `candidateExtensions` and no longer has display conditions applied to it, so it must not be used for any rendering decision. Call `getAssignedExtensions()` instead, or features like `Display conditions` will not be applied.

`useStore` now returns the selected value itself rather than a copy of it, so mutating the result mutates the store.

`useAssignedExtensionIds` applies display conditions, and so also takes connectivity into account.

Parcels are given a 15 second bootstrap, mount and unmount timeout, after which they are marked as broken rather than left in a lifecycle that never settles.

Extensions added only through `config.add` now retain their configuration order when no other ordering information is present.
