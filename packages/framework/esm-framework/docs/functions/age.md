[O3 Framework](../API.md) / age

# Function: age()

> **age**(`birthDate`, `currentDate`): `null` \| `string`

Defined in: [packages/framework/esm-utils/src/age-helpers.ts:83](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/age-helpers.ts#L83)

Gets a human readable and locale supported representation of a person's age, given their birthDate,
The representation logic follows the guideline here:
https://webarchive.nationalarchives.gov.uk/ukgwa/20160921162509mp_/http://systems.digital.nhs.uk/data/cui/uig/patben.pdf
(See Tables 7 and 8)

## Parameters

### birthDate

`ConfigType`

The birthDate. If birthDate is null, returns null.

### currentDate

`ConfigType` = `...`

Optional. If provided, calculates the age of the person at the provided currentDate (instead of now).

## Returns

`null` \| `string`

A human-readable string version of the age.

## Examples

```ts
age('2020-02-29', '2024-07-30') // => '4 yrs, 5 mths'
```

```ts
// String dates with partial precision are supported
age('2000', '2024-07-30') // => '24 yrs'
```
