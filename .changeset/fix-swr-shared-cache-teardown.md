---
"@openmrs/esm-react-utils": patch
---

Prevent the shared SWR cache from being torn down when a decorated component unmounts. Every component decorated with `openmrsComponentDecorator` mounts its own `<SWRConfig>` over one shared cache; SWR deletes that cache's global state when the first such boundary unmounts, crashing still-mounted components ("undefined is not iterable"). The cache is now pre-initialized so the framework module owns its lifecycle.
