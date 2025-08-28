[O3 Framework](../API.md) / openmrsObservableFetch

# Function: openmrsObservableFetch()

> **openmrsObservableFetch**\<`T`\>(`url`, `fetchInit`): `Observable`\<[`FetchResponse`](../interfaces/FetchResponse.md)\<`T`\>\>

Defined in: [packages/framework/esm-api/src/openmrs-fetch.ts:272](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L272)

The openmrsObservableFetch function is a wrapper around openmrsFetch
that returns an [Observable](https://rxjs-dev.firebaseapp.com/guide/observable)
instead of a promise. It exists in case using an Observable is
preferred or more convenient than a promise.

## Type Parameters

### T

`T`

## Parameters

### url

`string`

See [[openmrsFetch]]

### fetchInit

[`FetchConfig`](../interfaces/FetchConfig.md) = `{}`

See [[openmrsFetch]]

## Returns

`Observable`\<[`FetchResponse`](../interfaces/FetchResponse.md)\<`T`\>\>

An Observable that produces exactly one Response object.
The response object is exactly the same as for [[openmrsFetch]].

#### Example

```js
import { openmrsObservableFetch } from '@openmrs/esm-api'
const subscription = openmrsObservableFetch(`${restBaseUrl}/session').subscribe(
  response => console.log(response.data),
  err => {throw err},
  () => console.log('finished')
)
subscription.unsubscribe()
```

#### Cancellation

To cancel the network request, simply call `subscription.unsubscribe();`
