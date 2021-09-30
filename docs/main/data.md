# Retrieving and posting data

Frontend modules interact with the OpenMRS server via the APIs exposed
by its modules. In general, most of the endpoints we use are provided
by the [FHIR Module](https://wiki.openmrs.org/display/projects/OpenMRS+HL7+FHIR+Solutions).
Most of the rest are provided by the
[REST Module](https://wiki.openmrs.org/display/docs/REST+Module), which is
documented [here](https://rest.openmrs.org/).

Endpoints from the FHIR Module should always be preferred, when they are
available. FHIR is an interoperability standard which OpenMRS supports.

Some data is available using higher-level functions or custom React Hooks provided
by `@openmrs/esm-framework`.  These should be used when available.

All of this functionality (React hooks excepted) is provided by the
[`@openmrs/esm-api`](https://github.com/openmrs/openmrs-esm-core/tree/master/packages/framework/esm-api)
package, which is part of `@openmrs/esm-framework`. See its
[API Docs](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/docs/API.md).
The React hooks are in
[`@openmrs/esm-react-utils`](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/docs/API.md),
which is also part of `@openmrs/esm-framework`.

## FHIR

To use the FHIR API, use the [fhir.js](https://github.com/FHIR/fhir.js#fhirjs)
client object provided by `@openmrs/esm-framework`:

```typescript
import { fhir } from '@openmrs/esm-framework';

fhir.read<fhir.Patient>({ type: 'Patient', patient: patientUuid })
```

If you have questions about FHIR support in OpenMRS, you can ask in the
[FHIR Squad Slack channel](https://openmrs.slack.com/archives/CKLPH66BB).

## Other OpenMRS server APIs

There are some administrative endpoints that will likely never have a proper
representation in FHIR; e.g., managing encounter types. When no suitable
FHIR endpoint is available you will want to use a different API of the
OpenMRS server.

To use the [REST Web Services API](https://rest.openmrs.org/)
or any other API of the OpenMRS server, use
[`openmrsFetch`](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/docs/API.md#openmrsfetch):

```typescript
import { openmrsFetch } from '@openmrs/esm-framework'

const abortController = new AbortController();
abortController.abort();
openmrsFetch('/ws/rest/v1/session', {
  method: 'POST',
  body: {
    username: 'hi',
    password: 'there',
  },
  signal: abortController.signal
});
```

It is best practice for requests to have an
[AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort).
You should ensure that `AbortController.abort()` is called when the component is unmounted
if the request is not yet completed.

In a React Component this is usually accomplished by making the request
in a [`useEffect` hook](https://reactjs.org/docs/hooks-effect.html):

```typescript
useEffect(() => {
  const abortController = new AbortController();
  someFetchFunction(abortController)
    .then(setResult)
    .catch(setError);
  return () => abortController.abort();
}, []);
```

## API Objects

Some API objects are made available via React hooks (or via framework-agnostic subscriptions).
The hooks are in
[`@openmrs/esm-react-utils`](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/docs/API.md),
and the subscription-yielding equivalents are in
[`@openmrs/esm-api`](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/docs/API.md#api-object-functions).
See for example [`useVisitTypes`](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/docs/API.md#usevisittypes)
and the corresponding [`getVisitTypes`](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-api/docs/API.md#getvisittypes).
