[O3 Framework](../API.md) / interpolateUrl

# Function: interpolateUrl()

> **interpolateUrl**(`template`, `additionalParams?`): `string`

Defined in: [packages/framework/esm-navigation/src/navigation/interpolate-string.ts:36](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-navigation/src/navigation/interpolate-string.ts#L36)

Interpolates a string with openmrsBase and openmrsSpaBase.

Useful for accepting `${openmrsBase}` or `${openmrsSpaBase}`plus additional template
parameters in configurable URLs.

Example usage:
```js
interpolateUrl("test ${openmrsBase} ${openmrsSpaBase} ok");
   // will return "test /openmrs /openmrs/spa ok"

interpolateUrl("${openmrsSpaBase}/patient/${patientUuid}", {
   patientUuid: "4fcb7185-c6c9-450f-8828-ccae9436bd82",
}); // will return "/openmrs/spa/patient/4fcb7185-c6c9-450f-8828-ccae9436bd82"
```

This can be used in conjunction with the `navigate` function like so
```js
navigate({
 to: interpolateUrl(
   "${openmrsSpaBase}/patient/${patientUuid}",
   { patientUuid: patient.uuid }
 )
}); // will navigate to "/openmrs/spa/patient/4fcb7185-c6c9-450f-8828-ccae9436bd82"
```

## Parameters

### template

`string`

A string to interpolate

### additionalParams?

Additional values to interpolate into the string template

## Returns

`string`
