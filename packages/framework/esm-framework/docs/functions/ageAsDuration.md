[O3 Framework](../API.md) / ageAsDuration

# Function: ageAsDuration()

> **ageAsDuration**(`birthDate`, `currentDate`): `null` \| `DurationInput`

Defined in: [packages/framework/esm-utils/src/age-helpers.ts:22](https://github.com/DushmanthaHerath1/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/age-helpers.ts#L22)

Gets the age of a person as a structured duration object, following NHS Digital guidelines
(Tables 7 and 8) for which units to include based on the person's age.

## Parameters

### birthDate

`ConfigType`

The birthDate. If null, returns null.

### currentDate

`ConfigType` = `...`

Optional. If provided, calculates the age at the provided date instead of now.

## Returns

`null` \| `DurationInput`

A DurationInput object, or null if birthDate is null or unparseable.

## See

https://webarchive.nationalarchives.gov.uk/ukgwa/20160921162509mp_/http://systems.digital.nhs.uk/data/cui/uig/patben.pdf

## Examples

```ts
// For infants, returns fine-grained units
ageAsDuration('2024-07-29', '2024-07-30') // => { hours: 24 }
```

```ts
// For adults (>= 18), returns years only
ageAsDuration('2000-01-15', '2024-07-30') // => { years: 24 }
```
