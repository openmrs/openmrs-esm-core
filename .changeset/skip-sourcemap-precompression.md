---
'openmrs': patch
---

(fix) Stop precompressing source maps in `openmrs build`. Browsers only fetch source maps while developer tools are open, and they were about half of what a reference application build compressed. `.map.gz` and `.map.br` files left behind by earlier builds are removed.
