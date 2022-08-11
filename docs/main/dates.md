# Working with Dates

The OpenMRS Frontend Framework provides several utilities for working with
dates. These have been designed with locale-sensitivity as a key concern.
Acceptable date formats vary by language and region, and these functions
are intended to accomodate that variation.

## Formatting for display

Date objects can be displayed in a variety of standard formats using the
[formatDate](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#formatdate),
[formatTime](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#formattime), and
[formatDatetime](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#formatdatetime)
functions. These functions format dates in ways that are both adaptable
(using the `mode` parameter) and localized according to the user's locale.

Date strings produced by these formatting functions should never be
used for comparisons or other kinds of date math. It is recommended
to format dates for display as close to the "view" or "render" as
possible to minimize the risk of this happening.

## Formatting to send to the server

Dates sent in the request body via `openmrsFetch` are automatically
formatted into ISO-8601 format.

## Parsing

The ISO-8601 date strings sent by the server can be parsed into Javascript
`Date` objects using the
[parseDate](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#parsedate)
function. This uses [dayjs](https://day.js.org/docs/en/parse/string) for
parsing.

