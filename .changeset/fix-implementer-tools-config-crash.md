---
'@openmrs/esm-config': patch
---

Fix a crash at app shell startup caused by an invalid implementer tools config: `displayedValidationMessages` is now initialized before any code path can read it, and the initial config computation is wrapped so a derivation error is logged instead of thrown (O3-5971)
