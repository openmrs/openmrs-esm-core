---
"@openmrs/esm-framework": minor
"@openmrs/esm-utils": minor
---

(feat) Add toLanguageTag and getLocaleDisplayName framework functions

`toLanguageTag` converts an OpenMRS locale identifier into a canonical BCP 47 language tag, and
`getLocaleDisplayName` names a locale in its own language. `getLocale` and `matchLocale` now share
`toLanguageTag` instead of normalizing separators themselves.

That makes `matchLocale` treat `@` as a subtag separator, which it previously did not. `uz@Latn`
now resolves instead of being skipped with a warning, and a malformed modifier that happens to
parse as a subtag (`en@garbage` becomes `en-garbage`) will match rather than warn.
