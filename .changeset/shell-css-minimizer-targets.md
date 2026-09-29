---
'@openmrs/esm-app-shell': patch
---

Pass the OpenMRS browserslist to the app shell's CSS minimizer. Lightning CSS was running on its own defaults and downleveling every logical property in the shell's CSS for browsers O3 does not support, which roughly tripled its size. The shell CSS now keeps logical properties as written, going from about 3 MB to 1.1 MB uncompressed. The main styleguide stylesheet is no longer re-minified after it has been content-hashed, so its filename matches the bytes it serves.
