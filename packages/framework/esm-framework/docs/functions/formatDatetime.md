[O3 Framework](../API.md) / formatDatetime

# Function: formatDatetime()

> **formatDatetime**(`date`, `options?`): `string`

Defined in: packages/framework/esm-utils/dist/dates/date-util.d.ts:157

Formats the input into a string showing the date and time, according
to the current locale. The `mode` parameter is as described for
`formatDate`.

This is created by concatenating the results of `formatDate`
and `formatTime` with a comma and space. This agrees with the
output of `Date.prototype.toLocaleString` for *most* locales.

## Parameters

### date

`Date`

The date to format.

### options?

`Partial`\<`Omit`\<[`FormatDateOptions`](../type-aliases/FormatDateOptions.md), `"time"`\>\>

Optional formatting options (same as formatDate, except time is always included).

## Returns

`string`

The formatted date and time string.
