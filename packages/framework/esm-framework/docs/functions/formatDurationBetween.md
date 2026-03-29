[O3 Framework](../API.md) / formatDurationBetween

# Function: formatDurationBetween()

> **formatDurationBetween**(`startDate`, `endDate`, `options?`): `null` \| `string`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:707](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L707)

Calculates the duration between two dates and formats it as a locale-aware string.
Uses the same unit-selection logic as [duration](duration.md) and delegates formatting
to [formatDuration](formatDuration.md).

## Parameters

### startDate

`ConfigType`

The start date. If null, returns null.

### endDate

`ConfigType` = `...`

Optional. Defaults to now.

### options?

A unit string for single-unit output, or a [DurationOptionsWithFormat](../interfaces/DurationOptionsWithFormat.md) object.
  The `formatOptions` field is passed to Intl.DurationFormat (defaults to short style).

[`DurationUnit`](../type-aliases/DurationUnit.md) | [`DurationOptionsWithFormat`](../interfaces/DurationOptionsWithFormat.md)

## Returns

`null` \| `string`

A formatted duration string, or null if either date is null or unparseable.

## Examples

```ts
formatDurationBetween('2022-01-01', '2024-07-30') // => '2 yrs'
```

```ts
// Multi-unit with long-form formatting
formatDurationBetween('2022-01-01', '2024-07-30', {
  largestUnit: 'year',
  smallestUnit: 'day',
  formatOptions: { style: 'long' },
}) // => '2 years, 6 months, 29 days'
```
