[O3 Framework](../API.md) / formatTime

# Function: formatTime()

> **formatTime**(`date`): `string`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:396](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L396)

Formats the input as a time, according to the current locale.
12-hour or 24-hour clock depends on locale.

## Parameters

### date

`Date`

The date whose time portion should be formatted.

## Returns

`string`

The formatted time string (e.g., "2:30 PM" or "14:30").
