---
'openmrs': patch
---

(fix) Check the IPv4 loopback explicitly when selecting a development port so occupied IPv4 ports are detected even when localhost resolves to IPv6. Hosts without an IPv4 loopback fall back to checking the IPv6 one.
