---
'@openmrs/esm-api': patch
---

Share one in-flight session request between callers, so that a burst of callers at startup produces a single `GET /ws/rest/v1/session`. The session store only becomes loaded once the first response arrives, so every caller asking before then started another request; each of those reached the backend without a session cookie and was given a session of its own, and the browser kept whichever `Set-Cookie` landed last, leaving a login to authenticate a session the rest of the application was not using.

`refetchCurrentUser` still always issues its request. Given credentials it establishes the session rather than reporting it, and without them it is how a caller reads back a session it has just changed, as logging in and logging out both do.
