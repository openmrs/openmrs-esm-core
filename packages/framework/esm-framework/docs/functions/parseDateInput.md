[O3 Framework](../API.md) / parseDateInput

# Function: parseDateInput()

> **parseDateInput**(`dateInput`, `referenceDate`): `null` \| `Dayjs`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:455](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L455)

Parses a date input into a dayjs object. String inputs are interpreted using
any-date-parser with corrections for its month/day representation differences
with dayjs. Non-string inputs are passed directly to dayjs.

## Parameters

### dateInput

`ConfigType`

The date to parse.

### referenceDate

`Dayjs`

Used as the base when resolving partial string dates (e.g., '2000' resolves missing fields from this date).

## Returns

`null` \| `Dayjs`

A dayjs object, or null if the string could not be parsed.
