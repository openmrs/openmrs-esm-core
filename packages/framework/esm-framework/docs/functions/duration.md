[O3 Framework](../API.md) / duration

# Function: duration()

> **duration**(`startDate`, `endDate`, `options?`): `null` \| `DurationInput`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:645](https://github.com/DushmanthaHerath1/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L645)

Calculates the duration between two dates as a structured duration object.

When called with no options or a single unit string, the unit is auto-selected
using dayjs relativeTime thresholds:
- < 45 seconds → seconds
- < 45 minutes → minutes
- < 22 hours → hours
- < 26 days → days
- < 11 months → months
- otherwise → years

With a [DurationOptions](../interfaces/DurationOptions.md) object, you can override thresholds and/or request
a multi-unit decomposition via largestUnit/smallestUnit.

## Parameters

### startDate

`ConfigType`

The start date. If null, returns null.

### endDate

`ConfigType` = `...`

Optional. Defaults to now.

### options?

A unit string for single-unit output, or a DurationOptions object.

[`DurationUnit`](../type-aliases/DurationUnit.md) | [`DurationOptions`](../interfaces/DurationOptions.md)

## Returns

`null` \| `DurationInput`

A DurationInput object, or null if either date is null or unparseable.

## Examples

```ts
// Auto-selects the appropriate unit
duration('2022-01-01', '2024-07-30') // => { years: 2 }
```

```ts
// Multi-unit decomposition
duration('2022-01-01', '2024-07-30', { largestUnit: 'year', smallestUnit: 'day' })
// => { years: 2, months: 6, days: 29 }
```
