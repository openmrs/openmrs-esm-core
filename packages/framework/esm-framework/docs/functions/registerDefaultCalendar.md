[O3 Framework](../API.md) / registerDefaultCalendar

# Function: registerDefaultCalendar()

> **registerDefaultCalendar**(`locale`, `calendar`): `void`

Defined in: packages/framework/esm-utils/dist/dates/date-util.d.ts:43

Provides the name of the calendar to associate, as a default, with the given base locale.

## Parameters

### locale

`string`

the locale to register this calendar for

### calendar

`CalendarIdentifier`

the calendar to use for this registration

## Returns

`void`

## Example

```
registerDefaultCalendar('en', 'buddhist') // sets the default calendar for the 'en' locale to Buddhist.
```
