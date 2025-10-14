[O3 Framework](../API.md) / formatDatetime

# Function: formatDatetime()

> **formatDatetime**(`date`, `options?`): `string`

Defined in: packages/framework/esm-utils/dist/dates/date-util.d.ts:140

Formats the input into a string showing the date and time, according
to the current locale. The `mode` parameter is as described for
`formatDate`.

This is created by concatenating the results of `formatDate`
and `formatTime` with a comma and space. This agrees with the
output of `Date.prototype.toLocaleString` for *most* locales.

## Parameters

### date

`Date`

### options?

`Partial`\<`Omit`\<[`FormatDateOptions`](../type-aliases/FormatDateOptions.md), `"time"`\>\>

## Returns

`string`
