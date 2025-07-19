[O3 Framework](../API.md) / formatPartialDate

# Function: formatPartialDate()

> **formatPartialDate**(`dateString`, `options?`): `null` \| `string`

Defined in: packages/framework/esm-utils/dist/dates/date-util.d.ts:105

Formats the string representing a date, including partial representations of dates, according to the current
locale and the given options.

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

### dateString

`string`

### options?

`Partial`\<[`FormatDateOptions`](../type-aliases/FormatDateOptions.md)\>

## Returns

`null` \| `string`
