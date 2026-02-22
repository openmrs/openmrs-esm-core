[O3 Framework](../API.md) / setUserLanguage

# Function: setUserLanguage()

> **setUserLanguage**(`data`): `void`

Defined in: [packages/framework/esm-api/src/current-user.ts:157](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/current-user.ts#L157)

Sets the document's language attribute based on the user's locale preference
from the session data. This affects the HTML `lang` attribute which is used
for accessibility and internationalization.

The locale is determined from either the session's locale or the user's
default locale property. Underscores in the locale are converted to hyphens
to match BCP 47 language tag format.

## Parameters

### data

[`Session`](../interfaces/Session.md)

The session object containing locale information.

## Returns

`void`
