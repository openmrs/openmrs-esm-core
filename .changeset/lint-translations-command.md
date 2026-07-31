---
"openmrs": minor
---

Add an `openmrs lint-translations` command that checks translatable strings for problems that break translation. It treats every `translations/en.json` beneath the working directory as a frontend module, so it works in both single-module repos and monorepos.

The check worth adopting first is `default-value-drift`: because `en.json` wins at runtime, a `t()` default that disagrees with the string `en.json` ships is invisible to the developer reading the code and to unit tests, which resolve `t(key, defaultValue)` to the default via the shared mock. Running `extract-translations` does not reconcile the two, since i18next-parser preserves the existing value of a key that is already present.

The command also reports broken plural families whose forms are identical, `{{count}}` used without plural forms, defaults that are template literals with interpolation (which cannot be extracted, so the interpolated value never renders), values with stray leading or trailing whitespace, keys duplicated with different capitalization, conflicting defaults for one key, and `toUpperCase()`/`toLowerCase()` applied to translated text. Errors exit non-zero; warnings do not unless `--strict` is passed. Use `--check` to run named checks only and `--format json` for machine-readable output.
