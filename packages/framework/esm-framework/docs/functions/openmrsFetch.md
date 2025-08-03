[O3 Framework](../API.md) / openmrsFetch

# Function: openmrsFetch()

> **openmrsFetch**\<`T`\>(`path`, `fetchInit`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\<`T`\>\>

Defined in: [packages/framework/esm-api/src/openmrs-fetch.ts:83](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L83)

The openmrsFetch function is a wrapper around the
[browser's built-in fetch function](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch),
with extra handling for OpenMRS-specific API behaviors, such as
request headers, authentication, authorization, and the API urls.

## Type Parameters

### T

`T` = `any`

## Parameters

### path

`string`

A string url to make the request to. Note that the
  openmrs base url (by default `/openmrs`) will be automatically
  prepended to the URL, so there is no need to include it.

### fetchInit

[`FetchConfig`](../interfaces/FetchConfig.md) = `{}`

A [fetch init object](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Syntax).
  Note that the `body` property does not need to be `JSON.stringify()`ed
  because openmrsFetch will do that for you.

## Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\<`T`\>\>

A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  that resolves with a [Response object](https://developer.mozilla.org/en-US/docs/Web/API/Response).
  Note that the openmrs version of the Response object has already
  downloaded the HTTP response body as json, and has an additional
  `data` property with the HTTP response json as a javascript object.

#### Example
```js
import { openmrsFetch } from '@openmrs/esm-api'
const abortController = new AbortController();
openmrsFetch(`${restBaseUrl}/session', {signal: abortController.signal})
  .then(response => {
    console.log(response.data.authenticated)
  })
  .catch(err => {
    console.error(err.status);
  })
abortController.abort();
openmrsFetch(`${restBaseUrl}/session', {
  method: 'POST',
  body: {
    username: 'hi',
    password: 'there',
  }
})
```

#### Cancellation

To cancel a network request, use an
[AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort).
It is best practice to cancel your network requests when the user
navigates away from a page while the request is pending request, to
free up memory and network resources and to prevent race conditions.
