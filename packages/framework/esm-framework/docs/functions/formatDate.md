[O3 Framework](../API.md) / formatDate

# Function: formatDate()

> **formatDate**(`date`, `options?`): `string`

Defined in: packages/framework/esm-utils/dist/dates/date-util.d.ts:125

Formats the input date according to the current locale and the
given options.

Default options:
 - mode: "standard",
 - time: "for today",
 - day: true,
 - month: true,
 - year: true
 - noToday: false

If the date is today then "Today" is produced (in the locale language).
This behavior can be disabled with `noToday: true`.

When time is included, it is appended with a comma and a space. This
agrees with the output of `Date.prototype.toLocaleString` for *most*
locales.

## Parameters

### date

`Date`

### options?

`Partial`\<[`FormatDateOptions`](../type-aliases/FormatDateOptions.md)\>

## Returns

`string`
