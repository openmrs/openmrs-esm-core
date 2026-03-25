[O3 Framework](../API.md) / translateFrom

# Function: translateFrom()

> **translateFrom**(`moduleName`, `key`, `fallback?`, `options?`): `string`

Defined in: [packages/framework/esm-translations/src/index.ts:40](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-translations/src/index.ts#L40)

This function is for getting a translation from a specific module. Use this only if the
translation is neither in the app making the call, nor in the core translations.
This function is useful, for example, in libraries that are used by multiple apps, since libraries can't
define their own translations.

Translations within the current app should be accessed with the i18next API, using
`useTranslation` and `t` as usual. Core translations should be accessed with the
[[getCoreTranslation]] function.

IMPORTANT: This function creates a hidden dependency on the module. Worse yet, it creates
a dependency specifically on that module's translation keys, which are often regarded as
"implementation details" and therefore may be volatile. Also note that this function DOES NOT
load the module's translations if they have not already been loaded via `useTranslation`.
**This function should therefore be avoided when possible.**

## Parameters

### moduleName

`string`

The module to get the translation from, e.g. '@openmrs/esm-login-app'

### key

`string`

The i18next translation key

### fallback?

`string`

Fallback text for if the lookup fails

### options?

`Omit`\<`TOptions`, `"ns"` \| `"defaultValue"`\>

Options object passed to the i18next `t` function. See https://www.i18next.com/translation-function/essentials#overview-options
           for more information. `ns` and `defaultValue` are already set and may not be used.

## Returns

`string`

The translated text as a string
