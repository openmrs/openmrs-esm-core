# openmrs-esm-api

An [OpenMRS Microfrontend](https://wiki.openmrs.org/display/projects/Frontend+-+SPA+and+Microfrontends) helper library.

[API Docs](docs/API.md)

## Contents

<!-- toc -->

- [What is this?](#what-is-this)
- [How do I use it?](#how-do-i-use-it)
- [Contributing / Development](#contributing--development)

<!-- tocstop -->

## What is this?

openmrs-esm-api is an [in-browser javascript module](https://github.com/openmrs/openmrs-rfc-frontend/blob/master/text/0002-modules.md) that exports functions that interact with the OpenMRS API.

## How do I use it?

```js
import { openmrsFetch, openmrsObservableFetch, getCurrentUser, fhir } from '@openmrs/esm-api';
openmrsFetch('/ws/rest/v1/session').then(response => {
  console.log(response.data.authenticated)
}
```

See the [API Docs](docs/API.md) for more.

## Contributing / Development

[Instructions for local development](https://wiki.openmrs.org/display/projects/Setup+local+development+environment+for+OpenMRS+SPA)
