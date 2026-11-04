---
'openmrs': patch
---

(fix) Let `openmrs develop` pick a port on hosts without IPv6. The port check treated the missing IPv6 loopback as the port being in use, so every port looked taken.
